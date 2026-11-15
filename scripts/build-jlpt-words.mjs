// Builds src/data/jlpt-words.json: for each JLPT level, the clip words (word-index keys "<lemma>|<reading>") that are
// on that level's vocabulary list (scripts/data/jlpt_vocab.csv). Drives "I know all N5", the vocabulary check and the
// JLPT readiness page. A word on several lists counts at its easiest level.
//   node scripts/build-jlpt-words.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const clean = (s) => s.replace(/\(.*?\)|（.*?）/g, '').replace(/[～〜~]/g, '').trim();

// Minimal CSV parser (quoted fields may hold commas).
const rows = [];
for (const line of readFileSync(join(ROOT, 'scripts', 'data', 'jlpt_vocab.csv'), 'utf8').split(/\r?\n/).slice(1)) {
  if (!line.trim()) continue;
  const cells = [];
  let cur = '';
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { cells.push(cur); cur = ''; }
    else cur += ch;
  }
  cells.push(cur);
  const [expr, reading, level] = cells;
  if (LEVELS.includes(level)) rows.push({ exprs: expr.split(/[,、]/).map(clean).filter(Boolean), reading: toHira(clean(reading)), level });
}

const byExprReading = new Map();
const byExpr = new Map();
const better = (a, b) => (!a || LEVELS.indexOf(b) < LEVELS.indexOf(a) ? b : a);
for (const r of rows) {
  for (const e of r.exprs) {
    byExprReading.set(`${e}|${r.reading}`, better(byExprReading.get(`${e}|${r.reading}`), r.level));
    byExpr.set(e, better(byExpr.get(e), r.level));
  }
}

const index = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'captions', 'word-index.json'), 'utf8'));
const freq = new Map();
for (const keys of Object.values(index)) for (const k of keys) freq.set(k, (freq.get(k) ?? 0) + 1);

const out = Object.fromEntries(LEVELS.map((l) => [l, []]));
for (const key of freq.keys()) {
  const [lemma, reading = ''] = key.split('|');
  if (!lemma || !/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(lemma)) continue;
  if (/^[\p{Script=Hiragana}\p{Script=Katakana}]$/u.test(lemma)) continue; // single-kana prefixes/particles (お, ご, ん)
  const r = toHira(reading);
  // Exact (lemma, reading) first; a kanji lemma alone is reliable too; a kana-only lemma needs its reading to match.
  const lvl = byExprReading.get(`${lemma}|${r}`) ?? (/\p{Script=Han}/u.test(lemma) ? byExpr.get(lemma) : byExprReading.get(`${toHira(lemma)}|${r}`) ?? byExpr.get(toHira(lemma)));
  if (lvl) out[lvl].push(key);
}
// Most frequent in the clips first (the vocabulary check samples from the top).
for (const l of LEVELS) out[l].sort((a, b) => freq.get(b) - freq.get(a));

writeFileSync(join(ROOT, 'src', 'data', 'jlpt-words.json'), JSON.stringify(out));
console.log(LEVELS.map((l) => `${l} ${out[l].length}`).join(', '));
