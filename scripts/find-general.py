"""Scan Japanese YouTube channels for general/fun clips and podcasts that have a
MANUAL Japanese subtitle track, and print the accepted candidates as JSON lines.

Run from the repo root:
    python -X utf8 scripts/find-general.py general > scan-general.jsonl
    python -X utf8 scripts/find-general.py podcasts > scan-podcasts.jsonl

Uses the yt_dlp Python module (the yt-dlp exe is not used). Only channel listings
(extract_flat) and per-video info requests are made; nothing is downloaded.
Acceptance: public, playable_in_embed, not live/upcoming, not a Short, duration
within the category range, and a MANUAL track whose key starts with "ja".
Stops the whole run after a second HTTP 429 (one 60 s wait is allowed).
"""
import json
import sys
import time

import yt_dlp

CATEGORIES = {
    "general": {
        "channels": [
            "https://www.youtube.com/@HajimeSyacho/videos",
            "https://www.youtube.com/@HikakinGames/videos",
            "https://www.youtube.com/@SHAKAchannel/videos",
            "ytsearch60:日本 vlog 日常 旅行 日本語",
            "ytsearch60:日本 バラエティ 芸人 ドッキリ 日本語",
            "ytsearch60:日本 一人暮らし 日常 vlog 日本語",
        ],
        "min_s": 4 * 60,
        "max_s": 20 * 60,
        "target": 5,
    },
    "podcasts": {
        "channels": [
            "https://www.youtube.com/channel/UCLp9rnRAcrFSzsoXsjXYJYA/videos",
            "https://www.youtube.com/channel/UC8dWfySP_cKDMFj6aFfQbFA/videos",
            "https://www.youtube.com/@JapanesewithShun/videos",
            "https://www.youtube.com/@NihongoconTeppei/videos",
            "https://www.youtube.com/channel/UCaXIrZ5Ere4lC4cdPE_ujXA/videos",
        ],
        "min_s": 5 * 60,
        "max_s": 30 * 60,
        "target": 5,
    },
}

LIST_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "extract_flat": "in_playlist",
    "playlistend": 150,
}
INFO_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
}
INFO_SLEEP_S = 3
RETRY_WAIT_S = 60


class RateLimited(Exception):
    pass


def is_429(exc):
    return "429" in str(exc)


def list_channel(ydl, url):
    try:
        info = ydl.extract_info(url, download=False)
    except Exception as exc:  # noqa: BLE001
        print(f"# channel {url} failed: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
        return None, []
    entries = [e for e in (info.get("entries") or []) if e and e.get("id")]
    return info.get("title", url), entries


def video_info(ydl, vid):
    """Return info, retrying once after a 60 s wait on HTTP 429; a second 429 aborts."""
    url = f"https://www.youtube.com/watch?v={vid}"
    for attempt in (1, 2):
        try:
            return ydl.extract_info(url, download=False)
        except Exception as exc:  # noqa: BLE001
            if not is_429(exc):
                print(f"# {vid} info failed: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
                return None
            if attempt == 2:
                raise RateLimited(vid)
            print(f"# HTTP 429 on {vid}; waiting {RETRY_WAIT_S}s once", file=sys.stderr)
            time.sleep(RETRY_WAIT_S)
    return None


def manual_ja_key(info):
    subs = info.get("subtitles") or {}
    for key in sorted(subs):
        if key.startswith("ja") and subs[key]:
            return key
    return None


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in CATEGORIES:
        sys.exit("usage: find-general.py general|podcasts")
    cat = CATEGORIES[sys.argv[1]]
    accepted = []
    stats = {"channels": {}, "scanned_info": 0}

    try:
        with yt_dlp.YoutubeDL(LIST_OPTS) as ydl:
            for ch_url in cat["channels"]:
                title, entries = list_channel(ydl, ch_url)
                ch_stats = {"listed": len(entries), "in_range": 0, "info": 0,
                            "manual_ja": 0, "accepted": 0}
                stats["channels"][ch_url] = ch_stats
                if title is None:
                    continue
                # Flat duration filter first; unknown durations get an info request.
                plausible = []
                for e in entries:
                    dur = e.get("duration")
                    if e.get("live_status") in ("is_live", "is_upcoming", "post_live") or "/shorts/" in (e.get("url") or ""):
                        continue
                    if dur is not None and not (cat["min_s"] <= dur <= cat["max_s"]):
                        continue
                    plausible.append(e)
                ch_stats["in_range"] = len(plausible)

                with yt_dlp.YoutubeDL(INFO_OPTS) as ydl_info:
                    for e in plausible:
                        if len(accepted) >= cat["target"]:
                            break
                        time.sleep(INFO_SLEEP_S)
                        info = video_info(ydl_info, e["id"])
                        ch_stats["info"] += 1
                        stats["scanned_info"] += 1
                        if not info:
                            continue
                        dur = info.get("duration") or 0
                        if not (cat["min_s"] <= dur <= cat["max_s"]):
                            continue
                        if info.get("availability") not in (None, "public"):
                            continue
                        if info.get("live_status") not in (None, "not_live"):
                            continue
                        if info.get("playable_in_embed") is not True:
                            continue
                        key = manual_ja_key(info)
                        if not key:
                            continue
                        ch_stats["manual_ja"] += 1
                        other = sorted(k for k in (info.get("subtitles") or {}) if k != key)
                        row = {
                            "youtube_id": info["id"],
                            "channel": info.get("channel") or info.get("uploader") or title,
                            "title": info.get("title"),
                            "duration": dur,
                            "ja_key": key,
                            "other_manual": other,
                            "description": (info.get("description") or "")[:400],
                            "category_arg": sys.argv[1],
                        }
                        accepted.append(row)
                        ch_stats["accepted"] += 1
                        print(json.dumps(row, ensure_ascii=False), flush=True)
                    if len(accepted) >= cat["target"]:
                        break
    except RateLimited as exc:
        print(f"# STOPPED: second HTTP 429 at {exc}", file=sys.stderr)

    print("# stats " + json.dumps(stats, ensure_ascii=False), file=sys.stderr)


if __name__ == "__main__":
    main()
