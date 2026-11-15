// Builds src/data/grammar.json (the grammar library) from the grammar points inside the line explanations
// (src/data/explanations/*.json, field g = [{ f, b, e }]). Patterns are grouped by their base form b.
//   node scripts/build-grammar.mjs
// Output: [{ p: pattern, n: occurrences, lv: typical clip level (median), e?: Thai summary, x: [example] }]
//   example = [youtube_id, start_ms, ja, th, f, e]  (up to 3, from different clips when possible; e = what it does there)
// e and lv come from src/data/grammar-notes.json { "<pattern>": { e, lv } | null } (scripts/notes-with-ai.mjs) when present.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EX_DIR = join(ROOT, 'src', 'data', 'explanations');
const CAP_DIR = join(ROOT, 'src', 'data', 'captions');
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const MIN_COUNT = 4;
const MAX_EXAMPLES = 3;

const mock = readFileSync(join(ROOT, 'src', 'data', 'mockVideos.ts'), 'utf8');
const level = {};
for (const m of mock.matchAll(/"youtube_id":\s*"([^"]+)"[\s\S]*?"primary_jlpt":\s*"(N\d)"/g)) level[m[1]] ??= m[2];
const notes = existsSync(join(ROOT, 'src', 'data', 'grammar-notes.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'grammar-notes.json'), 'utf8'))
  : {};

const norm = (b) => b.replace(/^[\s〜～~ー]+/, '').replace(/[\s。、]+$/, '').trim();
const groups = new Map();
for (const f of readdirSync(EX_DIR).filter((n) => n.endsWith('.json'))) {
  const ex = JSON.parse(readFileSync(join(EX_DIR, f), 'utf8'));
  const yt = ex.youtube_id;
  if (!level[yt]) continue; // clip no longer in the app
  const capFile = join(CAP_DIR, `${yt}.json`);
  const th = {};
  if (existsSync(capFile)) for (const l of JSON.parse(readFileSync(capFile, 'utf8')).lines) th[l.start_ms] = l.th ?? '';
  for (const [ms, item] of Object.entries(ex.items)) {
    for (const g of item.g ?? []) {
      const p = norm(g.b ?? '');
      if (!p || p.length > 16) continue;
      let grp = groups.get(p);
      if (!grp) groups.set(p, (grp = { p, n: 0, lvs: [], x: [] }));
      grp.n++;
      grp.lvs.push(LEVELS.indexOf(level[yt]));
      grp.x.push([yt, Number(ms), item.fix ?? item.ja, th[ms] ?? '', g.f, g.e]);
    }
  }
}

const out = [];
for (const grp of groups.values()) {
  if (grp.n < MIN_COUNT) continue;
  const note = notes[grp.p];
  if (note === null) continue; // the note writer judged it not to be grammar (a plain word, a name)
  // Examples: short lines from different clips first.
  const seen = new Set();
  const xs = [...grp.x].sort((a, b) => a[2].length - b[2].length);
  const pick = [];
  for (const x of xs) {
    if (pick.length >= MAX_EXAMPLES) break;
    if (seen.has(x[0]) || x[2].length > 40) continue;
    seen.add(x[0]);
    pick.push(x);
  }
  for (const x of xs) if (pick.length < MAX_EXAMPLES && !pick.includes(x) && x[2].length <= 40) pick.push(x);
  const lvs = grp.lvs.sort((a, b) => a - b);
  const e = typeof note === 'string' ? note : note?.e;
  const lv = note?.lv && LEVELS.includes(note.lv) ? note.lv : LEVELS[lvs[Math.floor(lvs.length / 2)]];
  out.push({ p: grp.p, n: grp.n, lv, ...(e ? { e } : {}), x: pick });
}
out.sort((a, b) => b.n - a.n);
writeFileSync(join(ROOT, 'src', 'data', 'grammar.json'), JSON.stringify(out));
console.log(`${out.length} patterns (${LEVELS.map((l) => `${l} ${out.filter((g) => g.lv === l).length}`).join(', ')})`);
