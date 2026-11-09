// Writes src/data/captions/word-index.json = { "<youtube_id>": ["<lemma>|<reading>", ...] }
// with the unique content words (not 助詞/助動詞/記号) of each caption file, in first-occurrence order.
// Run after scripts/tokenize-captions.mjs. The app resolves dictionary ids from these keys at runtime
// with the same rule as the captions (src/data/captions/link.ts), so the index does not store links.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSharedRules, ROOT } from './lib/shared-rules.mjs';

const { lemmaReadingOf, NON_CONTENT_IPA_POS } = await loadSharedRules();
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const OUT = join(CAPTION_DIR, 'word-index.json');

const files = readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json') && f !== 'word-index.json').sort();
const index = {};
for (const f of files) {
  const record = JSON.parse(readFileSync(join(CAPTION_DIR, f), 'utf8'));
  const id = record.youtube_id ?? f.replace(/\.json$/, '');
  const keys = new Set();
  for (const line of record.lines) {
    for (const t of line.tokens ?? []) {
      if (NON_CONTENT_IPA_POS.has(t.pos)) continue;
      const { lemma, reading } = lemmaReadingOf(t);
      if (lemma) keys.add(`${lemma}|${reading}`);
    }
  }
  index[id] = [...keys];
}
writeFileSync(OUT, JSON.stringify(index) + '\n', 'utf8');
const words = Object.values(index).reduce((n, a) => n + a.length, 0);
console.log(`word-index.json: ${files.length} clips, ${words} keys, ${(statSync(OUT).size / 1024).toFixed(1)} KB`);
