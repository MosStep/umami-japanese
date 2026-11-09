"""Fetch real timed Japanese / Thai captions from YouTube and write them to
src/data/captions/<youtube_id>.json for build-time import.

Run from the repo root:  python scripts/fetch-captions.py
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
OUT_DIR = ROOT / "src" / "data" / "captions"
SLEEP_S = 2

YDL_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
}


def get_youtube_ids():
    text = MOCK_FILE.read_text(encoding="utf-8")
    seen = []
    for vid in re.findall(r'"youtube_id": "([^"]+)"', text):
        if vid not in seen:
            seen.append(vid)
    return seen


def pick_track(info, lang, auto_langs):
    """Return (kind, formats) for the best track, manual first, then auto."""
    manual = (info.get("subtitles") or {}).get(lang)
    if manual:
        return "manual", manual
    auto = info.get("automatic_captions") or {}
    for code in auto_langs:
        if auto.get(code):
            return "auto", auto[code]
    return "none", None


def fetch_json3(ydl, formats):
    fmt = next((f for f in formats if f.get("ext") == "json3" and f.get("url")), None)
    if fmt is None:
        return None
    raw = ydl.urlopen(fmt["url"]).read().decode("utf-8")
    return json.loads(raw)


def parse_events(data):
    """Turn json3 events into [{start, end, text}] with non-empty text."""
    events = data.get("events") or []
    out = []
    for i, ev in enumerate(events):
        if "segs" not in ev:
            continue
        text = "".join(seg.get("utf8", "") for seg in ev["segs"])
        text = re.sub(r"\s+", " ", text.replace("\n", " ")).strip()
        if not text:
            continue
        start = int(ev.get("tStartMs", 0))
        dur = ev.get("dDurationMs")
        if dur is None:
            # Fall back to the next event's start, or a 2 s default.
            nxt = next((e for e in events[i + 1:] if "tStartMs" in e), None)
            dur = (nxt["tStartMs"] - start) if nxt else 2000
        end = start + int(dur)
        out.append({"start": start, "end": max(end, start + 1), "text": text})
    return out


def overlap(a, b):
    return min(a["end"], b["end"]) - max(a["start"], b["start"])


def attach(primary, other):
    """For each primary event, pick the other-language event with max overlap."""
    result = []
    for p in primary:
        best, best_ov = None, 0
        for o in other:
            ov = overlap(p, o)
            if ov > best_ov:
                best, best_ov = o, ov
        result.append(best["text"] if best else None)
    return result


def build_for_video(ydl, youtube_id):
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    info = ydl.extract_info(url, download=False)

    ja_kind, ja_formats = pick_track(info, "ja", ["ja", "ja-orig"])
    th_kind, th_formats = pick_track(info, "th", ["th"])

    ja_events = []
    th_events = []
    if ja_formats:
        data = fetch_json3(ydl, ja_formats)
        if data is None:
            ja_kind = "none"
        else:
            ja_events = parse_events(data)
    if th_formats:
        data = fetch_json3(ydl, th_formats)
        if data is None:
            th_kind = "none"
        else:
            th_events = parse_events(data)

    if not ja_events and not th_events:
        return None, {"ja": "none", "th": "none"}

    if ja_events:
        primary, primary_key = ja_events, "ja"
        other, other_key = th_events, "th"
    else:
        primary, primary_key = th_events, "th"
        other, other_key = [], "ja"

    lines = []
    attached = attach(primary, other) if other else [None] * len(primary)
    for p, att in zip(primary, attached):
        line = {
            "start_ms": p["start"],
            "end_ms": p["end"],
            "ja": None,
            "th": None,
        }
        line[primary_key] = p["text"]
        if other:
            line[other_key] = att
        lines.append(line)

    # Lines that come only from the non-primary track when primary was ja:
    # keep them as th-only lines so no Thai caption is dropped.
    if ja_events and th_events:
        covered = [False] * len(th_events)
        for i, t in enumerate(th_events):
            for p in ja_events:
                if overlap(p, t) > 0:
                    covered[i] = True
                    break
        for i, t in enumerate(th_events):
            if not covered[i]:
                lines.append({"start_ms": t["start"], "end_ms": t["end"], "ja": None, "th": t["text"]})
        lines.sort(key=lambda l: l["start_ms"])

    record = {
        "youtube_id": youtube_id,
        "source": {"ja": ja_kind, "th": th_kind},
        "lines": lines,
    }
    return record, {"ja": ja_kind, "th": th_kind}


def main():
    ids = get_youtube_ids()
    print(f"Found {len(ids)} unique youtube_ids in {MOCK_FILE.name}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    summary = []

    with yt_dlp.YoutubeDL(YDL_OPTS) as ydl:
        for n, yid in enumerate(ids):
            try:
                record, sources = build_for_video(ydl, yid)
            except Exception as exc:  # noqa: BLE001 - continue on per-video failure
                print(f"[{yid}] FAILED: {exc}", file=sys.stderr)
                summary.append((yid, "error", "error", 0, str(exc)[:80]))
                if n < len(ids) - 1:
                    time.sleep(SLEEP_S)
                continue

            out_file = OUT_DIR / f"{yid}.json"
            if record is None:
                print(f"[{yid}] no ja or th track; no file written (MOCK fallback)")
                summary.append((yid, sources["ja"], sources["th"], 0, ""))
            else:
                out_file.write_text(
                    json.dumps(record, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
                print(f"[{yid}] ja={sources['ja']} th={sources['th']} lines={len(record['lines'])}")
                summary.append((yid, sources["ja"], sources["th"], len(record["lines"]), ""))

            if n < len(ids) - 1:
                time.sleep(SLEEP_S)

    print("\n| youtube_id | ja | th | lines | note |")
    print("|---|---|---|---|---|")
    for yid, ja, th, count, note in summary:
        print(f"| {yid} | {ja} | {th} | {count} | {note} |")


if __name__ == "__main__":
    main()
