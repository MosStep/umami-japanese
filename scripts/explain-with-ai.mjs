// Writes <batch>.ex.json for the explain batches (scripts/explain-tool.mjs export) with a Tenixe chat model.
//   TENIXE_KEYS=key1,key2 node scripts/explain-with-ai.mjs [--model claude-haiku-5-5] [--limit 30] [--chunk 10] [--par 3] [batch-name ...]
// Keys come only from env (never stored). Stops on billing errors. Skips batches that already have .ex.json.
// Then: node scripts/explain-tool.mjs import && node scripts/explain-tool.mjs check
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QuotaStop, chat as tenixeChat, isStop, parseArray, requireKeys, stats } from './lib/tenixe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.superpowers', 'explain');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const MODEL = opt('--model', 'claude-haiku-5-5');
const LIMIT = Number(opt('--limit', 'Infinity'));
const CHUNK = Number(opt('--chunk', '10'));
const PAR = Number(opt('--par', '3'));
requireKeys();

const SYSTEM = `You are a Japanese teacher writing short explanations for Thai learners who watch Japanese videos with subtitles.
For each input line (ja = Japanese subtitle, th = the app's Thai subtitle, prev/next = neighbouring lines, src = "auto" if the Japanese came from speech recognition) write:
- "x": Thai, max 200 characters. What the line means in this scene, who/tone (สุภาพ/กันเอง/ห้วน/ประชด/ล้อเล่น), implied meaning. Do not just repeat the Thai subtitle.
- "g": 0-3 grammar points a learner would not get from word meanings: conjugations (〜ちゃった, 〜てる, 〜なきゃ), sentence enders (〜じゃん, 〜っけ, 〜かな), non-obvious particles, set phrases, contractions, keigo. Each {"f": exact text copied from the line, "b": base form/pattern max 24 chars, "e": Thai max 140 chars, what it does here}. Skip plain nouns/ordinary words. Omit "g" if nothing is worth explaining.
- "fix": ONLY when src is "auto" and the Japanese is clearly mis-heard and the Thai + context make the real words certain: the corrected Japanese. Then "f" must quote the corrected text. Never guess; never for src "manual".
Rules: explain the Japanese correctly even if the Thai subtitle is loose. If unsure about a grammar point, leave it out. Natural, simple Thai. No made-up rules.
Output ONLY a JSON array: [{"key","x","g"?,"fix"?}] with every input key, in the same order. No markdown.
Example input: [{"key":"a:1","ja":"あなたの国の言葉では、なんと呼びますか?","th":"ในภาษาของทุกคนเรียกตัวนี้ว่าอะไรกันคะ?","prev":"日本語だと、このポケモンの名前は「ケロマツ」だそうです。","src":"manual"}]
Example output: [{"key":"a:1","x":"พิธีกรหันมาถามผู้ชมอย่างสุภาพว่า โปเกมอนตัวนี้ในภาษาของประเทศผู้ชมเรียกว่าอะไร ต่อจากที่เพิ่งบอกชื่อภาษาญี่ปุ่นไป","g":[{"f":"では","b":"〜では","e":"で (ใน) + は (หัวข้อ) = 'ในภาษาของคุณนั้น…' ตั้งขอบเขตเพื่อเทียบกับภาษาญี่ปุ่น"},{"f":"なんと呼びますか","b":"何と呼ぶ","e":"なんと = ว่าอะไร + 呼びます รูปสุภาพของ 呼ぶ → 'เรียกว่าอะไรคะ'"}]}]`;

let skipped = 0;
const chat = (messages) => tenixeChat(MODEL, messages, MODEL.startsWith("deepseek") ? 24000 : 6000);

// Returns the explained entries of the chunk. A chunk whose answer stays unusable (bad JSON, missing keys) is
// split in two and retried; a single line that still fails is left out (it is exported again next time).
async function explainChunk(entries, src) {
  const input = entries.map((e) => ({ key: e.key, ja: e.ja, th: e.th, prev: e.prev?.ja ?? '', next: e.next?.ja ?? '', src }));
  const messages = [{ role: 'system', content: SYSTEM }, { role: 'user', content: JSON.stringify(input) }];
  for (let attempt = 1; attempt <= 2; attempt++) {
    let out;
    try { out = parseArray(await chat(messages)).filter((o) => o && o.key); }
    catch (e) {
      if (isStop(e)) throw e;
      continue;
    }
    const byKey = Object.fromEntries(out.map((o) => [o.key, o]));
    if (entries.every((e) => byKey[e.key]?.x)) {
      return entries.map((e) => { const o = byKey[e.key]; return { key: e.key, x: o.x, ...(o.g?.length ? { g: o.g } : {}), ...(o.fix && src === 'auto' ? { fix: o.fix } : {}) }; });
    }
  }
  if (entries.length === 1) { skipped++; return []; }
  const mid = Math.ceil(entries.length / 2);
  return [...(await explainChunk(entries.slice(0, mid), src)), ...(await explainChunk(entries.slice(mid), src))];
}

const sourceOf = (batch) => {
  const id = batch.replace(/-\d+$/, '');
  return JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'captions', `${id}.json`), 'utf8')).source?.ja ?? 'manual';
};

async function main() {
  let batches = readdirSync(DIR).filter((f) => /-\d+\.json$/.test(f) && !f.endsWith('.ex.json')).map((f) => f.slice(0, -5));
  if (args.length) batches = batches.filter((b) => args.includes(b));
  const order = readFileSync(join(DIR, 'INDEX.md'), 'utf8').match(/^\| (\S+-\d+) \|/gm)?.map((s) => s.slice(2, -2)) ?? [];
  batches.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  let budget = LIMIT, done = 0;
  const t0 = Date.now();
  for (const batch of batches) {
    if (budget <= 0) break;
    if (existsSync(join(DIR, `${batch}.ex.json`))) continue;
    let entries = JSON.parse(readFileSync(join(DIR, `${batch}.json`), 'utf8'));
    const partial = entries.length > budget;
    if (partial) entries = entries.slice(0, budget);
    const src = sourceOf(batch);
    const chunks = [];
    for (let i = 0; i < entries.length; i += CHUNK) chunks.push(entries.slice(i, i + CHUNK));
    const results = new Array(chunks.length);
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(PAR, chunks.length) }, async () => {
      while (next < chunks.length) { const i = next++; results[i] = await explainChunk(chunks[i], src); }
    }));
    const out = results.flat();
    if (partial || out.length < entries.length) { // import requires the full batch key list: rewrite the batch to the explained part
      const got = new Set(out.map((o) => o.key));
      writeFileSync(join(DIR, `${batch}.json`), JSON.stringify(entries.filter((e) => got.has(e.key)), null, 1) + '\n');
    }
    if (!out.length) continue;
    writeFileSync(join(DIR, `${batch}.ex.json`), JSON.stringify(out, null, 1) + '\n');
    budget -= out.length; done += out.length;
    console.log(`${batch}: ${out.length} lines (total ${done}, ${Math.round((Date.now() - t0) / 1000)}s, calls ${stats.calls}, tokens in ${stats.tokIn} out ${stats.tokOut})`);
  }
  console.log(`done ${done} lines with ${MODEL}; skipped ${skipped}; calls ${stats.calls}; tokens in ${stats.tokIn} out ${stats.tokOut}`);
}

main().catch((e) => {
  console.error(e instanceof QuotaStop ? `QUOTA STOP: ${e.message}` : isStop(e) ? `BILLING STOP: ${e.message}` : `FAILED: ${e.message}`);
  process.exit(e instanceof QuotaStop ? 3 : 1);
});
