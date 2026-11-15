// Writes <batch>.th.json for the translation batches (scripts/export-untranslated.mjs) with a Tenixe chat model.
//   TENIXE_KEYS=key1,key2 node scripts/translate-with-ai.mjs [--model claude-haiku-5-5] [--chunk 40] [--par 2] [batch-name ...]
// Keys come only from env (never stored). Resumable: finished chunks are kept in <batch>.part.json, finished batches
// are skipped. Stops cleanly when every key is out of credits (exit 3) or on a billing error (exit 1).
// Then: node scripts/import-translations.mjs && node scripts/import-translations.mjs --check
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QuotaStop, chat, isStop, parseArray, requireKeys, stats } from './lib/tenixe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.superpowers', 'translate');
const MOCK = readFileSync(join(ROOT, 'src', 'data', 'mockVideos.ts'), 'utf8');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const MODEL = opt('--model', 'claude-haiku-5-5');
const CHUNK = Number(opt('--chunk', '40'));
const PAR = Number(opt('--par', '2'));
// Reasoning models (deepseek-v4-flash) need a large budget or they return nothing.
const MAX_TOKENS = Number(opt('--max', MODEL.startsWith('deepseek') ? '24000' : '6000'));
requireKeys();

const JAPANESE = /[぀-ヿ㐀-䶿一-鿿ｦ-ﾟ]/;
const THAI = /[฀-๿]/;

const SYSTEM = `You translate Japanese video subtitles into Thai for Thai learners of Japanese. Each line is shown under the Japanese line while the video plays.
Input: a JSON array of lines {key, ja, prev, next, en?}. "prev"/"next" are the neighbouring lines (sentences are often split across lines). "en" (when present) is a reference only.
Rules:
- Translate "ja" only (not prev/next), as natural spoken Thai that matches the speaker: casual speech stays casual (ไม่ต้องใส่ครับ/ค่ะ), polite です/ます speech → ครับ/ค่ะ. Keep it short like a real subtitle.
- The Japanese often comes from speech recognition (YouTubers / VTubers talking fast): wrong kanji, missing particles, split sentences. Work out what was most plausibly said from the context and translate that. If a line is only noise or a filler, give a short natural rendering ("อืม…", "เอ๊ะ!", "นั่นแหละ").
- Names of people, channels, games and products: Thai transliteration (ฮิคาคิน, เปโกระ, มารีน, โฮโลไลฟ์, นิจิซันจิ) or keep Latin letters (iPhone, YouTube).
- Write real Thai: no English words mixed in (อิมแพกต์, not "impact") except names and brands.
- "th" must contain NO hiragana, katakana or kanji, and must never be empty. No notes, no brackets with explanations, no romaji.
Output ONLY a JSON array [{"key": "<same key>", "th": "<Thai>"}] with every input key in the same order. No markdown.`;

const titleOf = (id) => {
  const m = MOCK.match(new RegExp(`"youtube_id":\\s*"${id.replace(/[-_]/g, '\\$&')}",\\s*"title":\\s*"((?:[^"\\\\]|\\\\.)*)",\\s*"japanese_title":\\s*"((?:[^"\\\\]|\\\\.)*)",\\s*"channel":\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? `Video: ${JSON.parse(`"${m[2]}"`)} — channel ${JSON.parse(`"${m[3]}"`)}` : '';
};

let fallbacks = 0;

// Translated entries for the chunk, in order. An unusable answer splits the chunk; a single line that still fails
// gets a neutral placeholder so the batch can be imported (it is counted and printed).
async function translateChunk(entries, context) {
  const input = entries.map((e) => ({ key: e.key, ja: e.ja, prev: e.prev ?? '', next: e.next ?? '', ...(e.en ? { en: e.en } : {}) }));
  const messages = [{ role: 'system', content: SYSTEM }, { role: 'user', content: `${context}\n${JSON.stringify(input)}` }];
  for (let attempt = 1; attempt <= 2; attempt++) {
    let out;
    try { out = parseArray(await chat(MODEL, messages, MAX_TOKENS)).filter((o) => o && o.key !== undefined); }
    catch (e) { if (isStop(e)) throw e; continue; }
    const byKey = Object.fromEntries(out.map((o) => [String(o.key), o]));
    const ok = (e) => { const th = byKey[e.key]?.th; return typeof th === 'string' && th.trim() && THAI.test(th) && !JAPANESE.test(th); };
    if (entries.every(ok)) return entries.map((e) => ({ key: e.key, th: byKey[e.key].th.trim() }));
    if (entries.length === 1) continue;
    // Keep the good lines, redo only the bad ones.
    const bad = entries.filter((e) => !ok(e));
    if (bad.length < entries.length) {
      const redo = Object.fromEntries((await translateChunk(bad, context)).map((o) => [o.key, o]));
      return entries.map((e) => (ok(e) ? { key: e.key, th: byKey[e.key].th.trim() } : redo[e.key]));
    }
  }
  if (entries.length === 1) { fallbacks++; console.error(`placeholder for ${entries[0].key}: ${entries[0].ja}`); return [{ key: entries[0].key, th: '(เสียงไม่ชัด)' }]; }
  const mid = Math.ceil(entries.length / 2);
  return [...(await translateChunk(entries.slice(0, mid), context)), ...(await translateChunk(entries.slice(mid), context))];
}

async function main() {
  let batches = readdirSync(DIR).filter((f) => /-\d+\.json$/.test(f) && !/\.(th|part)\.json$/.test(f)).map((f) => f.slice(0, -5)).sort();
  if (args.length) batches = batches.filter((b) => args.includes(b));
  let done = 0;
  const t0 = Date.now();
  for (const batch of batches) {
    const thFile = join(DIR, `${batch}.th.json`);
    if (existsSync(thFile)) continue;
    const entries = JSON.parse(readFileSync(join(DIR, `${batch}.json`), 'utf8'));
    const partFile = join(DIR, `${batch}.part.json`);
    const have = existsSync(partFile) ? JSON.parse(readFileSync(partFile, 'utf8')) : {};
    const context = titleOf(batch.replace(/-\d+$/, ''));
    const chunks = [];
    const todo = entries.filter((e) => !have[e.key]);
    for (let i = 0; i < todo.length; i += CHUNK) chunks.push(todo.slice(i, i + CHUNK));
    let next = 0;
    let stop = null;
    await Promise.all(Array.from({ length: Math.min(PAR, chunks.length) }, async () => {
      while (next < chunks.length && !stop) {
        const i = next++;
        try {
          for (const o of await translateChunk(chunks[i], context)) have[o.key] = o.th;
          writeFileSync(partFile, JSON.stringify(have));
        } catch (e) { stop = e; }
      }
    }));
    if (stop) throw stop;
    writeFileSync(thFile, JSON.stringify(entries.map((e) => ({ key: e.key, th: have[e.key] })), null, 1) + '\n');
    rmSync(partFile, { force: true });
    done += entries.length;
    console.log(`${batch}: ${entries.length} lines (total ${done}, ${Math.round((Date.now() - t0) / 1000)}s, calls ${stats.calls}, tokens in ${stats.tokIn} out ${stats.tokOut}, placeholders ${fallbacks})`);
  }
  console.log(`done ${done} lines with ${MODEL}; placeholders ${fallbacks}; calls ${stats.calls}; tokens in ${stats.tokIn} out ${stats.tokOut}`);
}

main().catch((e) => {
  console.error(e instanceof QuotaStop ? `QUOTA STOP: ${e.message}` : isStop(e) ? `BILLING STOP: ${e.message}` : `FAILED: ${e.message}`);
  process.exit(e instanceof QuotaStop ? 3 : 1);
});
