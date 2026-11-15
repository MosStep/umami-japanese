// Writes batch-<n>.th.json for the glossary batches (scripts/export-glossary.mjs) with a Tenixe chat model.
//   TENIXE_KEYS=key1,key2 node scripts/gloss-with-ai.mjs [--model claude-haiku-5-5] [--chunk 60] [--par 2]
// Keys that already have a meaning in src/data/glossary.json are copied; only new words go to the model.
// Resumable (new glosses are kept in .superpowers/glossary/ai-new.json). Exit 3 when every key is out of credits.
// Then: node scripts/import-glossary.mjs
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QuotaStop, chat, isStop, parseArray, requireKeys, stats } from './lib/tenixe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.superpowers', 'glossary');
const GLOSSARY = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'glossary.json'), 'utf8'));
const NEW_FILE = join(DIR, 'ai-new.json');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const MODEL = opt('--model', 'claude-haiku-5-5');
const CHUNK = Number(opt('--chunk', '60'));
const PAR = Number(opt('--par', '2'));
// Reasoning models (deepseek-v4-flash) need a large budget or they return nothing.
const MAX_TOKENS = Number(opt('--max', MODEL.startsWith('deepseek') ? '24000' : '6000'));
requireKeys();

const JAPANESE = /[぀-ヿ㐀-䶿一-鿿ｦ-ﾟ]/;
const THAI = /[฀-๿]/;

const SYSTEM = `You write a SHORT Thai dictionary gloss for Japanese words from video subtitles (YouTubers, VTubers, anime). A learner sees it when tapping the word.
Input: a JSON array of {k, lemma, reading, pos, ex}. "pos" is the part of speech, "ex" is one subtitle line that uses the word.
Rules:
- "th": 1-4 Thai meanings separated by ", " (comma + space), most common first; the sense used in "ex" comes first. Keep it short.
- Use "pos" for the word class (動詞 → verb meaning, 形容詞 → adjective, 名詞 → noun).
- Proper nouns (people, places, channels, games, products): Thai transliteration + type in parentheses, e.g. "เปโกระ (ชื่อคน)", "ชินจูกุ (ชื่อสถานที่)". Katakana loanwords: the Thai meaning, e.g. スマホ → "สมาร์ตโฟน".
- Interjections / fillers: meaning or function, e.g. "เอ่อ (คำอุทาน)". Suffixes / counters: short function gloss.
- Speech-recognition artifacts: give the most plausible gloss; if truly meaningless write "(คำไม่ชัดเจน)".
- "th" must contain NO hiragana, katakana or kanji and must never be empty. No romaji.
Output ONLY a JSON array [{"k": "<same k>", "th": "<gloss>"}] with every input k in the same order. No markdown.`;

const fresh = existsSync(NEW_FILE) ? JSON.parse(readFileSync(NEW_FILE, 'utf8')) : {};
const valid = (th) => typeof th === 'string' && th.trim() && THAI.test(th) && !JAPANESE.test(th) && th.split(', ').length <= 4;
let fallbacks = 0;

async function glossChunk(entries) {
  const input = entries.map((e) => ({ k: e.k, lemma: e.lemma, reading: e.reading, pos: e.pos, ex: e.ex }));
  const messages = [{ role: 'system', content: SYSTEM }, { role: 'user', content: JSON.stringify(input) }];
  for (let attempt = 1; attempt <= 2; attempt++) {
    let out;
    try { out = parseArray(await chat(MODEL, messages, MAX_TOKENS)).filter((o) => o && o.k); }
    catch (e) { if (isStop(e)) throw e; continue; }
    const byK = Object.fromEntries(out.map((o) => [o.k, o.th]));
    const bad = entries.filter((e) => !valid(byK[e.k]));
    for (const e of entries) if (valid(byK[e.k])) fresh[e.k] = byK[e.k].trim();
    if (!bad.length) return;
    if (bad.length < entries.length) return glossChunk(bad);
  }
  if (entries.length === 1) { fallbacks++; fresh[entries[0].k] = '(คำไม่ชัดเจน)'; return; }
  const mid = Math.ceil(entries.length / 2);
  await glossChunk(entries.slice(0, mid));
  await glossChunk(entries.slice(mid));
}

async function main() {
  const files = readdirSync(DIR).filter((f) => /^batch-\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6)));
  const batches = files.map((f) => ({ name: f.slice(0, -5), entries: JSON.parse(readFileSync(join(DIR, f), 'utf8')) }));
  const todo = batches.flatMap((b) => b.entries).filter((e) => !GLOSSARY[e.k] && !fresh[e.k]);
  console.log(`${batches.reduce((n, b) => n + b.entries.length, 0)} keys, ${todo.length} need a new gloss`);
  const chunks = [];
  for (let i = 0; i < todo.length; i += CHUNK) chunks.push(todo.slice(i, i + CHUNK));
  let next = 0;
  let stop = null;
  await Promise.all(Array.from({ length: Math.min(PAR, chunks.length) }, async () => {
    while (next < chunks.length && !stop) {
      const i = next++;
      try {
        await glossChunk(chunks[i]);
        writeFileSync(NEW_FILE, JSON.stringify(fresh, null, 1));
        if (i % 5 === 0) console.log(`chunk ${i + 1}/${chunks.length} (calls ${stats.calls}, tokens in ${stats.tokIn} out ${stats.tokOut})`);
      } catch (e) { stop = e; }
    }
  }));
  writeFileSync(NEW_FILE, JSON.stringify(fresh, null, 1));
  if (stop) throw stop;
  for (const b of batches) {
    writeFileSync(join(DIR, `${b.name}.th.json`), JSON.stringify(b.entries.map((e) => ({ k: e.k, th: GLOSSARY[e.k] ?? fresh[e.k] })), null, 1) + '\n');
  }
  console.log(`done: ${todo.length} new glosses with ${MODEL}; placeholders ${fallbacks}; calls ${stats.calls}; tokens in ${stats.tokIn} out ${stats.tokOut}`);
}

main().catch((e) => {
  console.error(e instanceof QuotaStop ? `QUOTA STOP: ${e.message}` : isStop(e) ? `BILLING STOP: ${e.message}` : `FAILED: ${e.message}`);
  process.exit(e instanceof QuotaStop ? 3 : 1);
});
