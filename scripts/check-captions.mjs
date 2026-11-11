// Gate run by `npm run bundle`: fails if any caption line shows Thai without Japanese
// (the player would show an empty Japanese row). Warns when a clip has many Thai cues
// with no Japanese speech (music/action), so a bad auto-Japanese track is noticed.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'captions');
const WARN_NULL_SHARE = 0.3;
let errors = 0;
for (const f of readdirSync(dir).filter((n) => n.endsWith('.json') && n !== 'word-index.json')) {
  const { lines = [] } = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const thOnly = lines.filter((l) => l.th && !l.ja);
  const share = lines.length ? thOnly.length / lines.length : 0;
  if (thOnly.length && !(lines.length && share <= WARN_NULL_SHARE && f && isThaiTimeline(lines))) {
    // Files built on the Thai timeline may keep a few cues with no Japanese speech; anything else is a bug.
    console.error(`FAIL ${f}: ${thOnly.length}/${lines.length} lines have Thai but no Japanese (first at ${thOnly[0].start_ms} ms)`);
    errors++;
  } else if (thOnly.length) {
    console.log(`ok   ${f}: ${thOnly.length}/${lines.length} Thai cues without Japanese speech (${(share * 100).toFixed(0)}%)`);
  }
}
function isThaiTimeline(lines) {
  return lines.every((l) => l.th); // one line per Thai cue
}
if (errors) {
  console.error(`\n${errors} caption file(s) need fixing: run python -X utf8 scripts/realign-to-thai.py <ids> (auto ja + manual th).`);
  process.exit(1);
}
console.log('captions ok');
