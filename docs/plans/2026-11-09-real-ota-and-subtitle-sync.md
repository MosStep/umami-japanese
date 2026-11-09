# Plan: Real in-app OTA update + subtitles that match the video

Spec: this file (no separate spec). Repo: D:\umami-japanese, branch fix/real-ota-update.
Stack: React 18 + Vite 6 + TypeScript 5.6 + Capacitor 8 (Android). Build: `npm run build` (tsc -b && vite build).

## Global Constraints
- UI text stays in Thai, matching the existing tone of the app.
- Never trigger the Android Package Installer during a normal update. The APK path is ONLY for updates whose
  `min_native_build` is greater than the installed native build.
- The version shown in the app must come from the code that is actually running (compile-time constants or
  `CapacitorUpdater.current()`), never from a localStorage value written by the update flow.
- Plugin: `@capgo/capacitor-updater` 8.54.2 (already installed), manual mode only (`autoUpdate: false`), no Capgo cloud.
- GitHub repo: `MosStep/umami-japanese`. Manifest URL: `https://raw.githubusercontent.com/MosStep/umami-japanese/main/public/live_catalog.json`.
- `npm run build` must pass with 0 errors after every task.
- Do not push, tag, or create GitHub releases. Commit locally on the current branch only.

## Task 1: Real OTA web-bundle update (replaces the fake localStorage "OTA")

Background (the bug): `src/components/AutoUpdateModal.tsx` `handleStartLiveUpdate` only writes
`umami_live_version` / `umami_live_tag` etc. to localStorage and reloads. No new code is downloaded, the badge then
shows the new version so the app thinks it is up to date, and real fixes only arrive via the APK installer.
`src/config/version.ts` `getLiveAppVersion()` reads those fake keys.

Files: `capacitor.config.ts`, `src/config/version.ts`, new `src/utils/otaUpdater.ts`, `src/main.tsx`, `src/App.tsx`,
`src/components/AutoUpdateModal.tsx`, `public/live_catalog.json`, new `scripts/make-bundle.mjs`, `package.json`.

1. `capacitor.config.ts`: add
   `plugins: { CapacitorUpdater: { autoUpdate: false, appReadyTimeout: 10000, autoDeleteFailed: true, autoDeletePrevious: true, resetWhenUpdate: true } }`.
2. `src/config/version.ts`: keep `APP_VERSION_NAME`, `APP_BUILD`, `APP_RELEASE_DATE`; bump to `'1.0.7'`, `107`,
   `'2026-11-09'`. Add `export const NATIVE_BUILD = 107;` comment: "bump only when android/ native code changes".
   `APP_VERSION_BASE = 'v1.0.7'`. Delete `getLiveAppVersion`; `APP_VERSION = APP_VERSION_BASE`. On load, remove the
   legacy keys `umami_live_version, umami_live_tag, umami_live_title, umami_live_date, umami_live_release_notes, umami_live_catalog`
   (one-time cleanup, wrapped in try/catch) — do this in `otaUpdater.ts` `initOta()`.
3. `src/utils/otaUpdater.ts` (new). Exports:
   - `isNative(): boolean` — `Capacitor.isNativePlatform()`.
   - `initOta(): Promise<void>` — legacy-key cleanup; if native, `await CapacitorUpdater.notifyAppReady()` (catch + console.warn).
   - `type Manifest = { version: string; build: number; min_native_build: number; bundle_url: string; release_notes: string[]; announcement?: string; apk_url?: string }`.
   - `fetchManifest(): Promise<Manifest>` — GET manifest URL with `?t=${Date.now()}`, `cache: 'no-store'`; throw Thai error message on failure.
   - `compareVersions(a, b): number` — semantic compare, returns 1 / 0 / -1 (move the existing logic here; remove the
     duplicated copies in App.tsx and AutoUpdateModal.tsx).
   - `getUpdateKind(m: Manifest): 'none' | 'ota' | 'apk'` — `'none'` if `compareVersions(m.version, APP_VERSION_NAME) <= 0`;
     `'apk'` if `m.min_native_build > NATIVE_BUILD`; else `'ota'` (on web, `'ota'` means "reload page").
   - `downloadOta(m, onProgress: (pct: number) => void): Promise<BundleInfo | null>` — native: add a `'download'`
     listener for progress, `CapacitorUpdater.download({ url: m.bundle_url, version: m.version })`, remove listener; web: return null.
   - `applyNow(bundle)` — native: `CapacitorUpdater.set({ id: bundle.id })`; web: `location.reload()`.
   - `applyOnNextLaunch(bundle)` — native: `CapacitorUpdater.next({ id: bundle.id })`.
4. `src/main.tsx`: call `initOta()` before render (not awaited — do not block first paint).
5. `src/App.tsx` launch check: replace the GitHub releases API check with `fetchManifest` + `getUpdateKind`.
   If `'ota'` and native: download silently in the background, call `applyOnNextLaunch`, and show a small
   non-blocking toast at the bottom: "✨ อัปเดต v{version} พร้อมแล้ว" with a button "รีสตาร์ทเลย" that calls `applyNow`
   (toast dismissible). If `'apk'`: open the AutoUpdateModal as today. Silent on errors/offline.
6. `src/components/AutoUpdateModal.tsx`: check via `fetchManifest`. Primary button "⚡ อัปเดตในแอปทันที" runs
   `downloadOta` with a real progress bar (percentage from the listener), then `applyNow`. Remove the fake
   setTimeout steps and all writes of `umami_live_*` keys. `CURRENT_APP_VERSION` getters read compile-time constants only.
   The APK button is shown only when `getUpdateKind === 'apk'` (keep the existing AndroidAutoUpdater code path for it,
   `apk_url` from the manifest, falling back to `https://github.com/MosStep/umami-japanese/releases/download/v{version}/umami-app-debug.apk`).
   Show "ℹ️ อัปเดตนี้มีการเปลี่ยนส่วนเครื่อง (native) ต้องติดตั้ง APK ครั้งเดียว" above it.
7. `public/live_catalog.json`: add `"min_native_build": 107`,
   `"bundle_url": "https://github.com/MosStep/umami-japanese/releases/download/v1.0.7/web-bundle-1.0.7.zip"`,
   set `version` `1.0.7`, `build` `107`, `updated_at` `2026-11-09T00:00:00.000Z`, release_notes in Thai describing
   the real OTA update and the subtitle fix. Keep existing fields.
8. `scripts/make-bundle.mjs` + `package.json` script `"bundle": "npm run build && node scripts/make-bundle.mjs"`:
   reads version from `src/config/version.ts` (regex on APP_VERSION_NAME), zips the CONTENTS of `dist/` (index.html at
   zip root) to `release/web-bundle-<version>.zip` using devDependency `archiver` (install it), prints path + size.
   Add `release/` to `.gitignore`.
9. Write `docs/RELEASE.md` (Thai): how to ship a web-only update (bump APP_VERSION_NAME/APP_BUILD → `npm run bundle`
   → upload zip to GitHub release v<ver> → update live_catalog.json on main), and when to bump NATIVE_BUILD/min_native_build and ship an APK.

Verify: `npm run build` passes; `npm run bundle` produces a zip whose root contains `index.html`;
`npx cap sync android` succeeds and `android/app/src/main/assets/capacitor.plugins.json` lists CapacitorUpdater;
`grep -rn "umami_live_" src` only shows the cleanup list in otaUpdater.ts.

## Task 2: Subtitle sync engine fixes (src/components/ImmersionPlayer.tsx only)

Bug: in the 150 ms sync interval, when the playback time matches no line (gaps, before the first line, after the
last line) the previous line stays on screen forever, so the shown subtitle no longer matches the clip.

1. Add state `isLineActive: boolean`. In the interval compute `matchedIndex` with: a line is active when
   `sec >= start - 0.15` and `sec < end + 0.3` (seconds), clamped so it never overlaps the next line's start.
   When no line matches set `isLineActive=false` (keep `currentLineIndex` as the last passed line for the transcript list).
2. Main subtitle overlay: when `!isLineActive`, render the subtitle box empty/faded (opacity-0 transition) instead of the stale line.
   Word highlight (`getActiveTokenIndex`) returns -1 when not active.
3. Loop / auto-pause must use the matched line at that moment, not a stale `activeLine` closure, and auto-pause must
   fire once per line (track last paused line id in a ref) so it does not re-pause immediately after the user presses play.
4. Read the interval's changing values via refs so the interval is created once per video, not every line change.
5. Transcript list: the "active" highlight follows `isLineActive && idx === currentLineIndex`.

Verify: `npm run build` passes. Describe in the report the exact behaviour at t=before first line, in a gap, after last line.

## Task 3: Real timed subtitles pulled from YouTube

Root cause of wrong subtitles: `MOCK_SUBTITLE_LINES` in `src/data/mockVideos.ts` are hand-written with invented
timestamps (0–22 s) that do not correspond to what is said in the video. The official channels (Ani-One) publish real
Thai subtitles with real timing on YouTube (`th` manual track; verified for `miiLadou1cw`). Japanese may exist as a
manual `ja` track or an auto track.

1. `scripts/fetch-captions.py` (Python 3.12, run as `python -m yt_dlp`-style via the `yt_dlp` module API, NOT the
   `yt-dlp` exe which is blocked). For each `youtube_id` in `src/data/mockVideos.ts` (parse with regex `"youtube_id": "([^"]+)"`,
   de-duplicate): download subtitles in json3 for languages `ja` (manual first, then auto `ja`/`ja-orig`) and `th` (manual first,
   then auto), `skip_download=True`. Write `src/data/captions/<youtube_id>.json`:
   `{ "youtube_id", "source": { "ja": "manual|auto|none", "th": "manual|auto|none" }, "lines": [ { "start_ms", "end_ms", "ja": string|null, "th": string|null } ] }`.
   Primary timeline = the `ja` track if present, else `th`. Attach the other language by maximum time overlap.
   Strip empty events and `\n` newlines → spaces. Sleep 2 s between videos; on failure for one video log and continue.
   Run it once and commit the generated JSON files.
2. `src/data/captions/index.ts`: `import.meta.glob('./*.json', { eager: true })` → `getRealCaptions(youtubeId)`.
3. In the player's data source (where `activeSubtitleLines` is computed in ImmersionPlayer.tsx or AppContext.tsx —
   find it): if real captions exist for the video's `youtube_id`, build `SubtitleLineRecord[]` from them
   (`start_time_ms/end_time_ms` from the file, `japanese_text` = ja or "", Thai translation field = th, `tokens_json` =
   one token per Japanese line split on spaces/punctuation, or `[]` when no ja; reuse the record's existing field names
   from `src/types`). Otherwise fall back to `MOCK_SUBTITLE_LINES`. Components must not crash on empty `tokens_json`
   or empty Japanese text (show the Thai line alone).
4. Report a table: youtube_id → ja source, th source, line count.

Verify: `npm run build` passes; at least the Ani-One videos have real `th` lines with timestamps beyond 22 s.

## Task 4: The Dojo — mobile-first UX/UI cleanup (src/components/TheDojo.tsx)

Audit at 375x812 (controller, 2026-11-09): the English marketing hero ("Master Both Input & Output" + paragraph) fills the
whole first screen; the three mode pills ("Mode A: Flashcards (152)", "Mode B: Shadowing & Waveform", "Mode C: AI Roleplay (kob-ai)")
are stacked inside that hero in English jargon; then a deck switch, then a filter row, so the actual flashcard starts
below the fold. Grading buttons use emoji + long Thai text crammed in 3 tall boxes. Mixed Thai/English throughout.
Guidance source: ui-ux-pro-max skill (touch targets >= 44px / min-h-11, >= 8px gaps, no emoji as structural icons —
use lucide-react which is already a dependency, mobile-first then md:/lg:, visible pressed state without layout shift,
dark-mode contrast >= 4.5:1 for text).

Scope: layout/presentation only. Do NOT change SRS/XP/grading logic, state shape, handlers, data, or Mode C AI calls.

1. Replace the hero with a compact header (max ~64px tall on mobile): title "โดโจ" + one short Thai subtitle line
   "ฝึกคำศัพท์ • พูดตาม • สนทนา". Remove the English marketing paragraph and the big 道場 watermark on mobile (keep on md+ optional).
2. Mode switch = one horizontal segmented control directly under the header, 3 equal segments, each min-h-11 with a
   lucide icon + Thai label: "แฟลชการ์ด" (Layers), "พูดตาม" (Mic), "สนทนา AI" (MessageCircle). Selected segment clearly
   filled; `role="tablist"`/`role="tab"`/`aria-selected`. Sticky at the top of the Dojo content (below the app navbar) so it stays reachable.
3. Mode A: put deck (คำศัพท์ / ประโยคที่บันทึก) and filter (ทั้งหมด / กำลังเรียน / จำได้แล้ว) into ONE compact row of small chips
   (each min-h-11 tap area), with the progress "คำที่ 1 / 152" as a thin progress bar + text above the card.
   The flashcard must be visible without scrolling on 375x812 (word + reveal button above the fold).
4. Grading buttons (both word deck and mined deck): one row, equal width, min-h-12, short Thai labels:
   word deck "ยังจำไม่ได้" / "พอจำได้" / "จำได้แม่น"; mined deck keep its 4 grades with short Thai labels
   "อีกครั้ง" / "ยาก" / "ดี" / "ง่าย". XP hint as a small second line (text-xs). Replace emoji icons in these buttons with lucide icons
   (X, Zap/Minus, Check, etc.). Pressed state: `active:opacity-80` / `active:brightness-90` (no scale transforms that shift layout).
5. Reveal button: full-width, min-h-12, label "แตะเพื่อดูคำตอบ". Card text: Japanese word stays large; reading + Thai meaning >= text-base.
6. Mode B and Mode C: only apply the same header/segmented control, touch-target (min-h-11) and Thai-label fixes to their
   controls; translate remaining English UI labels in those sections to Thai; do not restructure their logic.
7. No text smaller than text-xs (12px); body text >= text-sm; check color contrast of slate-500-on-slate-900 style labels
   and bump to slate-400/300 where they carry information.

Verify: `npm run build` passes. Dev server (`npm run dev`, http://localhost:5173, viewport 375x812): Dojo tab shows the
segmented control and the flashcard word + reveal button without scrolling; all three modes still switch and work
(reveal → grade advances to next card). Report before/after notes per numbered item.

## Task 5: Full-clip content — every video playable, fully subtitled, tokenized

User request (2026-11-09): learn from the WHOLE clip with Thai translation for the whole clip, app "100% ready".
State after Task 3: real captions exist for miiLadou1cw, YKnowHCkAA8, OgyORlzV0uw (full ~24 min episodes, official Thai),
BMpzc-gck0c (2 h compilation, auto ja + auto th), nGLVwQuwnfY (manual ja only 33 lines), SX_ViT4Ra7k (43 lines).
Broken: S-zdoi1dv8k (members-only), 6q_3f5mE6E8 / FkL4CjZ12aM / 2OvyA2__Lak (unavailable), 5yx6BWlEVcY (no ja/th track),
and vid-vlog-n5-uji wrongly reuses the Pokémon video nGLVwQuwnfY. All video records have fake `duration` 60/65.

1. User ruling (2026-11-09): DELETE every video record whose captions cannot be fetched — S-zdoi1dv8k (members-only),
   6q_3f5mE6E8, FkL4CjZ12aM, 2OvyA2__Lak (unavailable), 5yx6BWlEVcY (no ja/th track), and vid-vlog-n5-uji (wrongly reuses
   the Pokémon video). Also delete a6JwRs2in0E if Task 3's retry still failed. Remove their MOCK_SUBTITLE_LINES entries and
   any other references (albums, featured lists, default video id — grep the record ids across src/).
2. `scripts/find-anione.py` (yt_dlp module API, never the exe): list uploads of the Ani-One Asia channel
   (`https://www.youtube.com/@AniOneAsia/videos`, extract_flat, newest 200) and pick 8 NEW full episodes (not already in
   the app) across at least 4 different anime series. Accept a candidate only if: public, `playable_in_embed` true, not live,
   duration 15–30 min, and it has a MANUAL `th` subtitle track AND a `ja` track (manual or auto). Prefer episode 1 of each series.
   Print the chosen table (youtube_id, title, series, duration, sub tracks) in the report.
3. Add one video record per chosen episode to `src/data/mockVideos.ts` following the existing Ani-One records' shape
   (id `vid-anione-<series-slug>-<ep>`, category `Anime`, a Thai title "<ชื่อเรื่องภาษาไทย> ตอนที่ N (Ani-One Asia)",
   a short Thai description, the series emoji + gradient). Set the real `duration` (seconds) for ALL video records.
4. Re-run `scripts/fetch-captions.py` for all ids (Task 3's fixed version).
5. `scripts/tokenize-captions.mjs` (devDependency `kuromoji`): for every caption JSON line with Japanese text, write
   `tokens: [{ surface, lemma, reading (hiragana), romaji (Hepburn, from a small kana table in the script), pos }]`.
   `src/data/captions/index.ts` builds `tokens_json` from these (reading_kana = reading, romaji, part_of_speech), and
   when a token's lemma equals an existing `dictionaryWords` lemma, use that word's id so the tap card shows its meaning.
   Skip pure punctuation tokens for tap targets but keep them in the rendered text.
6. `npm run build` passes; report the per-video table: youtube_id, duration, lines, % lines with ja, % lines with th,
   th source (manual/auto/missing).

## Task 7: Code Geass episodes (user request 2026-11-09) — runs BEFORE Task 6

Add Code Geass: Lelouch of the Rebellion EP1–EP3 from Ani-One Asia (not Ani-One Thailand: its Thai subs are burned
into the picture, which would duplicate the app's subtitles). Controller checked: NZyO-FFwmHE (#1), U7VDDvGEwdA (#2),
jVywpPb1TLE (#3); public, embeddable, ~1448 s; tracks: manual `en` (+ fil/id/zh), auto `ja-orig`/`ja`; NO manual th.
1. `scripts/fetch-captions.py`: support videos with no manual th: take `ja-orig` (preferred) or auto `ja` as the PRIMARY
   timeline (rolling-caption dedupe as today) and attach the manual `en` track by midpoint overlap into a new optional
   line field `en` (reference for translators; not shown in the UI). Existing videos' output must not change
   (re-run and diff: only the 3 new files appear).
2. Records in `src/data/mockVideos.ts`: ids `vid-anione-codegeass-01..03`, category Anime, Thai title
   "โค้ดกีอัส ภาคการปฏิวัติของลูลูช ตอนที่ N (Ani-One Asia)", japanese_title "コードギアス 反逆のルルーシュ", 1-sentence Thai
   description per episode from the YouTube description (no invented plot), emoji ♟️, a dark purple/red gradient,
   real duration, primary JLPT N3.
3. Tokenize with `scripts/tokenize-captions.mjs` (same as Task 5). `npm run build` passes. Report lines / % ja / en coverage.
Their Thai lines are produced by Task 6 (which also uses the `en` field as a reference when present).

## Task 6: Thai translation for every line (content)

After Task 5, every line with Japanese text must have a natural Thai translation (`th`), and lines whose `th` came from
YouTube AUTO translation are re-translated from the Japanese. Official manual Thai is kept as-is.
1. `scripts/export-untranslated.mjs` writes batches of at most 150 lines to
   `.superpowers/translate/<youtube_id>-<n>.json` as `[{ "key": "<start_ms>", "ja": "..." }]` for lines needing Thai.
2. Translate each batch (include the line's `en` field in the batch as a reference when present) into `<same>.th.json` as `[{ "key", "th" }]`: natural spoken Thai matching the speaker's tone
   (casual anime speech stays casual), no romanization, keep names in Thai script as official Thai subs do
   (ยูจิ, โกโจ, สุคุนะ, อิจิโกะ, เดนจิ, โปจิตะ...). Never leave a line empty.
3. `scripts/import-translations.mjs` merges them back into `src/data/captions/*.json` with `th_source: "ai"`;
   `source.th` becomes `"manual+ai"` / `"ai"` accordingly.
4. Verify: 100% of ja lines have th; spot-check table of 10 random lines per video in the report; `npm run build` passes.

## Task 8: Device-test fixes from 1.0.7 (user, 2026-11-09) — ship in 1.0.8 OTA (web-only, no native changes)

Screenshots from the user's Android phone running 1.0.7:
A. Top bar sits under the status bar / camera cutout (app is edge-to-edge; Capacitor 8 SystemBars runs in default
   "css" insets mode and injects `--safe-area-inset-top/right/bottom/left` CSS variables on <html>).
B. Contextual dictionary sheet (ContextualDictionaryModal.tsx) for an unlinked token (e.g. 宣戦): "ความหมายในประโยคนี้" shows
   `""`, the dictionary list shows one empty bullet, the source sentence's 🇹🇭 line is empty (Code Geass Thai ships in 1.0.8),
   and the page behind the sheet scrolls when the user drags. User: hard to use, meaning hard to find.
C. Videos feed still shows two "User Imported" clips ("Codeguass", "Codeguess", 0:10, no subtitles) that the user once
   added by hand (custom videos in localStorage `umami_custom_videos_v1`); user wants them gone.
D. Profile shows fake seeded stats the user never earned: streak 7 days, 84 immersion mins, XP 1951 (seeded
   xp_viewing 450 / reading 380 / listening 520 / shadowing 290 in AppContext ~:277-290), Known Words 10 (seeded word
   states), Mined Cards 2 (mined-seed-1/2 seeded in Task 5). User: these are not my stats.

1. Safe areas: a shared CSS utility `.safe-top { padding-top: var(--safe-area-inset-top, env(safe-area-inset-top, 0px)); }`
   applied to the top app bar (Navbar.tsx; also make sure sticky offsets that assumed the bar height — e.g. TheDojo's
   `top-[53px] sm:top-[57px]` — add the inset: `top-[calc(53px+var(--safe-area-inset-top,0px))]`); bottom nav and
   bottom sheets use `var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))` (update `.safe-area-bottom` in index.css).
   Full-screen modals (AutoUpdateModal, SettingsModal, ContextualDictionaryModal) must not be clipped by the cutout.
2. Dictionary sheet usability:
   - Lock background scroll while any modal/sheet is open (`document.body.style.overflow='hidden'` + restore on close,
     via a small `useLockBodyScroll(isOpen)` hook in src/utils/, used by all three modals); `overscroll-behavior: contain` on the sheet body.
   - Never render empty quotes/bullets: if a token has no meaning, show "ยังไม่มีความหมายในคลัง — แตะ 'วิเคราะห์ไวยากรณ์' เพื่อให้ AI อธิบาย"
     (muted) and hide the empty dictionary list; hide the 🇹🇭 row when the line has no Thai.
   - Put the most useful info first: word + reading + Thai meaning (large) + the line's Thai translation, then the
     status buttons, then the rest. Thai UI labels only (drop the English "(Context)", "(DICTIONARY)", "CONTEXTUAL DICTIONARY",
     "(SOURCE SENTENCE)", "(Optional note)" suffixes). Keep the existing actions/handlers.
   - Tap targets ≥ 44px, text ≥ 12px (ui-ux-pro-max rules from Task 4).
3. Custom (user-imported) videos: add a delete action on user-imported feed cards (trash icon button, confirm dialog in
   Thai "ลบคลิปนี้ออกจากแอป?"), wired to a new `removeCustomVideo(id)` in AppContext that also removes its custom lines and
   any mined sentences on it. Plus a one-time migration (flag `umami_migr_108_v1`) that removes custom videos whose
   subtitle line list is empty or whose duration ≤ 15 s (the broken "Codeguass/Codeguess" imports).
4. Real stats only: new installs start at zero — streak 0, immersion 0, all XP 0, no seeded word states, no seeded mined
   sentences. One-time migration (same flag) for existing users: subtract the exact seed values from stats (floor at 0)
   — streak/immersion: reset to 0 then track for real; XP: xp_x = max(0, xp_x − seed_x); remove mined sentences with ids
   starting `mined-seed-`; remove word states that exactly match the seeded set (only if they still equal the seed status).
   Verify streak and immersion are actually tracked: streak = consecutive local days with app use (store last-active date),
   immersion minutes = real playing time from the player (accumulate while YT state is playing). Implement if missing.
   Known Words / Mined Cards on the profile must be computed from real wordStates / minedSentences.
   Also: the "viewing" XP (+2 per line change, ~400 lines per episode) inflates XP — cap at +2 per line only the first time
   that line becomes active per video session.
5. OTA robustness (final-review Important): move `CapacitorUpdater.notifyAppReady()` from before render to a `useEffect`
   in App after first mount, so a bundle that crashes while rendering gets rolled back.
6. docs/RELEASE.md: add (a) a failed version is blocked forever on devices — ship fixes under a NEW version string,
   never re-upload; (b) while 1.0.6 installs exist, attach `umami-app-debug.apk` (the latest native APK) to EVERY release and
   start the body with the 1.0.6 warning (tap "📦 ติดตั้งไฟล์ APK ใหม่", not "⚡ อัปเดตในแอพทันที").
Verify: `npm run build` passes; dev server at 375x812 with `document.documentElement.style.setProperty('--safe-area-inset-top','32px')`
shows the bar below the 32 px inset; modal scroll lock works; migration tested by seeding localStorage with the old seed values.

## Task 9: Thai glossary so every tapped word has a meaning (ship in 1.0.8)

After Task 5 only ~5% of caption tokens link to the 125-word dictionary; 5,092 unique content lemmas (18,236
occurrences) have no meaning, so the tap card is empty (user screenshot: 宣戦). Some common words that ARE in the
dictionary (私, 俺) don't link either — investigate the homograph/reading check in tokenize-captions.mjs / index.ts.
1. Fix the linking miss for dictionary words (report before/after link %).
2. `scripts/export-glossary.mjs`: collect unique (lemma, reading, pos) for content tokens (skip 助詞/助動詞/記号, and
   lemmas already linked to the dictionary), with 1 example ja line each and occurrence count; write batches of ≤ 500 to
   `.superpowers/glossary/batch-<n>.json` as `[{ "k": "<lemma>|<reading>", "lemma", "reading", "pos", "ex": "<ja line>" }]`.
3. Translators write `batch-<n>.th.json` as `[{ "k", "th": "<short Thai gloss, 1–4 meanings separated by ', '>" }]`.
4. `scripts/import-glossary.mjs` builds `src/data/glossary.json` = `{ "<lemma>|<reading>": "<thai>" }` (compact), validating
   every key present, non-empty, no Japanese chars in th.
5. `src/data/captions/index.ts`: for tokens without a dictionary link, set `thai_meaning` and `general_meanings` from the
   glossary (lazy-load glossary.json once with dynamic import, cached; lines built before it loads may re-render when ready).
6. `npm run build` passes; report coverage: % of content tokens with a Thai meaning (target ≥ 98%).

## Task 10: General/fun clips + podcasts (user request 2026-11-09) — before Task 9 glossary export

User wants fun general clips like はじめしゃちょー (Hajime Shacho) and Japanese podcasts, and the N5/N4 levels back.
1. `scripts/find-general.py` (yt_dlp module API only; ≥ 3 s between per-video info requests; on HTTP 429 wait 60 s once,
   then stop and report what you have). Candidates must be: public, `playable_in_embed` true, not live/shorts,
   and have a MANUAL Japanese subtitle track (`ja` / `ja-JP` / any `ja*` manual) — auto-only is NOT accepted (YouTuber
   speech ASR is too noisy). Sources to scan (channel /videos tab, extract_flat newest 150, then info only for plausible ones):
   - Fun/general (category `Vlogs` or `Variety`): @HajimeSyacho (はじめしゃちょー), plus 2–3 similar big Japanese
     entertainment YouTubers of your choice if Hajime has too few with manual ja subs. Duration 4–20 min. Pick 5.
   - Podcasts (category `Podcasts`), learner-friendly with manual ja subs: e.g. Comprehensible Japanese (@cijapanese),
     YUYUの日本語Podcast, Japanese with Shun, Nihongo con Teppei (if subbed), or similar. Duration 5–30 min. Pick 5, at
     least 2 beginner (N5/N4) and 2 intermediate (N3).
   Print a table (youtube_id, channel, title, duration, manual ja track key, other manual tracks) to the report.
2. Records in `src/data/mockVideos.ts` (template: existing records): ids `vid-gen-<slug>-<n>` / `vid-pod-<slug>-<n>`,
   Thai title (translate the real title), japanese_title (real title), channel name, 1-sentence Thai description from
   the real description (no invented content), real duration, category, emoji + gradient, primary JLPT: podcasts by
   their stated level (N5/N4 beginner, N3 intermediate), YouTuber vlogs N3 (natural speech) unless clearly simpler.
3. `scripts/fetch-captions.py --ids ...` for the new ids only (manual ja → ja-primary branch; manual en attached if present);
   then `node scripts/tokenize-captions.mjs` for the new files only. Other caption files must stay byte-identical.
4. Export Thai batches for the new files with `scripts/export-untranslated.mjs` (they have no manual th) — the controller
   dispatches translators. `npm run build` passes. Report per-file lines / % ja / batch files.
7. (added after Task 8 review) Build-time word index: `scripts/tokenize-captions.mjs` (or a small new script run after it)
   emits `src/data/captions/word-index.json` = `{ "<youtube_id>": ["<lemma>|<reading>", ...unique content keys] }`; the feed's
   known-% uses it instead of loading every caption file (resolve dictionary ids at runtime from lemma+reading, so the
   index cannot drift from dictionary changes). Then remove the idle sequential loading of all captions from the feed.

## Task 12: Subtitle dock layout (user device feedback, ship in 1.0.9 APK)

Phone screenshot (375-ish wide, 1.0.7): in ImmersionPlayer's subtitle dock the Japanese line renders at text-2xl/3xl
with wide token gaps, furigana and a dotted underline + per-token meaning under each token, so a normal line wraps to
3 rows and the Thai translation is pushed off-screen (the user can't see it without scrolling); the tap-word card then
appears below and covers more. In gaps between lines the whole dock fades out (opacity-0) — the user wants the frame to stay.
1. Compact Japanese line: base `text-xl` (sm:text-2xl), tighter token spacing (`gap-x-0.5 gap-y-1`), furigana `text-xs`
   (≥ 12px rule), keep the tap target ≥ 32px tall per token via padding not font size; dotted underline 1px; show the small
   per-token Thai gloss under a token ONLY for the tapped/active token (not under every learning word). A typical 15–20
   character line should fit in ≤ 2 rows at 375px.
2. Thai translation always visible directly under the Japanese (when translation is not hidden), `text-base`, max 2 lines
   then wraps — never pushed below the fold by the controls; move the reading-mode segmented (ฮิรากานะ / โรมันจิ / ปิด)
   and the show/hide-translation toggle into ONE compact row (icon+short label, min-h-11) above the line.
3. Fixed-size frame: the dock keeps a stable min-height (so the page doesn't jump between lines) and NEVER disappears.
   In a gap (no active line): keep showing the last spoken line dimmed (`opacity-50`) with a small muted label
   "♪ ช่วงไม่มีบทพูด"; before the first line show "รอบทพูดแรก…" in the frame. Tokens of a dimmed line stay tappable.
4. The tap-word floating card must not cover the Thai translation: render it as a compact overlay anchored ABOVE the
   dock (or a bottom sheet over the controls), with a close button, max-height and its own scroll.
Verify: `npm run build`; dev server at 375x812 — a 20-char line + Thai fits in the dock without scrolling the page.

## Task 13: Tiny word popover (user device feedback on 1.0.9) — ship as 1.0.10 OTA (web-only)

Phone screenshot (1.0.9): tapping a word opens the compact definition card as a large overlay anchored above the
subtitle dock; it covers the video (word header, Thai meaning, two big status buttons, a full-width "ดูไวยากรณ์เชิงลึก & ถาม AI" button).
User: "just a tiny popup when I tap".
1. Replace that overlay with a small popover anchored to the tapped token inside the dock (position: absolute relative to
   the token row; prefer just below the token, flip above if it would overflow the dock bottom; clamp horizontally to the
   dock with 8 px margin; max-w-[15rem]; small arrow/caret optional). It must never cover the video area.
2. Content (compact): line 1 = word (text-lg) + reading in kana (text-sm, indigo) ; line 2 = Thai meaning (text-sm, wraps,
   max 2 lines then ellipsis) ; line 3 = a row of 4 small icon buttons (each 36×36 visual inside a ≥ 44×44 hit area via
   padding/negative margin is NOT allowed — use h-11 w-11 rounded-full icon buttons, gap-1): Volume2 (listen), Check
   (จำได้แล้ว, highlighted when known), Zap (กำลังเรียน, highlighted when learning), MoreHorizontal (opens the full
   ContextualDictionaryModal as before). aria-labels in Thai.
3. Dismiss: tap outside, tap the same token again, Escape, or when the active line changes. Only one popover at a time.
4. Keep everything else in the dock as in Task 12 (Thai translation fully visible; the popover may overlap the Thai
   line temporarily — acceptable — but not the video).
5. Bump to 1.0.10 web-only: src/config/version.ts APP_VERSION_NAME '1.0.10', APP_VERSION_BASE 'v1.0.10', APP_BUILD 110,
   NATIVE_BUILD stays 109; android/ untouched; public/live_catalog.json min_native_build stays 109, apk_url stays the v1.0.9
   APK, release_notes = new first entry "💬 แตะคำแล้วขึ้นป๊อปอัปเล็กๆ ข้างคำ ไม่บังวิดีโอ" + "⚡ อัปเดตนี้ติดตั้งในแอปทันที ไม่ต้องลง APK", keep the rest;
   then `npm run bundle` (writes version/bundle_url/checksum). Verify compareVersions('1.0.10','1.0.9') > 0 (semantic, not string).
