// Merges translated batches back into the caption files.
//   node scripts/import-translations.mjs          merge every .superpowers/translate/<youtube_id>-<n>.th.json
//   node scripts/import-translations.mjs --check  report Thai coverage per caption file (exit 1 if any line is pending)
// A .th.json is an array [{ "key": "<start_ms>", "th": "..." }] that must cover every key of its
// <youtube_id>-<n>.json batch. Merged lines get th_src: "ai". source.th becomes "manual+ai" when the file
// had manual Thai, otherwise "ai". All batches are validated first; on any error nothing is written.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const TRANSLATE_DIR = join(ROOT, '.superpowers', 'translate');
const CHECK_ONLY = process.argv.includes('--check');

// Kana, CJK ideographs and half-width katakana: a Thai line should contain none of these.
const JAPANESE = /[぀-ヿ㐀-䶿一-鿿ｦ-ﾟ]/;

const needsThai = (file, line) => Boolean(line.ja) && (!line.th || file.source?.th === 'auto');

// Caption files, keyed by youtube_id.
const captions = new Map();
for (const fileName of readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json')).sort()) {
  const data = JSON.parse(readFileSync(join(CAPTION_DIR, fileName), 'utf8'));
  const keyIndex = new Map();
  data.lines.forEach((line, i) => {
    const key = String(line.start_ms);
    if (keyIndex.has(key)) throw new Error(`${fileName}: duplicate start_ms ${key}`);
    keyIndex.set(key, i);
  });
  captions.set(data.youtube_id, { fileName, data, keyIndex });
}

if (CHECK_ONLY) {
  let pendingTotal = 0;
  console.log('youtube_id      ja  with_th      %  pending');
  for (const [id, { data }] of captions) {
    const ja = data.lines.filter((l) => l.ja);
    // Auto-sourced Thai does not count as done.
    const withTh = ja.filter((l) => l.th && !needsThai(data, l)).length;
    const pending = ja.length - withTh;
    pendingTotal += pending;
    const pct = ja.length ? ((withTh / ja.length) * 100).toFixed(1) : '100.0';
    console.log(`${id.padEnd(15)} ${String(ja.length).padStart(4)} ${String(withTh).padStart(8)} ${pct.padStart(6)}%  ${pending}`);
  }
  console.log(pendingTotal === 0 ? 'OK: every ja line has Thai' : `PENDING: ${pendingTotal} ja lines lack Thai`);
  process.exit(pendingTotal === 0 ? 0 : 1);
}

const errors = [];
const batchFiles = existsSync(TRANSLATE_DIR)
  ? readdirSync(TRANSLATE_DIR).filter((f) => /^.+-\d+\.th\.json$/.test(f)).sort()
  : [];

if (batchFiles.length === 0) {
  console.log('No .th.json files in .superpowers/translate; nothing to import.');
  process.exit(0);
}

// Per youtube_id state, computed before any change so manual detection is not affected by this run.
const perFile = new Map();
const stateFor = (id) => {
  let st = perFile.get(id);
  if (!st) {
    const cap = captions.get(id);
    const hadManual = cap.data.source?.th !== 'auto' && cap.data.lines.some((l) => l.th && l.th_src !== 'ai');
    st = { ...cap, hadManual, merged: new Map(), batches: 0 };
    perFile.set(id, st);
  }
  return st;
};

const summaries = [];
for (const batchFile of batchFiles) {
  const [, id, n] = batchFile.match(/^(.+)-(\d+)\.th\.json$/);
  const label = batchFile;
  if (!captions.has(id)) {
    errors.push(`${label}: no caption file for youtube_id ${id}`);
    continue;
  }
  const exportPath = join(TRANSLATE_DIR, `${id}-${n}.json`);
  if (!existsSync(exportPath)) {
    errors.push(`${label}: exported batch ${id}-${n}.json is missing`);
    continue;
  }
  const expected = new Set(JSON.parse(readFileSync(exportPath, 'utf8')).map((e) => String(e.key)));

  let entries;
  try {
    entries = JSON.parse(readFileSync(join(TRANSLATE_DIR, batchFile), 'utf8'));
  } catch (e) {
    errors.push(`${label}: invalid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(entries)) {
    errors.push(`${label}: top level must be an array`);
    continue;
  }

  const st = stateFor(id);
  const seen = new Set();
  let ok = true;
  for (const entry of entries) {
    const key = String(entry?.key ?? '');
    if (seen.has(key)) {
      errors.push(`${label}: duplicate key ${key}`);
      ok = false;
      continue;
    }
    seen.add(key);
    if (!expected.has(key)) {
      errors.push(`${label}: unknown key ${key} (not in ${id}-${n}.json)`);
      ok = false;
      continue;
    }
    const th = typeof entry.th === 'string' ? entry.th.trim() : '';
    if (!th) {
      errors.push(`${label}: empty th for key ${key}`);
      ok = false;
      continue;
    }
    if (JAPANESE.test(th)) {
      errors.push(`${label}: th for key ${key} contains Japanese kana/kanji (likely untranslated): ${th}`);
      ok = false;
      continue;
    }
    const idx = st.keyIndex.get(key);
    if (idx === undefined) {
      errors.push(`${label}: key ${key} not found in ${st.fileName}`);
      ok = false;
      continue;
    }
    const line = st.data.lines[idx];
    if (!line.ja) {
      errors.push(`${label}: key ${key} has no ja text`);
      ok = false;
      continue;
    }
    if (line.th && line.th_src !== 'ai' && st.data.source?.th !== 'auto') {
      errors.push(`${label}: key ${key} already has manual Thai, refusing to overwrite`);
      ok = false;
      continue;
    }
    st.merged.set(key, th);
  }

  const missing = [...expected].filter((k) => !seen.has(k));
  if (missing.length) {
    errors.push(`${label}: missing ${missing.length} of ${expected.size} keys (e.g. ${missing.slice(0, 5).join(', ')})`);
    ok = false;
  }
  if (ok) st.batches += 1;
}

if (errors.length) {
  console.error(`Import FAILED with ${errors.length} error(s). Nothing was written.`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

for (const [id, st] of perFile) {
  const { data, keyIndex, fileName, merged } = st;
  const newLines = data.lines.map((line) => {
    const th = merged.get(String(line.start_ms));
    if (th === undefined) return line;
    // Keep key order: th_src goes right after th (appended only if the line had no th key).
    const out = {};
    for (const k of Object.keys(line)) {
      if (k === 'th_src') continue;
      if (k === 'th') {
        out.th = th;
        out.th_src = 'ai';
      } else {
        out[k] = line[k];
      }
    }
    if (!('th' in line)) {
      out.th = th;
      out.th_src = 'ai';
    }
    return out;
  });
  const sourceTh = st.hadManual ? 'manual+ai' : 'ai';
  const next = { ...data, source: { ...data.source, th: sourceTh }, lines: newLines };
  if (merged.size > 0) writeFileSync(join(CAPTION_DIR, fileName), JSON.stringify(next) + '\n', 'utf8');
  summaries.push(`${fileName}: ${merged.size} lines from ${st.batches} batch(es), source.th=${sourceTh}`);
}

for (const s of summaries) console.log(s);
console.log(`merged ${[...perFile.values()].reduce((n, st) => n + st.merged.size, 0)} lines`);
