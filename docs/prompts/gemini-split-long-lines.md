# Task: split over-long subtitle lines so Japanese and Thai stay short and in sync (Umami app)

## Context
Repo `D:\umami-japanese` (Japanese-learning app, Thai UI). Captions live in `src/data/captions/<youtube_id>.json`
(compact JSON: `{ youtube_id, source:{ja,th,en?}, lines:[{ start_ms, end_ms, ja, th, th_src?, en?, tokens:[...] }] }`;
inspect one file first to learn the exact token keys). The player shows one line at a time.

**Problem (from the user):** in many clips one subtitle line holds a whole paragraph of continuous speech (up to
162 Japanese characters; 22 of 72 clips have > 10% long lines, worst: `HkGhuIqiIRI`, `z7mBxU12PKg`, `HyK2DV5Y2kA`,
`RNE60ygYH6E`, `hPvXSjQwIho`, `Tt_9_BVXdwk`). The Thai translation is then a long paragraph too, and it no longer matches
what is being said at that moment.

**Goal:** every line with Japanese is at most ~30 characters, timed to the speech, with its own Thai translation that
matches exactly that segment.

## Hard rules
1. Only change `src/data/captions/*.json` (not `word-index.json` unless the build script regenerates it), add
   `scripts/split-long-lines.mjs`, and work files under `.superpowers/`. Don't touch app code, `mockVideos.ts`,
   `glossary.json`, versions, `public/`, `android/`.
2. Lines that are NOT long must stay byte-identical in content (same start_ms, ja, th, tokens).
3. New branch `content/split-lines` (`git switch -c content/split-lines`); stage files explicitly (never `git add -A`);
   commit locally; don't push, release, bump versions or run `npm run bundle`.
4. Don't translate song lyrics (skip `SX_ViT4Ra7k`).

## Step 1 — `scripts/split-long-lines.mjs` (Node ESM, no new deps; run on all caption files except word-index.json)
- A line is **long** if `ja` (spaces removed) has > 40 characters.
- Split long lines at **token boundaries** using the line's existing `tokens` (keep tokenization; each segment gets the
  contiguous token slice whose surfaces make up its text). Cut points, greedily, so segments are 12–30 chars:
  1) right after sentence-final punctuation (。！？!?…), 2) after a clause-ending particle/connective token
  (は が を に で て と も ね よ な けど から ので のに し たら ば ながら ても, or a token ending with 、),
  3) otherwise the token boundary nearest 24 chars. Never leave a segment < 6 chars (merge into neighbour).
- **Check:** the segments joined (spaces removed) must equal the original `ja` (spaces removed) — abort that line if not.
- Timing: split `[start_ms, end_ms]` proportionally to segment character counts (integer ms, contiguous; first starts
  at the original start, last ends at the original end). Ensure unique `start_ms` within the file (+1 ms nudge).
- Per segment: `ja`, `tokens` slice, `th: null`, drop `th_src`; keep `en` on the first segment only (reference).
- Print per file: long lines → segments, max segment length after.

## Step 2 — Thai for the new segments
1. `node scripts/export-untranslated.mjs` → batches in `.superpowers/translate/` (+ INDEX.md; it includes
   `prev`/`next` context and `en` where present).
2. Follow `.superpowers/translate/STYLE.md`. For each `X.json` write `X.th.json` = `[{ "key", "th" }]`, every key, same
   order, never empty, no kana/kanji in `th`. Each Thai line must translate ONLY its own segment (use prev/next for
   context, but don't pull meaning from neighbouring segments into this line). Keep lines short like real subtitles.
3. `node scripts/import-translations.mjs` then `node scripts/import-translations.mjs --check` → 100% on every file
   (except `SX_ViT4Ra7k`).

## Step 3 — Rebuild + verify
- `node scripts/build-word-index.mjs`, then `node scripts/import-glossary.mjs --check` (must stay 100.00%; tokens are
  unchanged so it should), then `npm run build` (exit 0).
- Re-run a length check: no line with Japanese > 40 chars remains (report any exceptions, e.g. a single token longer
  than 30 chars).

## Report (`.superpowers/gemini/SPLIT.md` + short printed summary)
- Per file: long lines before → after, segments created, max length after.
- 10 random before/after examples (original long line + its segments with times and new Thai).
- The two `--check` outputs, build result, commit hash.
