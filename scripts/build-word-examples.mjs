// Writes src/data/word-examples.json = { "<lemma>|<reading>": [ja, th, youtube_id, start_ms] }:
// one short real example sentence (with its Thai subtitle) per content word, for the flashcards.
// Picks the line closest to 8–22 characters, preferring human (manual) Japanese subtitles and easier clips.
// Run after scripts/tokenize-captions.mjs (and with build-word-index.mjs).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSharedRules, ROOT } from './lib/shared-rules.mjs';

const { lemmaReadingOf, NON_CONTENT_IPA_POS } = await loadSharedRules();
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const OUT = join(ROOT, 'src', 'data', 'word-examples.json');
const SKIP = new Set(['SX_ViT4Ra7k']); // song lyrics

// Clip level per youtube_id from the video records (lower level = easier example).
const mock = readFileSync(join(ROOT, 'src', 'data', 'mockVideos.ts'), 'utf8');
const level = {};
for (const m of mock.matchAll(/"youtube_id":\s*"([^"]+)"[\s\S]*?"primary_jlpt":\s*"N(\d)"/g)) level[m[1]] ??= 6 - Number(m[2]);

const lenScore = (n) => (n < 8 ? 8 - n : n > 22 ? (n - 22) * 0.6 : 0);
const best = {};
for (const f of readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json') && f !== 'word-index.json')) {
  const rec = JSON.parse(readFileSync(join(CAPTION_DIR, f), 'utf8'));
  const id = rec.youtube_id ?? f.replace(/\.json$/, '');
  if (SKIP.has(id)) continue;
  const manual = rec.source?.ja === 'manual';
  for (const line of rec.lines) {
    if (!line.ja || !line.th) continue;
    const ja = line.ja.trim();
    const n = ja.replace(/\s+/g, '').length;
    if (n < 4 || n > 40) continue;
    const score = lenScore(n) + (manual ? 0 : 6) + (level[id] ?? 3);
    for (const t of line.tokens ?? []) {
      if (NON_CONTENT_IPA_POS.has(t.pos)) continue;
      const { lemma, reading } = lemmaReadingOf(t);
      if (!lemma) continue;
      const key = `${lemma}|${reading}`;
      if (!best[key] || score < best[key].score) best[key] = { score, ex: [ja, line.th, id, line.start_ms] };
    }
  }
}
const out = Object.fromEntries(Object.entries(best).map(([k, v]) => [k, v.ex]));
writeFileSync(OUT, JSON.stringify(out) + '\n', 'utf8');
console.log(`word-examples.json: ${Object.keys(out).length} words, ${(statSync(OUT).size / 1024).toFixed(0)} KB`);
