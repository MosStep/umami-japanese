// Exports caption lines that still need a Thai translation into translator batches.
//   node scripts/export-untranslated.mjs
// A line needs Thai when it has Japanese text AND (th is empty or the file's source.th is "auto").
// Manual Thai is never exported. Output (clears old batches first):
//   .superpowers/translate/<youtube_id>-<n>.json  up to 150 entries each: [{ key, ja, en?, prev, next }]
//   .superpowers/translate/INDEX.md               batch list with line counts and series names
// Translators write the matching <youtube_id>-<n>.th.json; scripts/import-translations.mjs merges it back.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const MOCK_FILE = join(ROOT, 'src', 'data', 'mockVideos.ts');
const OUT_DIR = join(ROOT, '.superpowers', 'translate');
const BATCH_SIZE = 150;

const needsThai = (file, line) => Boolean(line.ja) && (!line.th || file.source?.th === 'auto');

// Context text for prev/next: the Thai when the line is already final, otherwise the Japanese.
const contextText = (file, line) => {
  if (!line) return '';
  if (line.th && !needsThai(file, line)) return line.th;
  return line.ja ?? '';
};

// Series names: the title field that follows each youtube_id in mockVideos.ts.
const titles = new Map();
for (const m of readFileSync(MOCK_FILE, 'utf8').matchAll(/"youtube_id":\s*"([^"]+)",\s*"title":\s*"((?:[^"\\]|\\.)*)"/g)) {
  titles.set(m[1], JSON.parse(`"${m[2]}"`));
}

// Clear old batch files and index.
mkdirSync(OUT_DIR, { recursive: true });
for (const name of readdirSync(OUT_DIR)) {
  if (name.endsWith('.json') || name === 'INDEX.md') rmSync(join(OUT_DIR, name));
}

const captionFiles = readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json')).sort();
const batchRows = [];
let totalLines = 0;

for (const fileName of captionFiles) {
  const file = JSON.parse(readFileSync(join(CAPTION_DIR, fileName), 'utf8'));
  const id = file.youtube_id;
  if (!id || id !== fileName.replace(/\.json$/, '')) throw new Error(`${fileName}: youtube_id mismatch`);
  const seen = new Set();
  for (const line of file.lines) {
    const key = String(line.start_ms);
    if (seen.has(key)) throw new Error(`${fileName}: duplicate start_ms ${key}, keys would be ambiguous`);
    seen.add(key);
  }

  const todo = file.lines
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => needsThai(file, line));
  if (todo.length === 0) continue;

  const series = titles.get(id);
  if (!series) throw new Error(`${id}: no title in src/data/mockVideos.ts`);

  for (let b = 0; b * BATCH_SIZE < todo.length; b++) {
    const chunk = todo.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const batch = chunk.map(({ line, i }) => {
      const entry = { key: String(line.start_ms), ja: line.ja };
      if (line.en) entry.en = line.en;
      entry.prev = contextText(file, file.lines[i - 1]);
      entry.next = contextText(file, file.lines[i + 1]);
      return entry;
    });
    const batchName = `${id}-${b + 1}.json`;
    writeFileSync(join(OUT_DIR, batchName), JSON.stringify(batch, null, 2) + '\n', 'utf8');
    batchRows.push({ batchName, count: batch.length, series });
    totalLines += batch.length;
  }
}

const indexLines = [
  '# Thai translation batches',
  '',
  'Each batch is a JSON array of caption lines that need Thai. Write the translation to the',
  'same name with `.th.json` as `[{ "key": "<start_ms>", "th": "..." }]`, one entry per key.',
  '',
  '| Batch file | Lines | Series |',
  '| --- | ---: | --- |',
  ...batchRows.map((r) => `| \`${r.batchName}\` | ${r.count} | ${r.series} |`),
  `| **Total** (${batchRows.length} batches) | **${totalLines}** | |`,
  '',
];
writeFileSync(join(OUT_DIR, 'INDEX.md'), indexLines.join('\n'), 'utf8');

for (const r of batchRows) console.log(`${r.batchName}\t${r.count}`);
console.log(`batches: ${batchRows.length}, lines: ${totalLines}`);
console.log(`index: ${join(OUT_DIR, 'INDEX.md')}`);
