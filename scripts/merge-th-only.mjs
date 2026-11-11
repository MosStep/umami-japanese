// Merge Thai-only caption lines (ja === null, th set) into the nearest Japanese line.
// Usage: node scripts/merge-th-only.mjs [--dry]
// Rule: a Thai-only cue goes to the ja line whose [start_ms,end_ms] interval is closest to the
// cue's [start_ms,end_ms] (0 when overlapping; ties -> earlier line). Cues on one ja line are joined
// chronologically with a space (an existing manual th counts as being at its ja line's start_ms).
// An AI Thai (th_src 'ai') on a ja line is replaced when it receives manual cues; th_src is deleted.
// Ja lines keep start_ms/end_ms/ja/tokens untouched. Skips the song SX_ViT4Ra7k.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dry = process.argv.includes('--dry');
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'captions');
const SKIP = new Set(['SX_ViT4Ra7k']);
const dist = (a, b) => (a.start_ms > b.end_ms ? a.start_ms - b.end_ms : b.start_ms > a.end_ms ? b.start_ms - a.end_ms : 0);

let totalChanged = 0;
for (const f of fs.readdirSync(dir).sort()) {
  if (!f.endsWith('.json') || f === 'word-index.json') continue;
  const id = f.slice(0, -5);
  if (SKIP.has(id)) continue;
  const p = path.join(dir, f);
  const raw = fs.readFileSync(p, 'utf8');
  const o = JSON.parse(raw);
  if (!o.lines) continue;
  const only = o.lines.filter((l) => !l.ja && l.th);
  if (!only.length) continue;
  const jas = o.lines.filter((l) => l.ja);
  if (!jas.length) { console.log(id, 'NO JA LINES, skipped'); continue; }
  const got = new Map(); // ja line -> [{t, th}]
  for (const l of jas) if (l.th && l.th_src !== 'ai') got.set(l, [{ t: l.start_ms, th: l.th }]);
  const received = new Set();
  for (const c of only) {
    let best = null, bd = Infinity;
    for (const j of jas) { const d = dist(c, j); if (d < bd) { bd = d; best = j; } }
    if (!got.has(best)) got.set(best, []);
    got.get(best).push({ t: c.start_ms, th: c.th });
    received.add(best);
  }
  let changed = 0, long = 0;
  for (const j of received) {
    const cues = got.get(j).sort((a, b) => a.t - b.t);
    j.th = cues.map((c) => c.th).join(' ');
    delete j.th_src;
    changed++;
    if ([...j.th].length > 90) long++;
  }
  o.lines = o.lines.filter((l) => l.ja || !l.th);
  console.log(`${id}: th-only ${only.length} -> 0, ja lines changed ${changed}, long(>90) ${long}`);
  totalChanged++;
  if (!dry) fs.writeFileSync(p, JSON.stringify(o) + '\n');
}
console.log(dry ? 'dry run' : 'written', totalChanged, 'files');
