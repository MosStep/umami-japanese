# Task: add many more learning clips to the Umami app (Japanese → Thai)

## Role
You are a careful coding + content agent working in the repository `D:\umami-japanese` (React + Vite + TypeScript +
Capacitor Android app "うまみ / Umami", Thai UI). Learners watch a whole YouTube clip with timed Japanese subtitles, a
Thai translation for every line, and tap any word to see its reading and Thai meaning. Your job is to add MANY more
clips across many genres, using the repo's existing scripts — not to change app code.

## Goal (what "done" looks like)
Add **40 new clips** (aim for this; 30 is the minimum acceptable), every one fully working:
- Japanese subtitles timed to the video for the WHOLE clip,
- Thai on 100% of lines that have Japanese,
- every content word tokenized and with a Thai meaning (glossary coverage 100%),
- `npm run build` passes, and everything is committed on a new branch `content/more-clips`.

### Level and genre mix (counts are targets; ±2 per row is fine)
| Level | Count | Good genres for this level |
|---|---|---|
| N5 | 10 | slow "easy Japanese" / comprehensible-input channels, kids' shows/songs-free stories, beginner podcasts, simple daily vlogs |
| N4 | 10 | learner podcasts, slow vlogs (cafe, shopping, cooking), easy interviews, simple anime (slice-of-life) |
| N3 | 10 | YouTuber variety (see below), travel/food vlogs, anime episodes, NHK-style easy news |
| N2 | 6  | regular news, documentaries, longer interviews, talk/variety shows, drama-like anime |
| N1 | 4  | news analysis, business/tech talks, documentaries, debates/lectures |

Cover at least these genres somewhere in the 40: **YouTuber variety (はじめしゃちょー-style)**, vlog/daily life, travel,
food/cooking, anime (official uploads), podcast/learner content, news, documentary/interview, gaming commentary, culture/how-to.
No single channel may provide more than 4 clips. No music videos or song-lyric content (copyright) — skip them.

### はじめしゃちょー-style YouTubers (the user explicitly wants these)
Channels to try first: `@HajimeSyacho`, `@HikakinTV`, `@FischersTV` (Fischer's), `@TokaiOnAir` (東海オンエア),
`@mizutamaribond` (水溜りボンド), `@SHAKAchannel`, and similar big Japanese entertainment YouTubers. Most of their videos
have NO manual Japanese subtitle file (captions are burned into the picture), so for THIS genre only, auto-generated
Japanese (`ja-orig` / `ja` in `automatic_captions`) is allowed — the caption script already cleans speech-recognition noise
for auto tracks. Prefer videos with clear single-speaker talk (challenges, reviews, explanations) over loud multi-person
chaos. Target 6–8 clips from this genre, levels N3 (mostly) / N2.

## Hard rules (do not break)
1. **Subtitle source rule:** every clip needs real timed Japanese captions from YouTube. Manual `ja*` track
   (`info['subtitles']`) is required for every genre EXCEPT the YouTuber-variety genre above (auto allowed there).
   Never use subtitles burned into the picture, never invent timings.
2. Candidate must be: public, `playable_in_embed == True`, not live, not a Short, duration 3–30 min (anime/news/docs up to 30 min).
3. **yt-dlp only via the Python module** (`import yt_dlp` / `python -m yt_dlp`) — the `yt-dlp.exe` binary is blocked.
   Use `python -X utf8` for anything that prints Japanese/Thai.
4. **Rate limits:** wait ≥ 3 s between per-video info/subtitle requests. List channels with `extract_flat` first and only
   fetch full info for plausible titles. On HTTP 429: wait 60 s once, retry; if it repeats, stop that source, keep what
   you have, and move on (or stop and report).
5. **Do not edit app code** (`src/components/**`, `src/context/**`, `src/utils/**`, `capacitor.config.ts`, `android/**`,
   `src/config/version.ts`, `public/live_catalog.json`). Only touch: `src/data/mockVideos.ts`, `src/data/captions/*.json`,
   `src/data/captions/word-index.json`, `src/data/glossary.json`, and (if really needed) scripts under `scripts/`.
6. **Do not** bump versions, run `npm run bundle`, push, tag, or create GitHub releases. Commit locally on
   `content/more-clips` only. The app owner's other agent reviews and ships the update.
7. Existing caption files must stay byte-identical (only NEW files appear in `git diff --stat src/data/captions`, plus
   `word-index.json`).
8. Never put secrets/API keys anywhere.

## Pipeline (run in this order)
Working dir: `D:\umami-japanese`. Shell: Git Bash. Read each script briefly before using it.

### Step 1 — Find candidates
- Extend `scripts/find-general.py` (it has a `CATEGORIES` dict and is run as `python -X utf8 scripts/find-general.py <category>`)
  with new categories, e.g. `n5_easy`, `n4_learner`, `youtuber` (auto ja allowed), `vlog`, `food`, `news`, `docs`,
  `gaming`, each with its own channel/search list, duration range and target count. Keep the existing `general`
  and `podcasts` categories working.
- For anime, `scripts/find-anione.py` already scans the Ani-One Asia channel (official full episodes with manual Thai).
  Add at most 4 more anime episodes, from series NOT already in the app (check `src/data/mockVideos.ts`).
- Save a candidates table (youtube_id, channel, title, duration, chosen ja track key + manual/auto, other manual tracks,
  your level guess and why) to `.superpowers/gemini/candidates.md`.

### Step 2 — Add video records
Append one record per accepted clip to `MOCK_VIDEOS` in `src/data/mockVideos.ts`, copying the exact shape of an existing
record. Example (an existing podcast record — copy its fields, change values):
```ts
{
  "id": "vid-pod-immersion-01",
  "youtube_id": "oKTHD2Wi0zU",
  "title": "พอดแคสต์ภาษาญี่ปุ่นสำหรับผู้เริ่มต้น: ฝึกพูดตาม",
  "japanese_title": "はじめての日本語【N6】日本語へようこそ！｜Shadowing for Absolute Beginners",
  "channel": "Japanese super immersion",
  "category": "Podcasts",
  "difficulty_rating": 1,
  "primary_jlpt": "N5",
  "jlpt_distribution": { "N5": 60, "N4": 30, "N3": 10, "N2": 0, "N1": 0 },
  "duration": 1717,
  "thumbnail_gradient": "from-blue-900 via-indigo-900 to-slate-900",
  "scene_emoji": "🎙️",
  "description": "บทฝึกพูดตาม (shadowing) สำหรับผู้เริ่มต้นสุด ๆ โดยระบุระดับในชื่อคลิปว่า N6"
}
```
Rules: `id` = `vid-<genre>-<slug>-<n>` (unique); `title` = natural Thai translation of the real title; `japanese_title` =
the real title; `description` = one Thai sentence based only on the real YouTube description/title (no invented plot);
`duration` = real seconds; `jlpt_distribution` must sum to exactly 100 and `primary_jlpt` must be its largest bucket;
`category` must be one the feed already understands: `Anime`, `Podcasts`, `Vlogs`, `J-Pop`, `Gaming`, `Street Food`
(check `src/components/VideoFeed.tsx` for the full category→label map; if a genre fits none, use the closest one —
e.g. news/docs/YouTuber → `Vlogs` or `Podcasts` — and note it in the report rather than editing the component);
pick a fitting `scene_emoji` and a dark Tailwind gradient.

### Step 3 — Fetch captions (new ids only)
`python -X utf8 scripts/fetch-captions.py <youtube_id> <youtube_id> ...`
(it reads ids from mockVideos.ts and filters by the args). It picks manual ja first, pairs a manual Thai track if
one exists, attaches manual English as a reference, and cleans auto-ja noise. Check each new file: lines sorted, whole
clip covered (last `end_ms` ≈ duration), ≥ 80% of lines have `ja`. Drop (delete record + file) any clip that fails.

### Step 4 — Tokenize (new ids only)
`node scripts/tokenize-captions.mjs <youtube_id> ...`

### Step 5 — Thai translation for every line
1. `node scripts/export-untranslated.mjs <new youtube_id> ...` → batches in `.superpowers/translate/` (+ `INDEX.md`).
2. Read `.superpowers/translate/STYLE.md` and follow it exactly. For every `X.json` write `X.th.json` =
   `[{ "key": "<same key>", "th": "<Thai>" }]`, every key, same order, never empty, no kana/kanji in `th`
   (write Japanese words being explained as romaji in quotes, e.g. คำว่า "taberu" แปลว่า กิน).
   Natural spoken Thai matching the speaker (casual stays casual, polite → ครับ/ค่ะ). For auto-ja YouTuber clips the
   Japanese may contain recognition errors: use `prev`/`next`/`en` context and translate what was most plausibly said.
3. `node scripts/import-translations.mjs` then `node scripts/import-translations.mjs --check` → every new file 100%.

### Step 6 — Thai meaning for every new word (glossary)
1. `node scripts/export-glossary.mjs` → `.superpowers/glossary/batch-*.json` (+ INDEX.md). It exports ALL unlinked keys,
   including the 6,555 that already have meanings in `src/data/glossary.json`.
2. For each batch, first prefill `batch-N.th.json` from the existing `src/data/glossary.json` (same key → copy the Thai),
   then gloss ONLY the missing keys yourself, following `.superpowers/glossary/STYLE.md` (short Thai gloss, 1–4 meanings
   separated by ", ", proper nouns transliterated + type in parentheses, nonsense → "(คำไม่ชัดเจน)").
3. `node scripts/import-glossary.mjs` then `node scripts/import-glossary.mjs --check` → coverage must print 100.00%.

### Step 7 — Word index + build
`node scripts/build-word-index.mjs` then `npm run build` (must exit 0).

### Step 8 — Commit
`git switch -c content/more-clips` (from the current branch), stage ONLY the allowed files explicitly (never
`git add -A`; `.superpowers/` and `.claude/` must not be committed), commit with a clear message.

## Verification checklist (all must be true before you report)
- [ ] ≥ 30 (target 40) new clips; level counts within ±2 of the table; ≥ 6 YouTuber-variety clips; no channel > 4.
- [ ] `git diff --stat <start>..HEAD -- src/data/captions` shows only new files + word-index.json.
- [ ] `import-translations.mjs --check` → 100% on every new file; `import-glossary.mjs --check` → 100.00%.
- [ ] Every new record: jlpt_distribution sums to 100, real duration, Thai title/description, valid category.
- [ ] `npm run build` exit 0.

## Report (write to `.superpowers/gemini/REPORT.md` and print a short summary)
1. Table of added clips: id | youtube_id | channel | genre | level | duration | ja source (manual/auto) | th source (manual/ai) | lines.
2. Totals per level and per genre; sources you tried that yielded nothing (and why: no manual ja / 429 / not embeddable).
3. Clips you dropped and why.
4. Commands run with their final outputs (the two `--check` outputs and the build result).
5. Anything you were unsure about (levels, translations, category mapping).
