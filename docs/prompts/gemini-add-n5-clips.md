# Task: add 15 varied, genuinely easy N5 clips (Umami app)

## Role & context
You are a content agent in `D:\umami-japanese` (Japanese-learning app, Thai UI). N5 is where every learner starts,
but the app's N5 shelf (11 clips) is almost only podcasts — beginners get bored. Add **15 new N5 clips across many
genres**, each fully working (timed Japanese for the whole clip, Thai on every line, a Thai meaning for every word).

## What makes a good N5 clip (read carefully — this is the core judgement)
- Slow, clear speech (roughly ≤ 6 Japanese characters per second), short sentences, polite です/ます style or very
  simple casual speech, everyday vocabulary (food, family, numbers, time, shopping, weather, self-introduction).
- Made FOR learners or for small children, OR naturally simple real-life content.
- Not N5: fast YouTuber talk, news, anime action scenes, slang-heavy vlogs — even if the topic sounds easy.

## Genre mix (required — max 3 podcast-style clips in total)
| Genre (category to use) | Target | Search ideas |
|---|---|---|
| Daily-life / slow vlog for learners (`Vlogs`) | 3 | "やさしい日本語 vlog", "slow Japanese vlog N5", "Comprehensible Japanese beginner" |
| Simple stories / folk tales / picture books read slowly (`Podcasts`) | 2 | "日本昔ばなし 朗読 やさしい", "えほん 読み聞かせ", "easy Japanese story N5" |
| Kids' / family content with clear speech (`Vlogs`) | 2 | channels for young children with clear narration (no songs/music videos) |
| Food / cooking explained simply (`Street Food`) | 2 | "簡単 料理 やさしい日本語", "Japanese cooking easy Japanese" |
| Situational conversation (shop, restaurant, station, hotel) (`Podcasts`) | 2 | "コンビニ 会話 初級", "restaurant Japanese conversation beginner" |
| Self-introduction / hobbies / daily routine talk (`Vlogs`) | 2 | "自己紹介 やさしい日本語", "my daily routine Japanese easy" |
| Gaming / play commentary spoken slowly (`Gaming`) | 1 | "やさしい日本語 ゲーム実況", "Japanese learning gameplay N5" |
| Learner podcast (`Podcasts`) | ≤ 1 | only if the others fall short |
Max 2 clips per channel. No music videos / song lyrics. No channel already used 4+ times in `src/data/mockVideos.ts`.

## Hard rules
1. MANUAL Japanese subtitles required (`info['subtitles']` key starting with `ja`); no auto captions for N5 (accuracy
   matters most for beginners). Public, `playable_in_embed == True`, not live, not Shorts, 3–20 min.
2. yt-dlp only via the Python module (`import yt_dlp`; the exe is blocked); `python -X utf8`; ≥ 3 s between per-video
   requests; on HTTP 429 wait 60 s once, then move on / stop and report.
3. Only edit `src/data/mockVideos.ts` (new records), new `src/data/captions/*.json`, `src/data/glossary.json`,
   `src/data/captions/word-index.json`, scripts under `scripts/`, and `.superpowers/`. Never app code, existing caption
   files, versions, `public/`, `android/`.
4. New branch `content/n5-more` (`git switch -c content/n5-more`); stage files explicitly (never `git add -A`); commit
   locally; no push / release / version bump / `npm run bundle`.

## Pipeline (same tools as before — read `docs/prompts/gemini-add-clips.md` Steps 1–7 for details)
1. **Find**: add a category `n5_variety` to `scripts/find-general.py` with the search ideas above; collect ~40
   candidates; save `.superpowers/gemini/n5-candidates.md` (id, channel, title, duration, manual ja key, genre).
2. **Pre-check speed** before committing to a clip: fetch its manual ja subtitles and compute chars/second over
   speech time; reject > 7 chars/s. Prefer the slowest that fit each genre.
3. **Records** in `src/data/mockVideos.ts` copying an existing record's shape: id `vid-n5-<genre>-<slug>-<n>`, Thai
   title (translated real title), real japanese_title, channel, one-sentence Thai description from the real description,
   real duration, category from the table, emoji + dark gradient. Leave level fields to step 6.
4. **Captions + tokens**: `python -X utf8 scripts/fetch-captions.py <ids>` then `node scripts/tokenize-captions.mjs <ids>`.
   Keep lines short: if any line has > 40 Japanese chars, split it the way `docs/prompts/gemini-split-long-lines.md`
   describes (token boundaries, proportional timing) before translating.
5. **Thai + glossary**: `node scripts/export-untranslated.mjs <ids>` → translate per `.superpowers/translate/STYLE.md`
   (beginner clips: simple, natural Thai; polite ครับ/ค่ะ when the speaker is polite) → `import-translations.mjs` +
   `--check` 100%. Then `export-glossary.mjs` → prefill from `src/data/glossary.json` → gloss only new keys per
   `.superpowers/glossary/STYLE.md` → `import-glossary.mjs` + `--check` 100.00%.
6. **Verify the level** with `python -X utf8 scripts/relevel.py` (the same method used for all clips). Every new clip
   must come out **N5** (N4 is acceptable only if the channel/title explicitly says N5 and the computed level is N4).
   Any clip that computes N3 or harder: remove it (record + caption file) and replace it with another candidate of the
   same genre. Don't change other clips' levels in this task.
7. `node scripts/build-word-index.mjs`, `npm run build` (exit 0), commit.

## Verification checklist
- [ ] 15 new clips (minimum 12), all primary_jlpt N5 (or N4 per the exception), ≥ 6 genres, ≤ 3 podcast-style, ≤ 2 per channel.
- [ ] Every new clip ≤ 7 chars/s, no Japanese line > 40 chars.
- [ ] `import-translations.mjs --check` 100% for new files; `import-glossary.mjs --check` 100.00%.
- [ ] Existing caption files unchanged (`git diff --stat` lists only new caption files + word-index.json).
- [ ] `npm run build` exit 0.

## Report (`.superpowers/gemini/N5-REPORT.md` + short printed summary)
Table: id | channel | genre | title | duration | chars/s | computed level | lines. Then candidates rejected (and why:
too fast / no manual ja / not embeddable / computed level too hard), the two `--check` outputs, build result, commit hash.
