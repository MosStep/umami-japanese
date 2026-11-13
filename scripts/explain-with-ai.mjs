// Writes <batch>.ex.json for the explain batches (scripts/explain-tool.mjs export) with a Tenixe chat model.
//   TENIXE_KEYS=key1,key2 node scripts/explain-with-ai.mjs [--model claude-haiku-5-5] [--limit 30] [--chunk 10] [--par 3] [batch-name ...]
// Keys come only from env (never stored). Stops on billing errors. Skips batches that already have .ex.json.
// Then: node scripts/explain-tool.mjs import && node scripts/explain-tool.mjs check
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.superpowers', 'explain');
const BASE = 'https://api.tenixe.com/api/v1';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const MODEL = opt('--model', 'claude-haiku-5-5');
const LIMIT = Number(opt('--limit', 'Infinity'));
const CHUNK = Number(opt('--chunk', '10'));
const PAR = Number(opt('--par', '3'));
const KEYS = (process.env.TENIXE_KEYS || '').split(',').filter(Boolean);
if (!KEYS.length) { console.error('set TENIXE_KEYS'); process.exit(2); }

const SYSTEM = `You are a Japanese teacher writing short explanations for Thai learners who watch Japanese videos with subtitles.
For each input line (ja = Japanese subtitle, th = the app's Thai subtitle, prev/next = neighbouring lines, src = "auto" if the Japanese came from speech recognition) write:
- "x": Thai, max 200 characters. What the line means in this scene, who/tone (สุภาพ/กันเอง/ห้วน/ประชด/ล้อเล่น), implied meaning. Do not just repeat the Thai subtitle.
- "g": 0-3 grammar points a learner would not get from word meanings: conjugations (〜ちゃった, 〜てる, 〜なきゃ), sentence enders (〜じゃん, 〜っけ, 〜かな), non-obvious particles, set phrases, contractions, keigo. Each {"f": exact text copied from the line, "b": base form/pattern max 24 chars, "e": Thai max 140 chars, what it does here}. Skip plain nouns/ordinary words. Omit "g" if nothing is worth explaining.
- "fix": ONLY when src is "auto" and the Japanese is clearly mis-heard and the Thai + context make the real words certain: the corrected Japanese. Then "f" must quote the corrected text. Never guess; never for src "manual".
Rules: explain the Japanese correctly even if the Thai subtitle is loose. If unsure about a grammar point, leave it out. Natural, simple Thai. No made-up rules.
Output ONLY a JSON array: [{"key","x","g"?,"fix"?}] with every input key, in the same order. No markdown.
Example input: [{"key":"a:1","ja":"あなたの国の言葉では、なんと呼びますか?","th":"ในภาษาของทุกคนเรียกตัวนี้ว่าอะไรกันคะ?","prev":"日本語だと、このポケモンの名前は「ケロマツ」だそうです。","src":"manual"}]
Example output: [{"key":"a:1","x":"พิธีกรหันมาถามผู้ชมอย่างสุภาพว่า โปเกมอนตัวนี้ในภาษาของประเทศผู้ชมเรียกว่าอะไร ต่อจากที่เพิ่งบอกชื่อภาษาญี่ปุ่นไป","g":[{"f":"では","b":"〜では","e":"で (ใน) + は (หัวข้อ) = 'ในภาษาของคุณนั้น…' ตั้งขอบเขตเพื่อเทียบกับภาษาญี่ปุ่น"},{"f":"なんと呼びますか","b":"何と呼ぶ","e":"なんと = ว่าอะไร + 呼びます รูปสุภาพของ 呼ぶ → 'เรียกว่าอะไรคะ'"}]}]`;

class BillingStop extends Error {}
let tokIn = 0, tokOut = 0, calls = 0, skipped = 0;

async function chatOnce(key, messages) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 6000, stream: true, stream_options: { include_usage: true } }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  let text = '', buf = '';
  const dec = new TextDecoder();
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const p = line.slice(5).trim();
      if (p === '[DONE]') continue;
      const e = JSON.parse(p);
      if (e.error) throw new Error(JSON.stringify(e.error).slice(0, 300));
      text += e.choices?.[0]?.delta?.content ?? '';
      if (e.usage) { tokIn += e.usage.prompt_tokens ?? 0; tokOut += e.usage.completion_tokens ?? 0; }
    }
  }
  if (!text.trim()) throw new Error('empty completion');
  return text;
}

async function chat(messages) {
  let last;
  for (let round = 0; round < 3; round++) {
    for (const key of KEYS) {
      try { calls++; return await chatOnce(key, messages); }
      catch (e) {
        last = e;
        if (/unpaid|add credits|wallet/i.test(e.message)) throw new BillingStop(e.message);
        if (/^(402|429)|quota|insufficient/i.test(e.message)) continue; // next key, this call only
      }
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  throw last;
}

function parseArray(text) {
  const a = text.indexOf('['), b = text.lastIndexOf(']');
  if (a < 0 || b < a) throw new Error('no JSON array');
  return JSON.parse(text.slice(a, b + 1));
}

// Returns the explained entries of the chunk. A chunk whose answer stays unusable (bad JSON, missing keys) is
// split in two and retried; a single line that still fails is left out (it is exported again next time).
async function explainChunk(entries, src) {
  const input = entries.map((e) => ({ key: e.key, ja: e.ja, th: e.th, prev: e.prev?.ja ?? '', next: e.next?.ja ?? '', src }));
  const messages = [{ role: 'system', content: SYSTEM }, { role: 'user', content: JSON.stringify(input) }];
  for (let attempt = 1; attempt <= 2; attempt++) {
    let out;
    try { out = parseArray(await chat(messages)).filter((o) => o && o.key); }
    catch (e) {
      if (e instanceof BillingStop || /^(402|429)|quota|insufficient/i.test(e.message)) throw e;
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
    console.log(`${batch}: ${out.length} lines (total ${done}, ${Math.round((Date.now() - t0) / 1000)}s, calls ${calls}, tokens in ${tokIn} out ${tokOut})`);
  }
  console.log(`done ${done} lines with ${MODEL}; skipped ${skipped}; calls ${calls}; tokens in ${tokIn} out ${tokOut}`);
}

main().catch((e) => { console.error(e instanceof BillingStop ? `BILLING STOP: ${e.message}` : `FAILED: ${e.message}`); process.exit(1); });
