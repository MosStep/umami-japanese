# Task: re-level every clip's JLPT level consistently (Umami app)

## Role & context
You are a careful data agent in the repo `D:\umami-japanese` (Japanese-learning app, Thai UI). Every clip is a record in
`MOCK_VIDEOS` in `src/data/mockVideos.ts` with `primary_jlpt` (N5–N1), `jlpt_distribution` ({N5..N1} summing to 100) and
`difficulty_rating`. Their timed, tokenized captions live in `src/data/captions/<youtube_id>.json`
(`lines[].ja`, `lines[].start_ms/end_ms`, `lines[].tokens[]` with surface/lemma/reading/pos).

**Problem (from the user):** levels are inconsistent. Example: a clip whose title says "N5" and is very easy to
understand is labelled N3. Some levels were guessed, and all full anime episodes were forced to N3.
**Goal:** re-assign `primary_jlpt`, `jlpt_distribution` and `difficulty_rating` for ALL records with ONE documented,
reproducible method, so that a learner filtering by N5 gets genuinely easy clips and N1 gets genuinely hard ones.

## Hard rules
1. Only edit `src/data/mockVideos.ts` fields `primary_jlpt`, `jlpt_distribution`, `difficulty_rating`, plus new files
   under `scripts/` and `.superpowers/gemini/`. Do NOT touch app code, captions, glossary, versions, `public/`, `android/`.
2. Do not push, tag, release, bump versions or run `npm run bundle`. Work on a new branch `content/relevel`
   (`git switch -c content/relevel`), stage files explicitly (never `git add -A`), commit locally.
3. `npm run build` must pass at the end.
4. Use `python -X utf8` for anything printing Japanese. No network needed except optionally downloading ONE open JLPT
   vocabulary list (step 1).

## Method (implement as `scripts/relevel.py`, deterministic, re-runnable)
### Step 1 — JLPT vocabulary list
Get an open JLPT word list with a level per word (e.g. the CSVs from the GitHub repo `jamsinclair/open-anki-jlpt-decks`,
or `elzup/jlpt-word-list`). Save it to `scripts/data/jlpt_vocab.csv` (columns: expression, reading, level) and note the
source + license in the report. Also add these always-easy items as N5: all particles/auxiliaries (POS 助詞, 助動詞 or
Thai labels คำช่วย / คำช่วยกริยา), です/ます forms, numbers.

### Step 2 — Measure each clip (from its caption JSON)
For each record, over lines with Japanese:
- **Vocabulary level shares**: for every content token (exclude particles, auxiliaries, punctuation), look up its
  lemma (then surface, then reading) in the list → level N5..N1; not found → count as `N1+` (unknown). Count unique
  lemmas (types) AND occurrences (tokens); use token-weighted shares.
- **Speech rate**: Japanese characters per second of speech (sum of len(ja) / sum of line durations).
- **Sentence length**: average characters per line.
- **Kanji ratio**: kanji chars / all Japanese chars.

### Step 3 — Decide the level
1. `jlpt_distribution` = token-weighted shares of N5, N4, N3, N2, N1 (fold unknown `N1+` into N1), rounded so the five
   values sum to exactly 100.
2. `vocab_level` = the EASIEST level L such that ≥ 90% of content tokens are at level L or easier.
3. Adjust for speed (natural fast talk is harder even with easy words): rate > 9 chars/s → one level harder;
   rate < 5 chars/s → one level easier (never easier than N5 or harder than N1).
4. **Stated level wins when it agrees within one step**: if the title/description/channel explicitly states a level
   (N5…N1, "N6" → N5, 初級/beginner → N5–N4, 中級/intermediate → N3, 上級/advanced → N2–N1) and it is within one level of
   the computed level, use the stated level. If it differs by 2+ levels, use the computed level and list the clip in the
   report as a conflict.
5. `primary_jlpt` = the result; `difficulty_rating` = N5→1, N4→2, N3→3, N2→4, N1→5.

### Step 4 — Sanity checks (fail loudly)
- Every distribution sums to 100; every primary is N5..N1.
- The clip the user mentioned (title contains "N5" and it is easy) must end up N5 or N4 — find it and show its numbers.
- Expect a spread: report counts per level. If more than 50% of clips land in one level, re-check the thresholds and
  explain (do not silently force a spread).

## Report (`.superpowers/gemini/RELEVEL.md` + short summary printed)
1. Method summary + vocabulary list source/license.
2. Table for ALL records: id | title | stated level | old primary | new primary | N5/N4/N3/N2/N1 % | chars/s | avg line len | kanji % | note.
3. Counts per level before vs after.
4. Conflicts (stated vs computed differ by 2+) with your reasoning.
5. `npm run build` result and the commit hash.
