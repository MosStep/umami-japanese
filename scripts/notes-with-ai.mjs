// Writes the offline notes for the kanji pages and the grammar library with an OpenAI-compatible model.
//   AI_BASE=<gateway> TENIXE_KEYS=<key> node scripts/notes-with-ai.mjs kanji|grammar [--model M] [--par 5] [--chunk N]
// kanji   → src/data/kanji-notes.json   { "<kanji>": { on, kun, th } }        (input: src/data/kanji.json)
// grammar → src/data/grammar-notes.json { "<pattern>": { e, lv } }            (input: src/data/grammar.json)
// Resumable: existing notes are kept and skipped. Keys come only from env. Then rebuild:
//   node scripts/build-kanji.mjs && node scripts/build-grammar.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chat, isStop, parseArray, requireKeys, stats } from './lib/tenixe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const MODEL = opt('--model', 'DeepSeek-V4.1-Flash-1017');
const PAR = Number(opt('--par', '5'));
const KIND = args[0];
if (!['kanji', 'grammar'].includes(KIND)) { console.error('usage: notes-with-ai.mjs kanji|grammar'); process.exit(2); }
const CHUNK = Number(opt('--chunk', KIND === 'kanji' ? '40' : '20'));
requireKeys();

const THAI = /[฀-๿]/;
const KANA = /^[぀-ヿ・、\s.\-ー]+$/;
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

const SYSTEM = {
  kanji: `You write kanji dictionary entries for Thai learners of Japanese.
Input: a JSON array of {k, words}: a kanji and some real words that use it (lemma|reading).
For each kanji give:
- "on": the common on'yomi in katakana, separated by "、" (most common first, max 3). Empty string if it has none in common use.
- "kun": the common kun'yomi in hiragana, separated by "、", okurigana after a dot like "い.く" (max 3). Empty string if none.
- "th": the core meaning in Thai, 1-3 short meanings separated by ", " (e.g. "ไป, เดินทาง").
Be accurate: use standard Jōyō readings. No romaji. Output ONLY a JSON array [{"k","on","kun","th"}] with every input kanji in the same order.`,
  grammar: `You write a grammar reference for Thai learners of Japanese.
Input: a JSON array of {p, ex}: a grammar pattern as it was tagged in subtitle explanations, and a few example usages (Thai notes about what it did in real lines).
For each pattern write:
- "e": a general explanation in Thai, 60-200 characters: what the pattern means, how it is formed (e.g. กริยารูป て + しまう), and its nuance or politeness level. General, not tied to one example. Natural, simple Thai.
- "lv": the JLPT level where this pattern is normally taught: one of N5, N4, N3, N2, N1. For a plain particle or very basic form use N5.
If the pattern is not really grammar (a plain word, a name, a typo), give "e": "" and "lv": "".
Output ONLY a JSON array [{"p","e","lv"}] with every input pattern in the same order. No markdown.`,
};

const outFile = join(DATA, KIND === 'kanji' ? 'kanji-notes.json' : 'grammar-notes.json');
const notes = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {};

let items;
if (KIND === 'kanji') {
  items = JSON.parse(readFileSync(join(DATA, 'kanji.json'), 'utf8'))
    .filter((e) => !notes[e.k])
    .map((e) => ({ id: e.k, input: { k: e.k, words: e.w.slice(0, 4).map((w) => `${w[0]}|${w[1]}`) } }));
} else {
  items = JSON.parse(readFileSync(join(DATA, 'grammar.json'), 'utf8'))
    .filter((g) => !(g.p in notes))
    .map((g) => ({ id: g.p, input: { p: g.p, ex: g.x.slice(0, 3).map((x) => x[5]).filter(Boolean) } }));
}

const valid = (o) =>
  KIND === 'kanji'
    ? o && typeof o.th === 'string' && THAI.test(o.th) && typeof o.on === 'string' && typeof o.kun === 'string' && (!o.on || KANA.test(o.on)) && (!o.kun || KANA.test(o.kun))
    : o && typeof o.e === 'string' && (o.e === '' || (THAI.test(o.e) && o.e.length <= 260 && LEVELS.includes(o.lv)));

async function run(chunk) {
  const messages = [{ role: 'system', content: SYSTEM[KIND] }, { role: 'user', content: JSON.stringify(chunk.map((c) => c.input)) }];
  for (let attempt = 0; attempt < 3; attempt++) {
    let arr;
    try { arr = parseArray(await chat(MODEL, messages, 24000)); }
    catch (e) { if (isStop(e)) throw e; console.error(`chunk failed: ${String(e.message).slice(0, 120)}`); continue; }
    const byId = Object.fromEntries(arr.filter(Boolean).map((o) => [KIND === 'kanji' ? o.k : o.p, o]));
    let ok = 0;
    for (const c of chunk) {
      const o = byId[c.id];
      if (!valid(o)) continue;
      notes[c.id] = KIND === 'kanji' ? { on: o.on.trim(), kun: o.kun.trim(), th: o.th.trim() } : o.e ? { e: o.e.trim(), lv: o.lv } : null;
      ok++;
    }
    if (ok === chunk.length) return;
    chunk = chunk.filter((c) => !(c.id in notes));
    messages[1].content = JSON.stringify(chunk.map((c) => c.input));
  }
  console.error(`gave up on ${chunk.length} items: ${chunk.map((c) => c.id).join(' ')}`);
}

const chunks = [];
for (let i = 0; i < items.length; i += CHUNK) chunks.push(items.slice(i, i + CHUNK));
console.log(`${KIND}: ${items.length} to write in ${chunks.length} calls`);
let next = 0;
let done = 0;
await Promise.all(
  Array.from({ length: Math.min(PAR, chunks.length) }, async () => {
    while (next < chunks.length) {
      const i = next++;
      await run(chunks[i]);
      writeFileSync(outFile, JSON.stringify(notes, null, 1));
      done++;
      if (done % 5 === 0) console.log(`${done}/${chunks.length} calls (api calls ${stats.calls})`);
    }
  }),
);
writeFileSync(outFile, JSON.stringify(notes, null, 1));
console.log(`done: ${Object.keys(notes).length} notes in ${outFile}; api calls ${stats.calls}; tokens in ${stats.tokIn} out ${stats.tokOut}`);
