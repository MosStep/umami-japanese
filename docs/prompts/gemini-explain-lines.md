# Task: write a Thai explanation for every subtitle line (Umami app)

## Role & context
You are a Japanese teacher + content agent in `D:\umami-japanese` (Japanese-learning app for Thai speakers). Learners
watch clips with timed Japanese subtitles and Thai translations, and can tap each word for its reading and meaning.
The app will get an **"อธิบายประโยค" (explain this line)** button. Its content is written now, offline, by you, and
shipped with the app — no AI is called at runtime. So accuracy matters more than speed: a learner will trust it.

Scale: 98 clips, ≈ 21,200 lines (lines shorter than 5 characters are skipped automatically). Work level by level
(N5 → N4 → N3 → N2 → N1) and commit after each level, so finished levels can ship while you continue. The tool is
resumable: re-running `export` only lists lines that still have no explanation.

## The tool (already written; don't change its rules)
`scripts/explain-tool.mjs`:
- `node scripts/explain-tool.mjs export --level N5` → batches in `.superpowers/explain/<youtube_id>-<n>.json`
  (≤ 60 lines each) + `INDEX.md`. Each entry: `key`, `ja`, `th` (the app's Thai), `prev` / `next` (neighbouring lines,
  for context), `words` (tokens as `surface/lemma/reading`).
- For each batch you write `<same name>.ex.json` = `[{ "key", "x", "g"?, "fix"? }]` — **every key, same order**.
- `node scripts/explain-tool.mjs import` → validates and merges into `src/data/explanations/<youtube_id>.json`.
  Rejected entries are printed; fix them and import again (until `0 rejected`).
- `node scripts/explain-tool.mjs check` → coverage + errors (must end `errors 0`).

## What to write per line (all explanation text in Thai; Japanese only when quoting words)
- **`x` (required, ≤ 260 chars):** what this line means *in this scene* and how it is said: who is talking to whom if
  clear from context, tone (สุภาพ / กันเอง / ห้วน / ประชด / ล้อเล่น…), implied meaning or what is left unsaid, and why
  the Thai subtitle is phrased the way it is if it isn't literal. Don't just repeat the Thai subtitle.
- **`g` (0–4 items):** grammar a learner wouldn't get from word meanings alone — conjugations (〜ちゃった, 〜てる,
  〜なきゃ), sentence enders (〜じゃん, 〜っけ, 〜かな, 〜わ), particles used in a non-obvious way, set phrases, casual
  contractions, keigo. Each: `f` = the exact text as it appears in the line (copy it), `b` = base form or pattern
  (≤ 24 chars, e.g. `〜てしまう`), `e` = Thai explanation (≤ 160 chars) of what it does *here*. Skip plain nouns and
  ordinary words — the word popup already covers them. A simple line may have `g` empty or omitted.
- **`fix` (auto subtitles only, optional):** clips whose captions came from YouTube speech recognition (INDEX.md
  column `ja source` = `auto`; mostly the anime) sometimes mis-hear words, e.g. `ひょっとせ悪まりんちゃん`. If the line
  is clearly wrong and the Thai + context make the real words certain, put the corrected Japanese in `fix`, and quote
  `g.f` from the corrected text. If you are not sure, leave the line as is — never guess. Never use `fix` on `manual`.

## Accuracy rules (the reason this is done offline)
1. Base every explanation on the Japanese line + prev/next + the Thai. If the Thai subtitle is wrong or loose, explain
   the Japanese correctly anyway (you may say "ซับไทยแปลแบบสรุป ความหมายตรงตัวคือ …").
2. When unsure about a grammar point, leave it out rather than inventing a rule. No made-up etymologies.
3. Use the clip's real context: a character's name, a running joke, what just happened (prev line).
4. Natural, clear Thai for a learner (no Japanese-academic jargon unless explained; "รูปสุภาพ" not "teineigo").
5. Song lyrics: skip the clip `SX_ViT4Ra7k` entirely (delete its batches before importing).

## Examples (shape and quality to aim for)
```json
[
  {"key":"0ycXiWFBCBE:331090",
   "x":"พิธีกรหันมาถามผู้ชมอย่างสุภาพว่า โปเกมอนตัวนี้ในภาษาของประเทศผู้ชมเรียกว่าอะไร ต่อจากที่เพิ่งบอกชื่อภาษาญี่ปุ่นไป",
   "g":[{"f":"では","b":"〜では","e":"で (ใน) + は (หัวข้อ) = 'ในภาษาของคุณนั้น…' ใช้ตั้งขอบเขตเพื่อเทียบกับภาษาญี่ปุ่นที่พูดก่อนหน้า"},
        {"f":"なんと呼びますか","b":"何と呼ぶ","e":"なんと = ว่าอะไร (と บอกชื่อที่ใช้เรียก) + 呼びます รูปสุภาพของ 呼ぶ → 'เรียกว่าอะไรคะ'"}]},
  {"key":"mTrFxmtFiig:<start_ms>",
   "x":"พูดแบบเดา ๆ กึ่งหวัง ๆ ว่ารินจังเวอร์ชันปีศาจน้อยอาจจะอยู่ที่นี่ด้วยหรือเปล่า เป็นภาษาพูดกันเอง",
   "fix":"ひょっとして小悪魔りんちゃんもいたりしない",
   "g":[{"f":"ひょっとして","b":"ひょっとして","e":"'หรือว่า… / เผื่อว่า…' ใช้นำการเดาที่ไม่ค่อยแน่ใจ"},
        {"f":"いたりしない","b":"〜たりしない","e":"ถามเชิงเดาแบบอ้อม ๆ 'จะ…อยู่ด้วยหรือเปล่านะ' นุ่มกว่าถามตรง ๆ ว่า いない？"}]}
]
```
(The second key is illustrative; use the real keys from the batch.)

## Workflow per level
1. `git switch main && git pull && git switch -c content/explanations` (first time only; later levels continue on the
   same branch).
2. `node scripts/explain-tool.mjs export --level N5`, then work through INDEX.md batch by batch: read the batch, write
   its `.ex.json`. Before writing, read the whole batch once so you understand the scene.
3. `node scripts/explain-tool.mjs import` until `0 rejected`; `node scripts/explain-tool.mjs check` → `errors 0`.
4. Self-review 20 random items of the level (pick with a script): is `x` right for the scene? Is every grammar point
   correct and about the quoted text? Is every `fix` certain? Correct the bad ones (edit and re-import).
5. Commit: stage `src/data/explanations/*.json` explicitly (and nothing else), message
   `feat(content): line explanations for N5 clips (<done>/<total> lines)`.
6. Next level. Re-running `export` after a level only lists what is still missing.

## Hard rules
- Only add/modify `src/data/explanations/*.json` and files under `.superpowers/`. Don't edit captions, glossary,
  `mockVideos.ts`, app code, `scripts/explain-tool.mjs`, versions, `public/`, `android/`.
- Never `git add -A`. Commit locally; no push, release, version bump or `npm run bundle`.
- No API keys in any file. Don't call external AI APIs to write the content — write it yourself.

## Report (`.superpowers/gemini/EXPLAIN-REPORT.md` + short printed summary)
Per level: clips, lines explained / eligible, number of `fix` entries, commit hash. The final `check` output.
10 sample items (key, ja, x, g) across levels, and any clips you skipped and why.
