// Builds src/data/kanji.json: every kanji used in the clips' words, most frequent first, with the clip words that
// contain it (lemma, reading, Thai meaning). Readings/meanings of the kanji itself come from the optional
// src/data/kanji-notes.json { "<kanji>": { "on": "...", "kun": "...", "th": "..." } } written offline.
//   node scripts/build-kanji.mjs
// Output: [{ k, n: occurrences in clips, w: [[lemma, reading, thai], ...] (up to 8), on?, kun?, th? }]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const index = JSON.parse(readFileSync(join(DATA, 'captions', 'word-index.json'), 'utf8'));
const glossary = JSON.parse(readFileSync(join(DATA, 'glossary.json'), 'utf8'));
const notes = existsSync(join(DATA, 'kanji-notes.json')) ? JSON.parse(readFileSync(join(DATA, 'kanji-notes.json'), 'utf8')) : {};

// Built-in dictionary words (linked words have no glossary entry): lemma|reading -> first Thai meaning.
const dictMeaning = {};
const mock = readFileSync(join(DATA, 'mockVideos.ts'), 'utf8');
const dictStart = mock.indexOf('DICTIONARY_WORDS');
for (const m of mock.slice(dictStart).matchAll(/"lemma":\s*"([^"]+)",\s*"reading_kana":\s*"([^"]+)"[\s\S]*?"core_meanings":\s*\[\s*"([^"]*)"/g)) {
  dictMeaning[`${m[1]}|${m[2]}`] ??= m[3];
}

const KANJI = /[一-鿿々]/g;
const wordFreq = new Map();
for (const keys of Object.values(index)) for (const k of keys) wordFreq.set(k, (wordFreq.get(k) ?? 0) + 1);

const byKanji = new Map();
for (const [key, n] of wordFreq) {
  const [lemma, reading = ''] = key.split('|');
  const chars = new Set((lemma.match(KANJI) ?? []).filter((c) => c !== '々'));
  if (!chars.size) continue;
  const th = glossary[key] ?? dictMeaning[key] ?? '';
  for (const c of chars) {
    let e = byKanji.get(c);
    if (!e) byKanji.set(c, (e = { k: c, n: 0, words: new Map() }));
    e.n += n;
    const prev = e.words.get(lemma);
    // Dictionary-form reading: its kana ending matches the lemma's (行く|いく, not the conjugated 行く|いっ).
    const tail = lemma.match(/[぀-ゟ]+$/)?.[0] ?? '';
    const fits = (r) => !tail || r.endsWith(tail);
    const better = !prev || (fits(reading) && !fits(prev.reading)) || (fits(reading) === fits(prev.reading) && n > prev.best);
    e.words.set(lemma, {
      lemma,
      reading: better ? reading : prev.reading,
      th: (better ? th : prev.th) || prev?.th || th,
      n: (prev?.n ?? 0) + n,
      best: better ? n : prev.best,
    });
  }
}

const out = [...byKanji.values()]
  .filter((e) => e.n >= 2)
  .sort((a, b) => b.n - a.n)
  .map((e) => ({
    k: e.k,
    n: e.n,
    w: [...e.words.values()]
      .filter((w) => w.th)
      .sort((a, b) => b.n - a.n)
      .slice(0, 8)
      .map((w) => [w.lemma, w.reading, w.th.split(', ')[0]]),
    ...(notes[e.k] ?? {}),
  }))
  .filter((e) => e.w.length);
writeFileSync(join(DATA, 'kanji.json'), JSON.stringify(out));
console.log(`${out.length} kanji, with notes ${out.filter((e) => e.th).length}`);
