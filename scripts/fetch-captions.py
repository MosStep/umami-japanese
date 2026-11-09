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
VIDEO_SLEEP_S = 2
TRACK_SLEEP_S = 1
RETRY_SLEEP_S = 15

YDL_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
}

# A segment that is only bracket tags, e.g. [音楽] [拍手] （笑） (笑)
INLINE_TAG = re.compile(r"\[[^\[\]]{1,12}\]")
TAG_ONLY = re.compile(r"^(\s|\[[^\]]*\]|［[^］]*］|（[^）]*）|\([^)]*\))+$")


def get_youtube_ids():
    text = MOCK_FILE.read_text(encoding="utf-8")
    seen = []
    for vid in re.findall(r'"youtube_id": "([^"]+)"', text):
        if vid not in seen:
            seen.append(vid)
    return seen


def clean_text(raw):
    """Return cleaned caption text, or None if nothing speakable is left."""
    raw = raw.replace("\n", " ")
    if TAG_ONLY.match(raw):
        return None
    raw = INLINE_TAG.sub(" ", raw)  # sound tags inside a segment, e.g. 見上げ[音楽]た
    text = re.sub(r"\s+", " ", raw).strip()
    if not re.search(r"[^\W_]", text):  # punctuation / whitespace only
        return None
    return text


def pick_track(info, lang_prefix, auto_prefixes):
    """Return (kind, formats). Manual first (any key starting with lang_prefix),
    then auto (first matching prefix list, then any key starting with lang_prefix)."""
    def find(table, preferred):
        table = table or {}
        for key in preferred:
            if table.get(key):
                return table[key]
        for key in sorted(table):
            if key.startswith(lang_prefix) and table[key]:
                return table[key]
        return None

    manual = find(info.get("subtitles"), [lang_prefix])
    if manual:
        return "manual", manual
    auto = find(info.get("automatic_captions"), auto_prefixes)
    if auto:
        return "auto", auto
    return "none", None


def fetch_json3(ydl, formats):
    fmt = next((f for f in formats if f.get("ext") == "json3" and f.get("url")), None)
    if fmt is None:
        return None
    raw = ydl.urlopen(fmt["url"]).read().decode("utf-8")
    return json.loads(raw)


def parse_events(data):
    """json3 events -> [{start, end, text}] with cleaned, non-empty text."""
    events = data.get("events") or []
    out = []
    for i, ev in enumerate(events):
        if "segs" not in ev:
            continue
        text = clean_text("".join(seg.get("utf8", "") for seg in ev["segs"]))
        if not text:
            continue
        start = int(ev.get("tStartMs", 0))
        dur = ev.get("dDurationMs")
        if dur is None:
            nxt = next((e for e in events[i + 1:] if "tStartMs" in e), None)
            dur = (nxt["tStartMs"] - start) if nxt else 2000
        out.append({"start": start, "end": max(start + int(dur), start + 1), "text": text})
    return out


def overlap(a, b):
    return min(a["end"], b["end"]) - max(a["start"], b["start"])


def drop_adjacent_dups(events, window_ms=3000):
    """Rolling auto captions repeat the same text in back-to-back events; merge them."""
    out = []
    for e in events:
        if out and e["text"] == out[-1]["text"] and e["start"] - out[-1]["end"] <= window_ms:
            out[-1]["end"] = max(out[-1]["end"], e["end"])
            continue
        out.append(e)
    return out


def join_rolling(parts):
    """Join caption fragments, removing rolling-caption repetition: a fragment
    already present is skipped, and an overlapping prefix/suffix is not repeated."""
    acc = ""
    for t in parts:
        if not t or t in acc:
            continue
        added = False
        for k in range(min(len(acc), len(t)), 1, -1):
            if acc.endswith(t[:k]):
                acc += t[k:]
                added = True
                break
        if not added:
            acc = acc + (" " if acc and t[0].isascii() and acc[-1].isascii() else "") + t
    return acc


def merge_th_fragments(events, gap_ms=1000):
    """Merge build-up Thai fragments: while the next event starts within gap_ms of the
    previous one and its text contains the previous text, drop the previous event and
    extend the next event's start back to it. Returns (events, merged_count)."""
    out, merged = [], 0
    for n in events:
        while out and n["start"] - out[-1]["end"] <= gap_ms and out[-1]["text"] in n["text"]:
            prev = out.pop()
            n["start"] = prev["start"]
            merged += 1
        out.append(n)
    return out, merged


def build_lines(ja_events, th_events, ja_kind, th_kind):
    """Pair ja and th events into lines. Returns list of {start_ms, end_ms, ja, th}."""
    if th_kind == "manual" and ja_kind == "auto" and th_events and ja_events:
        # Thai (manual) is the primary timeline. Each ja auto event attaches to exactly
        # one Thai line: the one whose [start-300, end+300] window contains its midpoint,
        # preferring a line whose span contains the midpoint, then the nearest centre.
        # Unattached ja events become ja-only lines so no Japanese is lost.
        lines = [{"start": t["start"], "end": t["end"], "ja_parts": [], "th": t["text"]}
                 for t in th_events]
        ja_only = []
        for j in ja_events:
            m = (j["start"] + j["end"]) / 2
            best, best_key = None, None
            for ln in lines:
                if not (ln["start"] - 300 <= m <= ln["end"] + 300):
                    continue
                inside = 0 if ln["start"] <= m < ln["end"] else 1
                key = (inside, abs(m - (ln["start"] + ln["end"]) / 2))
                if best_key is None or key < best_key:
                    best, best_key = ln, key
            if best is not None:
                best["ja_parts"].append(j)
            else:
                ja_only.append(j)
        attached = sum(len(ln["ja_parts"]) for ln in lines)
        out = []
        for ln in lines:
            out.append({
                "start_ms": ln["start"], "end_ms": ln["end"],
                "ja": join_rolling([j["text"] for j in ln["ja_parts"]]) or None,
                "th": ln["th"],
            })
        for j in ja_only:
            out.append({"start_ms": j["start"], "end_ms": j["end"], "ja": j["text"], "th": None})
        out.sort(key=lambda l: l["start_ms"])
        build_lines.counts = {"ja_total": len(ja_events), "attached": attached, "ja_only": len(ja_only)}
        return out

    # Japanese is primary (ja manual, or both auto, or ja only). Each Thai event
    # attaches to exactly one Japanese line (max overlap); unattached Thai
    # events become Thai-only lines so nothing is dropped.
    if not ja_events:
        return [{"start_ms": t["start"], "end_ms": t["end"], "ja": None, "th": t["text"]}
                for t in th_events]
    lines = [{"start": j["start"], "end": j["end"], "ja": j["text"], "th_parts": []}
             for j in ja_events]
    leftover_th = []
    for t in th_events:
        best, best_ov = None, 0
        for ln in lines:
            ov = min(ln["end"], t["end"]) - max(ln["start"], t["start"])
            if ov > best_ov:
                best, best_ov = ln, ov
        if best is not None:
            best["th_parts"].append(t["text"])
        else:
            leftover_th.append(t)
    out = [{"start_ms": ln["start"], "end_ms": ln["end"], "ja": ln["ja"],
            "th": join_rolling(ln["th_parts"]) or None} for ln in lines]
    for t in leftover_th:
        out.append({"start_ms": t["start"], "end_ms": t["end"], "ja": None, "th": t["text"]})
    out.sort(key=lambda l: l["start_ms"])
    return out


def build_for_video(ydl, youtube_id):
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    info = ydl.extract_info(url, download=False)

    ja_kind, ja_formats = pick_track(info, "ja", ["ja", "ja-orig"])
    th_kind, th_formats = pick_track(info, "th", ["th"])

    ja_events, th_events = [], []
    if ja_formats:
        data = fetch_json3(ydl, ja_formats)
        if data is None:
            ja_kind = "none"
        else:
            ja_events = parse_events(data)
    if ja_formats and th_formats:
        time.sleep(TRACK_SLEEP_S)
    if th_formats:
        data = fetch_json3(ydl, th_formats)
        if data is None:
            th_kind = "none"
        else:
            th_events = parse_events(data)

    if not ja_events and not th_events:
        return None, {"ja": "none", "th": "none"}

    ja_events = drop_adjacent_dups(sorted(ja_events, key=lambda e: e["start"]))
    th_events = drop_adjacent_dups(sorted(th_events, key=lambda e: e["start"]))
    th_events, merged = merge_th_fragments(th_events)
    build_lines.counts = {}
    lines = build_lines(ja_events, th_events, ja_kind, th_kind)
    counts = dict(build_lines.counts)
    counts["th_fragments_merged"] = merged
    record = {
        "youtube_id": youtube_id,
        "source": {"ja": ja_kind, "th": th_kind},
        "lines": lines,
    }
    return record, {"ja": ja_kind, "th": th_kind, **counts}


def stats(record):
    lines = record["lines"]
    th_values = [l["th"] for l in lines if l["th"]]
    dup_th = 0
    for prev, cur in zip(lines, lines[1:]):
        if cur["th"] and cur["th"] == prev["th"] and cur["start_ms"] - prev["end_ms"] <= 3000:
            dup_th += 1
    return {
        "lines": len(lines),
        "ja_filled": sum(1 for l in lines if l["ja"]),
        "th_filled": len(th_values),
        "dup_th": dup_th,
    }


def fetch_with_retry(ydl, youtube_id):
    try:
        return build_for_video(ydl, youtube_id)
    except Exception as exc:  # noqa: BLE001
        if "429" not in str(exc):
            raise
        print(f"[{youtube_id}] HTTP 429, retrying once after {RETRY_SLEEP_S}s", file=sys.stderr)
        time.sleep(RETRY_SLEEP_S)
        return build_for_video(ydl, youtube_id)


def main():
    ids = get_youtube_ids()
    if len(sys.argv) > 1:
        ids = [i for i in ids if i in sys.argv[1:]]
    print(f"Found {len(ids)} unique youtube_ids in {MOCK_FILE.name}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []

    with yt_dlp.YoutubeDL(YDL_OPTS) as ydl:
        for n, yid in enumerate(ids):
            try:
                record, sources = fetch_with_retry(ydl, yid)
            except Exception as exc:  # noqa: BLE001 - continue on per-video failure
                msg = str(exc).splitlines()[0][:90]
                print(f"[{yid}] FAILED: {msg}", file=sys.stderr)
                rows.append((yid, "error", "error", None, msg))
            else:
                if record is None or not record["lines"]:
                    print(f"[{yid}] no ja or th track; no file written (MOCK fallback)")
                    rows.append((yid, sources["ja"], sources["th"], None, "no captions"))
                else:
                    (OUT_DIR / f"{yid}.json").write_text(
                        json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                    s = stats(record)
                    print(f"[{yid}] ja={sources['ja']} th={sources['th']} {s}")
                    extra = {k: v for k, v in sources.items() if k not in ("ja", "th")}
                    if extra:
                        print(f"[{yid}] pairing counts: {extra}")
                    rows.append((yid, sources["ja"], sources["th"], s, ""))
            if n < len(ids) - 1:
                time.sleep(VIDEO_SLEEP_S)

    print("\n| youtube_id | ja | th | lines | ja_filled | th_filled | dup_th | note |")
    print("|---|---|---|---|---|---|---|---|")
    for yid, ja, th, s, note in rows:
        if s:
            print(f"| {yid} | {ja} | {th} | {s['lines']} | {s['ja_filled']} | {s['th_filled']} | {s['dup_th']} | |")
        else:
            print(f"| {yid} | {ja} | {th} | 0 | 0 | 0 | 0 | {note} |")


if __name__ == "__main__":
    main()
