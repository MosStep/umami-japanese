// Builds src/data/glossary.json = { "<lemma>|<reading>": "<thai gloss>" } from the translated batches.
//   node scripts/import-glossary.mjs            strict: every exported key needs a translation, else exit 1
//   node scripts/import-glossary.mjs --partial  write the translations that exist
//   node scripts/import-glossary.mjs --check    print coverage of content tokens (no write)
// Options: --dir <glossary dir> (default .superpowers/glossary), --out <file> (default src/data/glossary.json).
// Input: batch-<n>.json (from export-glossary.mjs) and batch-<n>.th.json = [{ "k", "th" }].
// th must be non-empty, free of kana and kanji, and 1-4 meanings separated by ", ".
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDictionary, loadSharedRules, ROOT } from './lib/shared-rules.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const DIR = opt('--dir', join(ROOT, '.superpowers', 'glossary'));
const OUT = opt('--out', join(ROOT, 'src', 'data', 'glossary.json'));
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const JAPANESE = /[぀-ヿ㐀-鿿豈-﫿]/;

const errors = [];
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

// 1. Exported keys (expected set), in batch order.
const batchNums = readdirSync(DIR)
  .map((f) => f.match(/^batch-(\d+)\.json$/))
  .filter(Boolean)
  .map((m) => Number(m[1]))
  .sort((a, b) => a - b);
const expected = [];
const expectedSet = new Set();
for (const n of batchNums) {
  for (const item of readJson(join(DIR, `batch-${n}.json`))) {
    if (!item || typeof item.k !== 'string' || !item.k.includes('|')) {
      errors.push(`batch-${n}.json: bad item ${JSON.stringify(item)?.slice(0, 80)}`);
      continue;
    }
    if (expectedSet.has(item.k)) {
      errors.push(`batch-${n}.json: duplicate key ${item.k}`);
      continue;
    }
    expectedSet.add(item.k);
    expected.push(item.k);
  }
}

// 2. Translations (batch-<n>.th.json).
const th = new Map();
const missingThFiles = [];
for (const n of batchNums) {
  const path = join(DIR, `batch-${n}.th.json`);
  if (!existsSync(path)) {
    missingThFiles.push(n);
    continue;
  }
  for (const item of readJson(path)) {
    const k = item?.k;
    const text = typeof item?.th === 'string' ? item.th.trim() : '';
    if (typeof k !== 'string') {
      errors.push(`batch-${n}.th.json: item without k`);
      continue;
    }
    if (!expectedSet.has(k)) {
      errors.push(`batch-${n}.th.json: key not exported: ${k}`);
      continue;
    }
    if (th.has(k)) {
      errors.push(`batch-${n}.th.json: duplicate translation for ${k}`);
      continue;
    }
    if (!text) {
      errors.push(`batch-${n}.th.json: empty th for ${k}`);
      continue;
    }
    if (JAPANESE.test(text)) {
      errors.push(`batch-${n}.th.json: Japanese characters in th for ${k}: ${text}`);
      continue;
    }
    th.set(k, text);
  }
}
const missing = expected.filter((k) => !th.has(k));
if (missing.length && !flag('--partial') && !flag('--check')) {
  errors.push(`${missing.length} exported key(s) without a translation, first: ${missing.slice(0, 5).join(', ')}`);
}

// 3. Coverage: share of content tokens that have a Thai meaning (dictionary link or glossary).
if (flag('--check')) {
  const { lemmaReadingOf, linkDictionaryEntry, buildDictionaryByLemma, NON_CONTENT_IPA_POS } = await loadSharedRules();
  const dict = buildDictionaryByLemma(await loadDictionary());
  const glossary = existsSync(OUT) ? readJson(OUT) : {};
  const isAffix = (pos) => pos.startsWith('接頭') || pos.startsWith('接尾');
  let content = 0, linked = 0, glossed = 0, none = 0;
  for (const f of readdirSync(CAPTION_DIR).filter((x) => x.endsWith('.json') && x !== 'word-index.json')) {
    for (const line of readJson(join(CAPTION_DIR, f)).lines) {
      for (const t of line.tokens ?? []) {
        if (NON_CONTENT_IPA_POS.has(t.pos)) continue;
        content++;
        const { lemma, reading } = lemmaReadingOf(t);
        if (!isAffix(t.pos ?? '') && linkDictionaryEntry(dict, lemma, reading)) linked++;
        else if (glossary[`${lemma}|${reading}`]) glossed++;
        else none++;
      }
    }
  }
  const pct = (x) => ((x / content) * 100).toFixed(2);
  console.log(`glossary file ${OUT}: ${Object.keys(glossary).length} keys`);
  console.log(`exported keys ${expected.length}, translated ${th.size}, batch files without th: ${missingThFiles.join(', ') || 'none'}`);
  console.log(`content tokens ${content}: linked ${linked} (${pct(linked)}%), glossary ${glossed} (${pct(glossed)}%), no meaning ${none} (${pct(none)}%)`);
  console.log(`coverage with a Thai meaning: ${pct(linked + glossed)}%`);
  if (errors.length) console.log(`validation errors: ${errors.length}`);
  process.exit(errors.length ? 1 : 0);
}

if (errors.length) {
  console.error(`import failed (${errors.length} problem(s)):`);
  for (const e of errors.slice(0, 50)) console.error('  ' + e);
  process.exit(1);
}

// 4. Write compact { "<lemma>|<reading>": "<thai>" } in batch order.
const out = {};
for (const k of expected) if (th.has(k)) out[k] = th.get(k);
writeFileSync(OUT, JSON.stringify(out) + '\n', 'utf8');
console.log(`wrote ${Object.keys(out).length} keys to ${OUT}${missing.length ? ` (${missing.length} missing, --partial)` : ''}`);
