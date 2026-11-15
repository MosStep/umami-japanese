# Task: finish the content of the Umami app (word meanings + line explanations)

Work in `D:\umami-japanese` on branch `content/explanations` (`git switch content/explanations && git pull`).
Shell: Git Bash. Use `python -X utf8` for anything that prints Japanese/Thai.

State on 2026-11-15 (release 1.0.28): 144 clips. Every caption line already has Thai. What is missing:

| Part | Missing | Tool |
|---|---|---|
| A. Thai meaning for words from the 46 new clips | about 3,000 words | `scripts/export-glossary.mjs` → `scripts/import-glossary.mjs` |
| B. Line explanations ("อธิบายประโยค") | about 13,700 of 28,600 lines | `scripts/explain-tool.mjs` |

Do **A first** (small, every learner sees it when tapping a word), then B.

## Hard rules
1. Do not edit app code (`src/components/**`, `src/context/**`, `src/utils/**`, `android/**`, `src/config/version.ts`,
   `public/live_catalog.json`). Only data files and `.superpowers/**`.
2. Do not bump versions, run `npm run bundle`, tag, push to `main`, or create releases. Commit on `content/explanations`
   and push that branch only. The owner's other agent ships the update.
3. Write the Thai content yourself, item by item. Never fill it from templates or copy one text to many items.
4. Never put API keys anywhere.

## A. Thai meaning for new words (glossary)
1. `node scripts/export-glossary.mjs` → `.superpowers/glossary/batch-*.json` (+ `INDEX.md`). It lists every word with
   no dictionary link (≈16,500 keys); about 13,500 already have a meaning in `src/data/glossary.json`.
2. For each `batch-N.json`, write `batch-N.th.json` = `[{ "k": "<same k>", "th": "<Thai>" }]`, every k, same order:
   - if `src/data/glossary.json` already has the k → copy that Thai unchanged (a small Python helper may do this copy);
   - otherwise write a new gloss following `.superpowers/glossary/STYLE.md`: 1–4 short Thai meanings separated by ", ",
     the sense used in `ex` first, no kana/kanji in `th`. Names of people/channels/games: Thai transliteration + type,
     e.g. "เปโกระ (ชื่อคน)", "โฮโลไลฟ์ (ชื่อค่าย VTuber)". Many new words come from YouTubers/VTubers and auto
     captions (speech recognition): give the most plausible gloss; if truly meaningless write "(คำไม่ชัดเจน)".
3. `node scripts/import-glossary.mjs` (strict: must report no missing keys), then
   `node scripts/import-glossary.mjs --check`.
4. Commit: `content: Thai meanings for new clip words`.

## B. Line explanations
Read `docs/prompts/gemini-explain-lines.md` fully (rules, quality notes in RESUME, examples) and follow it, with these
updates:
- Export one level at a time, easiest first: `node scripts/explain-tool.mjs export --level N4`, then N3, N2, N1.
  `export` deletes old batch files, so run it only after the previous level's `.ex.json` files were imported.
- Most of the new clips (YouTubers, hololive VTubers) have `ja source` = `auto` in `INDEX.md`: the Japanese often has
  speech-recognition mistakes. When the Thai + prev/next make the real words certain, give `fix` and explain the fixed
  sentence. VTuber talk is very casual (〜じゃん, 〜っしょ, 〜ぺこ, ます-less speech): explain the tone and the
  character's speech quirks (e.g. ぺこら adds ぺこ, マリン calls herself 船長).
- After each level: `node scripts/explain-tool.mjs import` (fix and re-import until `0 rejected`), then
  `node scripts/explain-tool.mjs check` (must end `errors 0`), then commit `content: explanations <level>` and push
  `content/explanations`.
- If you run out of quota in the middle of a level, import + commit what is finished; the next run's `export` lists
  only lines still missing.

## Report at the end
For A: new glosses written. For B: lines explained per level, `check` coverage line, number of `fix` given.
Mention anything you were unsure about.
