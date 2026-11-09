// Exports the content words that have no dictionary link (after the link rule in src/data/captions/link.ts)
// to .superpowers/glossary/batch-<n>.json, batches of at most 500, most frequent first:
//   [{ "k": "<lemma>|<reading>", "lemma", "reading", "pos", "ex": "<one ja line>", "n": <occurrences> }]
// Translators write batch-<n>.th.json; scripts/import-glossary.mjs builds src/data/glossary.json.
// Clears old batch files and INDEX.md first.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDictionary, loadSharedRules, ROOT } from './lib/shared-rules.mjs';

const BATCH_SIZE = 500;
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const OUT_DIR = join(ROOT, '.superpowers', 'glossary');

const { lemmaReadingOf, linkDictionaryEntry, buildDictionaryByLemma, NON_CONTENT_IPA_POS } = await loadSharedRules();
const dict = buildDictionaryByLemma(await loadDictionary());
const isAffix = (pos) => pos.startsWith('接頭') || pos.startsWith('接尾');

const files = readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json') && f !== 'word-index.json').sort();
const agg = new Map(); // k -> { k, lemma, reading, pos: Map<pos, count>, ex, n }
let contentTokens = 0;
let linkedTokens = 0;
for (const f of files) {
  const record = JSON.parse(readFileSync(join(CAPTION_DIR, f), 'utf8'));
  for (const line of record.lines) {
    for (const t of line.tokens ?? []) {
      if (NON_CONTENT_IPA_POS.has(t.pos)) continue;
      contentTokens++;
      const { lemma, reading } = lemmaReadingOf(t);
      const pos = t.pos || '';
      if (!isAffix(pos) && linkDictionaryEntry(dict, lemma, reading)) {
        linkedTokens++;
        continue;
      }
      const k = `${lemma}|${reading}`;
      let a = agg.get(k);
      if (!a) {
        a = { k, lemma, reading, pos: new Map(), ex: (line.ja ?? '').trim(), n: 0 };
        agg.set(k, a);
      }
      a.n++;
      a.pos.set(pos, (a.pos.get(pos) ?? 0) + 1);
    }
  }
}

const items = [...agg.values()]
  .map((a) => ({
    k: a.k,
    lemma: a.lemma,
    reading: a.reading,
    pos: [...a.pos.entries()].sort((x, y) => y[1] - x[1])[0][0],
    ex: a.ex,
    n: a.n,
  }))
  .sort((a, b) => b.n - a.n || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));

mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) {
  if (/^batch-\d+(\.th)?\.json$/.test(f) || f === 'INDEX.md') rmSync(join(OUT_DIR, f));
}
const rows = [];
let total = 0;
let unlinkedTokens = 0;
for (let i = 0, b = 1; i < items.length; i += BATCH_SIZE, b++) {
  const batch = items.slice(i, i + BATCH_SIZE);
  writeFileSync(join(OUT_DIR, `batch-${b}.json`), JSON.stringify(batch, null, 2) + '\n', 'utf8');
  const occ = batch.reduce((s, x) => s + x.n, 0);
  rows.push(`| batch-${b}.json | ${batch.length} | ${occ} |`);
  total += batch.length;
  unlinkedTokens += occ;
}
const index = [
  '# Glossary batches',
  '',
  `Keys without a dictionary link: ${total} in total (${unlinkedTokens} token occurrences).`,
  '',
  '| File | Keys | Token occurrences |',
  '|---|---|---|',
  ...rows,
  '',
].join('\n');
writeFileSync(join(OUT_DIR, 'INDEX.md'), index, 'utf8');

console.log(`content tokens ${contentTokens}, linked ${linkedTokens} (${((linkedTokens / contentTokens) * 100).toFixed(2)}%)`);
console.log(`unlinked keys ${total} in ${rows.length} batch(es), ${unlinkedTokens} token occurrences`);
