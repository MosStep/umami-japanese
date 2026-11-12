// Per-line explanations (Thai) for caption lines, written offline by an agent and shipped with the app.
//   node scripts/explain-tool.mjs export [--level N5] [youtube_id ...]   write batches of lines still missing an explanation
//   node scripts/explain-tool.mjs import                                 merge every .superpowers/explain/*.ex.json
//   node scripts/explain-tool.mjs check [youtube_id ...]                 validate + coverage; exit 1 on errors
// Data: src/data/explanations/<youtube_id>.json =
//   { youtube_id, v: 1, items: { "<start_ms>": { ja, x, g?: [{ f, b, e }], fix? } } }
//   ja  = the caption line's Japanese when written (the app shows an item only while it still equals the line's ja)
//   x   = Thai explanation of the line (meaning in context, who/tone/nuance), <= 260 chars
//   g   = 0-4 grammar points: f = exact substring of ja (of fix when present), b = base form / pattern (<= 24 chars), e = Thai (<= 160 chars)
//   fix = corrected Japanese when an AUTO caption line is clearly mis-heard (optional)
// Batches: .superpowers/explain/<youtube_id>-<n>.json = [{ key, ja, th, prev, next, words }]; the agent writes
//   <youtube_id>-<n>.ex.json = [{ key, x, g?, fix? }] (same keys, same order).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CAP_DIR = join(ROOT, 'src', 'data', 'captions');
const EX_DIR = join(ROOT, 'src', 'data', 'explanations');
const BATCH_DIR = join(ROOT, '.superpowers', 'explain');
const MOCK_FILE = join(ROOT, 'src', 'data', 'mockVideos.ts');
const BATCH_SIZE = 60;
const MIN_CHARS = 5; // shorter lines (はい, うん, ええ…) need no explanation
const LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];

const strip = (s) => (s ?? '').replace(/\s+/g, '');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const capIds = () => readdirSync(CAP_DIR).filter((f) => f.endsWith('.json') && f !== 'word-index.json').map((f) => f.slice(0, -5));
const eligible = (line) => strip(line.ja).length >= MIN_CHARS;
const exPath = (id) => join(EX_DIR, `${id}.json`);
const loadEx = (id) => (existsSync(exPath(id)) ? readJson(exPath(id)) : { youtube_id: id, v: 1, items: {} });
const isCurrent = (item, line) => item && item.ja === line.ja;

function levels() {
  const src = readFileSync(MOCK_FILE, 'utf8');
  const map = {};
  for (const m of src.matchAll(/"youtube_id":\s*"([^"]+)"[\s\S]*?"primary_jlpt":\s*"(N\d)"/g)) map[m[1]] ??= m[2];
  return map;
}

function exportBatches(args) {
  let level = null;
  const li = args.indexOf('--level');
  if (li >= 0) { level = args[li + 1]; args.splice(li, 2); }
  const lv = levels();
  let ids = args.length ? args : capIds();
  if (level) ids = ids.filter((id) => lv[id] === level);
  ids.sort((a, b) => LEVEL_ORDER.indexOf(lv[a] ?? 'N1') - LEVEL_ORDER.indexOf(lv[b] ?? 'N1') || a.localeCompare(b));
  rmSync(BATCH_DIR, { recursive: true, force: true });
  mkdirSync(BATCH_DIR, { recursive: true });
  const index = [];
  for (const id of ids) {
    const cap = readJson(join(CAP_DIR, `${id}.json`));
    const ex = loadEx(id);
    const lines = cap.lines;
    const todo = [];
    lines.forEach((line, i) => {
      if (!eligible(line) || isCurrent(ex.items[line.start_ms], line)) return;
      const ctx = (l) => (l ? { ja: l.ja ?? '', th: l.th ?? '' } : null);
      todo.push({
        key: `${id}:${line.start_ms}`,
        ja: line.ja,
        th: line.th ?? '',
        prev: ctx(lines[i - 1]),
        next: ctx(lines[i + 1]),
        words: (line.tokens ?? []).map((t) => [t.surface, t.base ?? t.lemma ?? t.dictionary_form ?? '', t.reading ?? ''].filter(Boolean).join('/')),
      });
    });
    for (let n = 0; n * BATCH_SIZE < todo.length; n++) {
      const part = todo.slice(n * BATCH_SIZE, (n + 1) * BATCH_SIZE);
      writeFileSync(join(BATCH_DIR, `${id}-${n + 1}.json`), JSON.stringify(part, null, 1) + '\n');
      index.push(`| ${id}-${n + 1} | ${lv[id] ?? '?'} | ${cap.source?.ja ?? '?'} | ${part.length} |`);
    }
  }
  writeFileSync(join(BATCH_DIR, 'INDEX.md'), `# Explain batches (level order)\n\n| batch | level | ja source | lines |\n|---|---|---|---|\n${index.join('\n')}\n`);
  console.log(`${index.length} batches, ${ids.length} clips -> ${BATCH_DIR}`);
}

// Returns a list of problems for one item against its caption line.
function validate(item, line, source) {
  const errs = [];
  if (typeof item.x !== 'string' || !item.x.trim()) errs.push('x empty');
  else {
    if (item.x.length > 260) errs.push(`x too long (${item.x.length})`);
    if (!/[฀-๿]/.test(item.x)) errs.push('x has no Thai');
  }
  if (item.g !== undefined) {
    if (!Array.isArray(item.g) || item.g.length > 4) errs.push('g must be an array of <= 4');
    else for (const p of item.g) {
      const target = strip(item.fix ?? line.ja); // grammar points quote the corrected text when there is a fix
      if (!p || typeof p.f !== 'string' || !p.f || !target.includes(strip(p.f))) errs.push(`g.f "${p?.f}" not in ${item.fix ? 'fix' : 'ja'}`);
      if (typeof p?.b !== 'string' || !p.b || p.b.length > 24) errs.push(`g.b bad for "${p?.f}"`);
      if (typeof p?.e !== 'string' || !/[฀-๿]/.test(p.e) || p.e.length > 160) errs.push(`g.e bad for "${p?.f}"`);
    }
  }
  if (item.fix !== undefined) {
    if (source !== 'auto') errs.push('fix only allowed on auto ja');
    else if (typeof item.fix !== 'string' || !item.fix || strip(item.fix) === strip(line.ja)) errs.push('fix empty or same as ja');
  }
  const extra = Object.keys(item).filter((k) => !['ja', 'x', 'g', 'fix'].includes(k));
  if (extra.length) errs.push(`unknown keys ${extra.join(',')}`);
  return errs;
}

function importBatches() {
  if (!existsSync(BATCH_DIR)) return console.log('no batches');
  mkdirSync(EX_DIR, { recursive: true });
  const byClip = {};
  let bad = 0;
  for (const f of readdirSync(BATCH_DIR).filter((f) => f.endsWith('.ex.json'))) {
    const srcPath = join(BATCH_DIR, f.replace('.ex.json', '.json'));
    const out = readJson(join(BATCH_DIR, f));
    // A batch file may be gone after a re-export: then keys are only checked against the captions below.
    const want = (existsSync(srcPath) ? readJson(srcPath) : out).map((e) => e.key).join('\n');
    if (out.map((e) => e.key).join('\n') !== want) { console.error(`${f}: keys differ from the batch (same keys, same order)`); bad++; continue; }
    for (const e of out) {
      const [id, ms] = e.key.split(':');
      (byClip[id] ??= []).push([ms, e]);
    }
  }
  let merged = 0;
  for (const [id, entries] of Object.entries(byClip)) {
    const cap = readJson(join(CAP_DIR, `${id}.json`));
    const lineAt = Object.fromEntries(cap.lines.map((l) => [String(l.start_ms), l]));
    const ex = loadEx(id);
    for (const [ms, e] of entries) {
      const line = lineAt[ms];
      if (!line) { console.error(`${id}:${ms} no such line`); bad++; continue; }
      const item = { ja: line.ja, x: e.x?.trim(), ...(e.g?.length ? { g: e.g } : {}), ...(e.fix ? { fix: e.fix } : {}) };
      const errs = validate(item, line, cap.source?.ja);
      if (errs.length) { console.error(`${id}:${ms} ${errs.join('; ')}`); bad++; continue; }
      ex.items[ms] = item;
      merged++;
    }
    ex.items = Object.fromEntries(Object.entries(ex.items).sort((a, b) => Number(a[0]) - Number(b[0])));
    writeFileSync(exPath(id), JSON.stringify(ex) + '\n');
  }
  console.log(`merged ${merged} items, ${bad} rejected`);
  if (bad) process.exit(1);
}

function check(ids) {
  const lv = levels();
  const list = ids.length ? ids : capIds();
  let errors = 0, totalNeed = 0, totalDone = 0;
  const rows = [];
  for (const id of list) {
    const cap = readJson(join(CAP_DIR, `${id}.json`));
    const ex = loadEx(id);
    const lineAt = Object.fromEntries(cap.lines.map((l) => [String(l.start_ms), l]));
    for (const [ms, item] of Object.entries(ex.items)) {
      const line = lineAt[ms];
      if (!line || !isCurrent(item, line)) continue; // stale: captions changed since; re-exported automatically
      const errs = validate(item, line, cap.source?.ja);
      if (errs.length) { errors++; console.error(`${id}:${ms} ${errs.join('; ')}`); }
    }
    const need = cap.lines.filter(eligible);
    const done = need.filter((l) => isCurrent(ex.items[l.start_ms], l)).length;
    totalNeed += need.length; totalDone += done;
    if (done) rows.push(`${id} ${lv[id] ?? '?'} ${done}/${need.length} (${((100 * done) / need.length).toFixed(1)}%)`);
  }
  console.log(rows.join('\n'));
  console.log(`explained ${totalDone}/${totalNeed} lines (${((100 * totalDone) / Math.max(1, totalNeed)).toFixed(2)}%), errors ${errors}`);
  if (errors) process.exit(1);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'export') exportBatches(rest);
else if (cmd === 'import') importBatches();
else if (cmd === 'check') check(rest);
else { console.error('usage: explain-tool.mjs export [--level N5] [ids] | import | check [ids]'); process.exit(2); }
