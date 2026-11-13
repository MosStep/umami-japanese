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
    "n5_variety": {
        "channels": [
            # 1. Daily-life / slow vlog for learners (Vlogs)
            "ytsearch40:やさしい日本語 vlog",
            "ytsearch40:slow Japanese vlog N5",
            "ytsearch40:Comprehensible Japanese beginner",
            # 2. Simple stories / folk tales / picture books read slowly (Podcasts)
            "ytsearch40:えほん 読み聞かせ 日本語",
            "ytsearch40:easy Japanese story N5",
            # 3. Kids' / family content with clear speech (Vlogs)
            "ytsearch30:子ども向け 日本語 おはなし アニメ 字幕",
            "ytsearch30:こども にほんご えほん 字幕",
            # 4. Food / cooking explained simply (Street Food)
            "ytsearch30:簡単 料理 やさしい日本語",
            "ytsearch30:Japanese cooking easy Japanese",
            "ytsearch30:やさしい日本語 料理 レシピ",
            # 5. Situational conversation (shop, restaurant, station, hotel) (Podcasts)
            "ytsearch30:コンビニ 会話 初級 日本語",
            "ytsearch30:レストラン 会話 日本語 初級",
            "ytsearch30:ホテル 会話 日本語 初級",
            "ytsearch30:restaurant Japanese conversation beginner",
            # 6. Self-introduction / hobbies / daily routine talk (Vlogs)
            "ytsearch30:自己紹介 やさしい日本語",
            "ytsearch30:my daily routine Japanese easy",
            # 7. Gaming / play commentary spoken slowly (Gaming)
            "ytsearch30:やさしい日本語 ゲーム実況",
            "ytsearch30:Japanese learning gameplay N5",
            "ytsearch30:日本語学習 ゲーム実況 初心者",
            "ytsearch30:ゲーム実況 初級 日本語",
        ],
        "min_s": 3 * 60,
        "max_s": 20 * 60,
        "target": 45,
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
    "creators": {
        # Big entertainment YouTubers and VTubers (auto Japanese allowed; songs and streams are skipped by title).
        "channels": [
            "https://www.youtube.com/@HikakinTV/videos",
            "https://www.youtube.com/@SeikinTV/videos",
            "https://www.youtube.com/@FischersTV/videos",
            "https://www.youtube.com/@TokaiOnAir/videos",
            "https://www.youtube.com/@mizutamaribond/videos",
            "https://www.youtube.com/@sushi_ramen/videos",
            "https://www.youtube.com/@comdot/videos",
            "https://www.youtube.com/@QuizKnock/videos",
            "https://www.youtube.com/@HikakinGames/videos",
            "https://www.youtube.com/@heikinjyukenwotoru/videos",
            "https://www.youtube.com/@kazuch/videos",
            "https://www.youtube.com/@yuka0115/videos",
            "https://www.youtube.com/@bayashitv/videos",
            "https://www.youtube.com/@sekainoyomugi/videos",
            "https://www.youtube.com/@kiyoisgod/videos",
            "https://www.youtube.com/@pockysweets/videos",
            "https://www.youtube.com/@Raphael-tv/videos",
            "https://www.youtube.com/@hololive/videos",
            "https://www.youtube.com/@usadapekora/videos",
            "https://www.youtube.com/@SakuraMiko/videos",
            "https://www.youtube.com/@HoushouMarine/videos",
            "https://www.youtube.com/@ShirakamiFubuki/videos",
            "https://www.youtube.com/@InugamiKorone/videos",
            "https://www.youtube.com/@OozoraSubaru/videos",
            "https://www.youtube.com/@NekomataOkayu/videos",
            "https://www.youtube.com/@TokinoSora/videos",
            "https://www.youtube.com/@ShiroganeNoel/videos",
            "https://www.youtube.com/@nijisanji/videos",
            "https://www.youtube.com/@TsukinoMito/videos",
            "https://www.youtube.com/@ui_shig/videos",
            "https://www.youtube.com/@aichannel/videos",
            "https://www.youtube.com/@dennou_shojo_siro/videos",
            "https://www.youtube.com/@KaguyaLuna/videos",
            "ytsearch40:ホロライブ 切り抜き 雑談 面白い",
            "ytsearch40:にじさんじ 切り抜き 雑談 面白い",
            "ytsearch40:VTuber 自己紹介 動画 初投稿",
            "ytsearch40:VTuber 企画 動画 検証",
            "ytsearch40:YouTuber 検証 やってみた 一人",
            "ytsearch40:YouTuber 商品紹介 レビュー 買ってみた",
            "ytsearch40:YouTuber ドッキリ 企画 日本",
            "ytsearch40:大食い YouTuber 挑戦",
        ],
        "min_s": 3 * 60,
        "max_s": 16 * 60,
        "target": 75,
        "allow_auto": True,
        "max_per_channel": 3,
        "skip_title": r"MV|Music Video|歌ってみた|[Cc]over|COVER|オリジナル曲|Original Song|歌枠|踊ってみた|3D\s*LIVE|ライブ|LIVE|MMD|ASMR|#shorts|予告|PV|ティザー|Teaser|主題歌",
    },
}

LIST_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "extract_flat": "in_playlist",
    "playlistend": 60,
    "socket_timeout": 15,
}
INFO_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
    "socket_timeout": 15,
}
INFO_SLEEP_S = 3
RETRY_WAIT_S = 60


class RateLimited(Exception):
    pass


def is_429(exc):
    return "429" in str(exc)


def read_text_safe(path):
    if not path.exists():
        return ""
    raw = path.read_bytes()
    if raw.startswith(b'\xff\xfe') or raw.startswith(b'\xfe\xff'):
        return raw.decode('utf-16', errors='ignore')
    return raw.decode('utf-8-sig', errors='ignore')


def known_ids():
    s = set()
    if MOCK_FILE.exists():
        s.update(re.findall(r'"youtube_id": "([^"]+)"', read_text_safe(MOCK_FILE)))
    cand_file = ROOT / ".superpowers" / "gemini" / "scan-n5_variety.jsonl"
    for line in read_text_safe(cand_file).splitlines():
        if line.strip():
            try:
                s.add(json.loads(line)["youtube_id"])
            except Exception:
                pass
    return s


def initial_new_counts():
    counts = {}
    cand_file = ROOT / ".superpowers" / "gemini" / "scan-n5_variety.jsonl"
    for line in read_text_safe(cand_file).splitlines():
        if line.strip():
            try:
                c = json.loads(line).get("channel", "")
                if c:
                    counts[c] = counts.get(c, 0) + 1
            except Exception:
                pass
    return counts


def existing_channels():
    if not MOCK_FILE.exists():
        return {}
    text = MOCK_FILE.read_text(encoding="utf-8")
    m = re.search(r"export const MOCK_VIDEOS: VideoRecord\[\] = (\[[\s\S]*?\]);\s*export const MOCK_SUBTITLE_LINES", text)
    if not m:
        return {}
    try:
        videos = json.loads(m.group(1))
        counts = {}
        for v in videos:
            c = v.get("channel", "")
            counts[c] = counts.get(c, 0) + 1
        return counts
    except Exception:
        return {}


def list_channel(ydl, url):
    for attempt in (1, 2, 3):
        try:
            info = ydl.extract_info(url, download=False)
            entries = [e for e in (info.get("entries") or []) if e and e.get("id")]
            return info.get("title", url), entries
        except Exception as exc:  # noqa: BLE001
            if attempt == 3:
                print(f"# channel {url} failed: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
                return None, []
            time.sleep(5)
    return None, []


def video_info(ydl, vid):
    """Return info, retrying once after a 60 s wait on HTTP 429; a second 429 aborts. Retries on transient network errors."""
    url = f"https://www.youtube.com/watch?v={vid}"
    for attempt in (1, 2):
        try:
            return ydl.extract_info(url, download=False)
        except Exception as exc:  # noqa: BLE001
            if is_429(exc):
                if attempt == 2:
                    raise RateLimited(vid)
                print(f"# HTTP 429 on {vid}; waiting {RETRY_WAIT_S}s once", file=sys.stderr)
                time.sleep(RETRY_WAIT_S)
                continue
            if "11001" in str(exc) or "getaddrinfo" in str(exc) or "timed out" in str(exc):
                if attempt == 2:
                    print(f"# {vid} network error: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
                    return None
                time.sleep(5)
                continue
            print(f"# {vid} info failed: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
            return None
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
    out_file = None
    if "--append" in sys.argv:
        idx = sys.argv.index("--append")
        out_file = Path(sys.argv[idx + 1])
        sys.argv.pop(idx + 1)
        sys.argv.pop(idx)

    if len(sys.argv) != 2 or sys.argv[1] not in CATEGORIES:
        sys.exit("usage: find-general.py [--append <out.jsonl>] " + "|".join(CATEGORIES))
    cat = CATEGORIES[sys.argv[1]]
    allow_auto = bool(cat.get("allow_auto"))
    max_per_ch = cat.get("max_per_channel", 3)
    seen_ids = known_ids()
    probed_ids = set(seen_ids)
    ch_existing = existing_channels()
    ch_new_counts = initial_new_counts()
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
                    if e["id"] in probed_ids:
                        continue
                    dur = e.get("duration")
                    if cat.get("skip_title") and re.search(cat["skip_title"], e.get("title") or ""):
                        continue
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
                        if e["id"] in probed_ids:
                            continue
                        probed_ids.add(e["id"])
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
                        if cat.get("skip_title") and re.search(cat["skip_title"], info.get("title") or ""):
                            continue
                        if info.get("live_status") not in (None, "not_live"):
                            continue
                        if info.get("playable_in_embed") is not True:
                            continue
                        ch_name = info.get("channel") or info.get("uploader") or title
                        if ch_existing.get(ch_name, 0) >= 4:
                            continue
                        if ch_new_counts.get(ch_name, 0) >= max_per_ch:
                            continue
                        if ch_existing.get(ch_name, 0) + ch_new_counts.get(ch_name, 0) >= 4:
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
                        ch_new_counts[ch_name] = ch_new_counts.get(ch_name, 0) + 1
                        ch_stats["accepted"] += 1
                        ch_accepted += 1
                        line_json = json.dumps(row, ensure_ascii=False)
                        print(line_json, flush=True)
                        if out_file:
                            with out_file.open("a", encoding="utf-8") as f:
                                f.write(line_json + "\n")
                    if len(accepted) >= cat["target"]:
                        break
    except RateLimited as exc:
        print(f"# STOPPED: second HTTP 429 at {exc}", file=sys.stderr)

    print("# stats " + json.dumps(stats, ensure_ascii=False), file=sys.stderr)


if __name__ == "__main__":
    main()
