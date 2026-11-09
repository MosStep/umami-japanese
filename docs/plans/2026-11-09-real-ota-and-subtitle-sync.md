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
