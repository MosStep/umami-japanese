"""Pick new full Ani-One Asia episodes for the app and print a table.

Lists the channel's newest uploads with extract_flat, keeps plausible full-episode
titles (15-30 min), then fetches full info (3 s apart, to avoid HTTP 429) until 8
qualifying episodes across at least 4 series are found. A candidate qualifies only if:
public, playable_in_embed, not live, duration 15-30 min, a MANUAL `th` subtitle track
and a `ja` track (manual or auto), and it is not already a video record in the app.

Run from the repo root:  python -X utf8 scripts/find-anione.py
Uses the yt_dlp Python module (the yt-dlp exe is not used).
"""
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp

ROOT = Path(__file__).resolve().parent.parent
MOCK_FILE = ROOT / "src" / "data" / "mockVideos.ts"
CHANNEL = "https://www.youtube.com/@AniOneAsia/videos"
TARGET = 8
MIN_SERIES = 4
MIN_S, MAX_S = 15 * 60, 30 * 60
VIDEO_SLEEP_S = 3
RETRY_SLEEP_S = 60

FULL_EP = re.compile(r"(EP\s*\d+|ตอนที่|#\s*\d+|Episode)", re.IGNORECASE)
SKIP_TITLE = re.compile(r"\b(PV|Highlight)\b", re.IGNORECASE)
SERIES = re.compile(r"《([^》]+)》")
EP_NUM = re.compile(r"#\s*(\d+)")


def app_youtube_ids():
    return set(re.findall(r'"youtube_id": "([^"]+)"', MOCK_FILE.read_text(encoding="utf-8")))


def series_of(title):
    m = SERIES.search(title)
    return m.group(1).strip() if m else title.split("#")[0].strip()


def ep_of(title):
    m = EP_NUM.search(title)
    return int(m.group(1)) if m else 0


def list_candidates(ydl, known):
    info = ydl.extract_info(CHANNEL, download=False)
    out = []
    for e in info.get("entries") or []:
        title = e.get("title") or ""
        dur = e.get("duration") or 0
        if e.get("id") in known or not FULL_EP.search(title) or SKIP_TITLE.search(title):
            continue
        if not (MIN_S <= dur <= MAX_S):
            continue
        out.append({"id": e["id"], "title": title, "series": series_of(title), "ep": ep_of(title)})
    # Episode 1 of each series first, then episode 2, and so on.
    out.sort(key=lambda c: (c["ep"], c["series"]))
    return out


def check(ydl, cand):
    info = ydl.extract_info(f"https://www.youtube.com/watch?v={cand['id']}", download=False)
    subs = info.get("subtitles") or {}
    auto = info.get("automatic_captions") or {}
    reasons = []
    if info.get("availability") not in (None, "public"):
        reasons.append(f"availability={info.get('availability')}")
    if info.get("playable_in_embed") is not True:
        reasons.append("not embeddable")
    if info.get("is_live") or info.get("was_live"):
        reasons.append("live")
    dur = info.get("duration") or 0
    if not (MIN_S <= dur <= MAX_S):
        reasons.append(f"duration {dur}s")
    th_manual = bool(subs.get("th"))
    ja_manual = bool(subs.get("ja"))
    ja_auto = bool(auto.get("ja"))
    if not th_manual:
        reasons.append("no manual th")
    if not (ja_manual or ja_auto):
        reasons.append("no ja track")
    row = {
        "youtube_id": cand["id"],
        "title": info.get("title") or cand["title"],
        "series": cand["series"],
        "ep": cand["ep"],
        "duration": dur,
        "ja": "manual" if ja_manual else ("auto" if ja_auto else "none"),
        "th": "manual" if th_manual else "none",
    }
    return (not reasons), row, reasons


def main():
    known = app_youtube_ids()
    chosen, series_seen, rejected = [], set(), []
    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "noplaylist": True,
            "extract_flat": "in_playlist", "playlistend": 200}
    with yt_dlp.YoutubeDL(opts) as ydl:
        cands = list_candidates(ydl, known)
        print(f"{len(cands)} plausible full-episode candidates in newest 200 uploads", file=sys.stderr)
    opts.pop("extract_flat")
    opts.pop("playlistend")
    with yt_dlp.YoutubeDL(opts) as ydl:
        for n, cand in enumerate(cands):
            if len(chosen) >= TARGET and len(series_seen) >= MIN_SERIES:
                break
            try:
                ok, row, reasons = check(ydl, cand)
            except Exception as exc:  # noqa: BLE001
                if "429" in str(exc):
                    print(f"[{cand['id']}] HTTP 429, waiting {RETRY_SLEEP_S}s", file=sys.stderr)
                    time.sleep(RETRY_SLEEP_S)
                    try:
                        ok, row, reasons = check(ydl, cand)
                    except Exception as exc2:  # noqa: BLE001
                        print(f"[{cand['id']}] still blocked, stopping: {str(exc2)[:120]}", file=sys.stderr)
                        break
                else:
                    rejected.append((cand["id"], str(exc).splitlines()[0][:100]))
                    continue
            if ok:
                chosen.append(row)
                series_seen.add(row["series"])
                print(f"ACCEPT {row['youtube_id']} ep{row['ep']} {row['series']} {row['duration']}s", file=sys.stderr)
            else:
                rejected.append((cand["id"], "; ".join(reasons)))
                print(f"reject {cand['id']} {cand['series']} ep{cand['ep']}: {'; '.join(reasons)}", file=sys.stderr)
            if n < len(cands) - 1:
                time.sleep(VIDEO_SLEEP_S)

    print("\n| youtube_id | series | ep | title | duration_s | ja | th |")
    print("|---|---|---|---|---|---|---|")
    for r in chosen:
        print(f"| {r['youtube_id']} | {r['series']} | {r['ep']} | {r['title']} | {r['duration']} | {r['ja']} | {r['th']} |")
    print(f"\nseries: {len(series_seen)}, accepted: {len(chosen)}")
    print(json.dumps(chosen, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
