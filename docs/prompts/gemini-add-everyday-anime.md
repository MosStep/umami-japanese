# Task: add 12 everyday-life anime episodes (Umami app)

## Role & context
You are a content agent in `D:\umami-japanese` (Japanese-learning app, Thai UI). Learners watch a whole episode with
timed Japanese subtitles, Thai on every line, and tap any word for its reading + Thai meaning.

**Problem (from the user):** the app's anime shelf (≈18 episodes) is almost all battle / isekai / magic / mecha
(Jujutsu Kaisen, BLEACH, 転生したら剣でした, 転生ゴブリン, Code Geass, Dark Machine, Battle Spirits…). That vocabulary
(呪い, 剣, 魔法, 戦う) is rarely useful in real life. The user wants **anime with Japanese people actually use**: school,
home, friends, work, shops, food, dating, hobbies, small talk.

## What counts as "everyday" (the core judgement — read carefully)
Accept (genre must be the series' main setting, not one scene):
- slice-of-life / 日常系 / iyashikei (healing), school life, club activities
- romantic comedy / school romance, friendship comedy
- family / home life, childcare, pets
- workplace / office / part-time job / shop / café / restaurant
- food & cooking anime, camping / travel / hobby anime (e.g. camping, cycling, photography, music club)
- light sports or club anime where most dialogue is off the field (practice, school, team talk)

Reject:
- isekai / 転生 / reincarnation, fantasy worlds, magic, demons, curses, swords, monsters, mecha, sci-fi war,
  superpowers, battle tournaments, horror, crime/gore
- shows whose dialogue is mostly shouting, narration of attacks, or made-up terms
- music videos, OP/ED only, PVs, trailers, highlights, recap compilations, Shorts

When unsure, open the episode description and the first 2 minutes of subtitles: if most lines are ordinary
conversation (greetings, plans, food, school, feelings), accept; if they are lore/fight terms, reject.

## Targets
- **12 new episodes** (minimum 8) from **≥ 6 different series**, **≤ 2 episodes per series** (prefer EP 1 and EP 2).
- Series must NOT already be in `src/data/mockVideos.ts` (check `japanese_title` / `title`).
- Level mix after step 6: mostly **N4–N3**; at most 2 at N2; none at N1 (a slow, simple slice-of-life should not
  compute N1 — if it does, replace it).
- Duration 10–30 min (full episodes; short-format anime 3–10 min also fine, max 3 of those).

## Where to look (official uploads only — never re-uploads/pirate channels)
1. **Ani-One Asia** `@AniOneAsia` — official full episodes, manual Thai + Japanese track. Extend
   `scripts/find-anione.py` (or copy it to `scripts/find-everyday-anime.py`) with a title/description filter for the
   genres above and a reject list for the rejected genres; keep its existing checks (public, embeddable, manual `th`,
   `ja` track, not already in the app, 3 s between videos).
2. **Muse Thailand** `@MuseThailand` and **Muse Asia** `@MuseAsia` — official; use only videos that have a MANUAL `th`
   track.
3. Official Japanese publisher / anime channels that upload full episodes with **manual Japanese** subtitles
   (e.g. a series' official `公式` channel, Kodansha/KADOKAWA anime channels, TOHO animation, Aniplex). Manual Thai is a
   bonus; if a clip has manual `ja` but no Thai, it's still allowed (you translate in step 5).
Search ideas: "日常 アニメ 第1話 公式", "ラブコメ 第1話 公式 フル", "slice of life anime episode 1 official",
"อนิเมะ ตอนที่ 1 ซับไทย Ani-One", "Muse Thailand ตอนที่ 1".

## Subtitle rules (hard — they decide whether a clip works)
A candidate must have ONE of:
- **A) manual `ja`** (`info['subtitles']` key starting with `ja`) — best; Thai may be manual or translated by you.
- **B) auto `ja`** (`ja-orig`/`ja` in `automatic_captions`) **AND manual `th`**. `scripts/fetch-captions.py` then
  builds the file on the Thai timeline automatically (one line per Thai cue, Japanese words placed by their
  timestamps). Do NOT post-process these files by hand.
No other combination (auto ja without manual th → reject). Never use burned-in subtitles; never invent timings.

**Quality gates per clip (reject and replace if any fails):**
- Subtitles cover ≥ 80% of the episode's runtime (first cue to last cue vs duration) — some YouTube tracks stop
  half-way.
- For case B: share of lines with Thai but empty Japanese ≤ **20%** (count `ja == null` lines / all lines in the new
  caption file). `node scripts/check-captions.mjs` must pass (it fails above 30%).
- Speed: ≤ 9 Japanese chars per second over speech time (everyday anime is faster than learner content; just
  avoid the very fastest).

## Hard rules
1. yt-dlp only via the Python module (`import yt_dlp`; the exe is blocked); `python -X utf8`; ≥ 3 s between
   per-video requests; on HTTP 429 wait 60 s once, then stop and report.
2. Only edit: `src/data/mockVideos.ts` (new records only), new `src/data/captions/*.json`, `src/data/glossary.json`,
   `src/data/captions/word-index.json`, new/extended scripts under `scripts/`, and `.superpowers/`.
   Never app code, existing caption files, existing records, versions, `public/`, `android/`.
3. New branch from `main`: `git switch main && git pull && git switch -c content/anime-everyday`. Stage files
   explicitly (never `git add -A`); commit locally; no push, release, version bump or `npm run bundle`.
4. No API keys in any file.

## Pipeline (same tools as before — `docs/prompts/gemini-add-clips.md` Steps 1–7 have the details)
1. **Find** → `.superpowers/gemini/anime-everyday-candidates.md` (~30 candidates: id, channel, series, episode,
   duration, subtitle case A/B, genre, accept/reject + reason).
2. **Records** in `src/data/mockVideos.ts`, copying an existing anime record's shape: id
   `vid-anime-<series-slug>-<nn>`, Thai `title` (official Thai title if the channel has one, e.g. "… ตอนที่ 1"),
   real `japanese_title`, `channel`, `category: "Anime"`, one-sentence Thai `description` from the real description,
   real `duration`, emoji fitting the setting (🏫 🍙 ☕ 🏕️ 🏠 💼 💕) + dark gradient. Leave level fields to step 6.
3. **Captions + tokens:** `python -X utf8 scripts/fetch-captions.py <ids>` then
   `node scripts/tokenize-captions.mjs <ids>`. Check the quality gates above now; replace failures before translating.
   For case A only: if a line has > 40 Japanese chars, split it per `docs/prompts/gemini-split-long-lines.md`.
4. **Thai:** case B already has manual Thai on every line — don't retranslate it. Case A without Thai:
   `node scripts/export-untranslated.mjs <ids>` → translate per `.superpowers/translate/STYLE.md` (natural spoken
   Thai, short like real subtitles, match each character's politeness) → `import-translations.mjs` + `--check` 100%.
5. **Glossary:** `export-glossary.mjs` → prefill from `src/data/glossary.json` → gloss only new keys per
   `.superpowers/glossary/STYLE.md` → `import-glossary.mjs` + `--check` 100.00%.
6. **Level:** `python -X utf8 scripts/relevel.py` (only for the new ids — don't change other clips' levels). Apply the
   level-mix rule above.
7. `node scripts/check-captions.mjs`, `node scripts/build-word-index.mjs`, `npm run build` (exit 0), commit.

## Verification checklist
- [ ] ≥ 8 (target 12) new episodes, ≥ 6 series, ≤ 2 per series, none of the rejected genres, none already in the app.
- [ ] Every clip: subtitle case A or B, coverage ≥ 80%, Japanese-empty share ≤ 20%, ≤ 9 chars/s.
- [ ] Levels: mostly N4–N3, ≤ 2 N2, 0 N1.
- [ ] `check-captions.mjs` passes; `import-translations.mjs --check` 100% (case A files); `import-glossary.mjs --check` 100.00%.
- [ ] `git diff --stat main` lists only new caption files, `mockVideos.ts`, `glossary.json`, `word-index.json`, scripts.
- [ ] `npm run build` exit 0.

## Report (`.superpowers/gemini/ANIME-EVERYDAY-REPORT.md` + short printed summary)
Table: id | series | episode | channel | genre | subtitle case | duration | coverage % | ja-empty % | chars/s |
computed level | lines. Then rejected candidates with the reason (battle/isekai genre, no manual th, coverage too
low, too many empty Japanese lines, not embeddable, level too hard), the `--check` outputs, build result, commit hash.
