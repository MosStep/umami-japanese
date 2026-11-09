"""Scan Japanese YouTube channels for general/fun clips and podcasts that have a
MANUAL Japanese subtitle track (or auto Japanese for YouTuber-variety), and print
the accepted candidates as JSON lines.

Run from the repo root:
    python -X utf8 scripts/find-general.py <category>

Uses the yt_dlp Python module (the yt-dlp exe is not used). Only channel listings
(extract_flat) and per-video info requests are made; nothing is downloaded.
Acceptance: public, playable_in_embed, not live/upcoming, not a Short, duration
within the category range, and a MANUAL track whose key starts with "ja" (or auto
ja-orig/ja when allow_auto is True).
Stops the whole run after a second HTTP 429 (one 60 s wait is allowed).
"""
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp

ROOT = Path(__file__).resolve().parent.parent
MOCK_FILE = ROOT / "src" / "data" / "mockVideos.ts"

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
    "n5_easy": {
        "channels": [
            "https://www.youtube.com/@cijapanese/videos",
            "https://www.youtube.com/@JapanesewithShun/videos",
            "https://www.youtube.com/@HaruNoNihongo/videos",
            "https://www.youtube.com/@Akane-JapaneseClass/videos",
            "https://www.youtube.com/@SpeakJapaneseNaturally/videos",
            "ytsearch50:やさしい日本語 N5 会話 リスニング 字幕",
            "ytsearch50:Comprehensible Japanese beginner N5",
            "ytsearch50:JLPT N5 日本語 日常 会話 Vlog",
        ],
        "min_s": 3 * 60,
        "max_s": 25 * 60,
        "target": 12,
        "max_per_channel": 3,
    },
    "n4_learner": {
        "channels": [
            "https://www.youtube.com/@Akane-JapaneseClass/videos",
            "https://www.youtube.com/@SayuriSaying/videos",
            "https://www.youtube.com/@MikuRealJapanese/videos",
            "https://www.youtube.com/@BiteSizeJapanesePodcast/videos",
            "https://www.youtube.com/@YUYUNIHONGOPODCAST/videos",
            "ytsearch50:JLPT N4 日本語 会話 ポッドキャスト Vlog",
            "ytsearch50:日本語 N4 カフェ 買い物 料理 Vlog",
        ],
        "min_s": 3 * 60,
        "max_s": 25 * 60,
        "target": 12,
        "max_per_channel": 3,
    },
    "youtuber": {
        "channels": [
            "https://www.youtube.com/@HajimeSyacho/videos",
            "https://www.youtube.com/@HikakinTV/videos",
            "https://www.youtube.com/@FischersTV/videos",
            "https://www.youtube.com/@TokaiOnAir/videos",
            "https://www.youtube.com/@mizutamaribond/videos",
            "https://www.youtube.com/@SHAKAchannel/videos",
            "https://www.youtube.com/@kimagurecook/videos",
            "https://www.youtube.com/@sushi_ramen/videos",
        ],
        "min_s": 3 * 60,
        "max_s": 22 * 60,
        "target": 12,
        "allow_auto": True,
        "max_per_channel": 2,
    },
    "vlog": {
        "channels": [
            "ytsearch50:日本 旅行 Vlog 一人旅 字幕",
            "ytsearch50:東京 カフェ巡り 日常 Vlog 字幕",
            "ytsearch50:京都 旅行 Vlog 日本語字幕",
            "ytsearch50:社会人 休日 ルーティン Vlog 日本語",
        ],
        "min_s": 3 * 60,
        "max_s": 25 * 60,
        "target": 10,
        "max_per_channel": 2,
    },
    "food": {
        "channels": [
            "https://www.youtube.com/@Bazurecipe/videos",
            "https://www.youtube.com/@kohkentetsu/videos",
            "https://www.youtube.com/@GenkiLabo/videos",
            "ytsearch50:日本 屋台 グルメ 食べ歩き 字幕",
            "ytsearch50:簡単 料理 レシピ 日本語字幕",
            "ytsearch50:東京 ラーメン グルメ レビュー 字幕",
        ],
        "min_s": 3 * 60,
        "max_s": 25 * 60,
        "target": 8,
        "max_per_channel": 2,
    },
    "news": {
        "channels": [
            "https://www.youtube.com/@ANNnewsCH/videos",
            "https://www.youtube.com/@tbsnewsdig/videos",
            "https://www.youtube.com/@ntv_news/videos",
            "https://www.youtube.com/@FNNnewsCH/videos",
            "ytsearch50:ニュース 解説 日本経済 社会問題 字幕",
            "ytsearch50:やさしい日本語 ニュース 解説",
        ],
        "min_s": 3 * 60,
        "max_s": 30 * 60,
        "target": 8,
        "max_per_channel": 2,
    },
    "docs": {
        "channels": [
            "https://www.youtube.com/@PIVOT00/videos",
            "https://www.youtube.com/@NewsPicks/videos",
            "https://www.youtube.com/@ReHacQ/videos",
            "https://www.youtube.com/@nakataatsuhiko/videos",
            "ytsearch50:ドキュメンタリー インタビュー 日本 職人 字幕",
            "ytsearch50:日本 文化 解説 歴史 伝統 字幕",
            "ytsearch50:ビジネス IT テクノロジー 対談 講演 字幕",
        ],
        "min_s": 4 * 60,
        "max_s": 30 * 60,
        "target": 10,
        "max_per_channel": 2,
    },
    "gaming": {
        "channels": [
            "https://www.youtube.com/@HikakinGames/videos",
            "https://www.youtube.com/@k4sen/videos",
            "https://www.youtube.com/@kiyo_saiore/videos",
            "https://www.youtube.com/@ushizawa/videos",
            "ytsearch50:ゲーム実況 日本語字幕 マイクラ ポケモン",
            "ytsearch50:インディーゲーム 実況 レビュー 日本語字幕",
        ],
        "min_s": 3 * 60,
        "max_s": 25 * 60,
        "target": 8,
        "max_per_channel": 2,
    },
    "n1_talks": {
        "channels": [
            "ytsearch50:TEDx Tokyo 日本語 講演 字幕",
            "ytsearch50:TEDx Kyoto 日本語 講演 字幕",
            "ytsearch50:日本 経済 ニュース 解説 字幕",
            "ytsearch50:ビジネス テクノロジー 解説 日本語字幕",
        ],
        "min_s": 4 * 60,
        "max_s": 25 * 60,
        "target": 5,
        "max_per_channel": 2,
    },
}

LIST_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "extract_flat": "in_playlist",
    "playlistend": 60,
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


def known_ids():
    if not MOCK_FILE.exists():
        return set()
    return set(re.findall(r'"youtube_id": "([^"]+)"', MOCK_FILE.read_text(encoding="utf-8")))


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


def auto_ja_key(info):
    auto = info.get("automatic_captions") or {}
    for pref in ("ja-orig", "ja"):
        if auto.get(pref):
            return pref
    for key in sorted(auto):
        if key.startswith("ja") and auto[key]:
            return key
    return None


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in CATEGORIES:
        sys.exit("usage: find-general.py " + "|".join(CATEGORIES))
    cat = CATEGORIES[sys.argv[1]]
    allow_auto = bool(cat.get("allow_auto"))
    max_per_ch = cat.get("max_per_channel", 3)
    seen_ids = known_ids()
    accepted = []
    stats = {"channels": {}, "scanned_info": 0}

    try:
        with yt_dlp.YoutubeDL(LIST_OPTS) as ydl:
            for ch_url in cat["channels"]:
                title, entries = list_channel(ydl, ch_url)
                ch_stats = {"listed": len(entries), "in_range": 0, "info": 0,
                            "manual_ja": 0, "auto_ja": 0, "accepted": 0}
                stats["channels"][ch_url] = ch_stats
                if title is None:
                    continue
                # Flat duration filter first; unknown durations get an info request.
                plausible = []
                for e in entries:
                    if e["id"] in seen_ids:
                        continue
                    dur = e.get("duration")
                    if e.get("live_status") in ("is_live", "is_upcoming", "post_live") or "/shorts/" in (e.get("url") or ""):
                        continue
                    if dur is not None and not (cat["min_s"] <= dur <= cat["max_s"]):
                        continue
                    plausible.append(e)
                ch_stats["in_range"] = len(plausible)

                with yt_dlp.YoutubeDL(INFO_OPTS) as ydl_info:
                    ch_accepted = 0
                    for e in plausible[:20]:  # Cap per-channel probes so we move across channels quickly
                        if len(accepted) >= cat["target"] or ch_accepted >= max_per_ch:
                            break
                        if e["id"] in seen_ids:
                            continue
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
                        ja_kind = "manual"
                        if key:
                            ch_stats["manual_ja"] += 1
                        elif allow_auto:
                            key = auto_ja_key(info)
                            if key:
                                ja_kind = "auto"
                                ch_stats["auto_ja"] += 1
                        if not key:
                            continue
                        other = sorted(k for k in (info.get("subtitles") or {}) if k != key)
                        row = {
                            "youtube_id": info["id"],
                            "channel": info.get("channel") or info.get("uploader") or title,
                            "title": info.get("title"),
                            "duration": dur,
                            "ja_key": key,
                            "ja_kind": ja_kind,
                            "other_manual": other,
                            "description": (info.get("description") or "")[:400],
                            "category_arg": sys.argv[1],
                        }
                        accepted.append(row)
                        seen_ids.add(info["id"])
                        ch_stats["accepted"] += 1
                        ch_accepted += 1
                        print(json.dumps(row, ensure_ascii=False), flush=True)
                    if len(accepted) >= cat["target"]:
                        break
    except RateLimited as exc:
        print(f"# STOPPED: second HTTP 429 at {exc}", file=sys.stderr)

    print("# stats " + json.dumps(stats, ensure_ascii=False), file=sys.stderr)


if __name__ == "__main__":
    main()
