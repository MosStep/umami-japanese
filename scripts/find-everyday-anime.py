"""Find official everyday-life / slice-of-life anime full episodes for Umami.

Scans @AniOneAsia, @MuseThailand, @MuseAsia, and official Japanese anime search queries.
Filters out battle/isekai/magic/mecha/fantasy/horror/crime and already-in-app series.
Checks public, embeddable, not live, duration (3-30 min), and subtitle Case A (manual ja)
or Case B (auto ja + manual th), sleeping 3s between per-video requests.

Run from repo root: python -X utf8 scripts/find-everyday-anime.py
"""
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp

ROOT = Path(__file__).resolve().parent.parent
MOCK_FILE = ROOT / "src" / "data" / "mockVideos.ts"
OUT_JSON = ROOT / ".superpowers" / "gemini" / "anime-everyday-raw.json"

CHANNELS = [
    ("Ani-One Asia", "https://www.youtube.com/@AniOneAsia/videos", 250),
    ("Muse Thailand", "https://www.youtube.com/@MuseThailand/videos", 250),
    ("Muse Asia", "https://www.youtube.com/@MuseAsia/videos", 150),
]

SEARCH_QUERIES = [
    "ytsearch20:日常 アニメ 第1話 公式 フル",
    "ytsearch20:ラブコメ アニメ 第1話 公式 フル",
    "ytsearch15:学園 アニメ 第1話 公式",
    "ytsearch15:料理 アニメ 第1話 公式",
]

MIN_S, MAX_S = 3 * 60, 32 * 60
VIDEO_SLEEP_S = 3.0
RETRY_SLEEP_S = 60

FULL_EP = re.compile(r"(EP\s*\d+|ตอนที่|#\s*\d+|Episode\s*\d+|第\s*[0-9０-９一二]+\s*話)", re.IGNORECASE)
SKIP_TITLE = re.compile(
    r"\b(PV|Highlight|Highlights|Trailer|Teaser|OP|ED|Opening|Ending|Recap|Preview|Clip|Short|Shorts|AMV|MAD|反応|Reaction|ダイジェスト|総集編|予告|พากย์ไทย)\b",
    re.IGNORECASE,
)

# Reject battle / isekai / fantasy / mecha / horror / crime
REJECT_GENRE = re.compile(
    r"(転生|異世界|isekai|reincarnat|魔術|魔法|magic|wizard|witch|呪術|cursed?|剣士|sword|blade|hero|勇者|魔王|demon|monster|モンスター|"
    r"mecha|メカ|robot|ロボット|gundam|ガンダム|バトル|battle|fight|combat|war|戦争|殺し|assassin|murder|killer|crime|horror|ホラー|ghost|"
    r"zombie|ゾンビ|vampire|吸血鬼|dungeon|ダンジョン|guild|ギルド|quest|クエスト|level up|cheat|チート|スキル|skill|slime|スライム|goblin|ゴブリン|"
    r"dragon|ドラゴン|elf|エルフ|knight|騎士|villainess|悪役令嬢|เกิดใหม่|ต่างโลก|จอมมาร|ผู้กล้า|เวทมนตร์|นักฆ่า|ปีศาจ|ดาบ|สงคราม|หุ่นยนต์|สังหาร)",
    re.IGNORECASE,
)

# Positive everyday signals
POSITIVE_GENRE = re.compile(
    r"(日常|slice of life|comedy|romcom|romance|school|学園|高校|中学|部活|club|cafe|カフェ|喫茶|cooking|料理|グルメ|food|gourmet|"
    r"camp|キャンプ|travel|旅|family|家族|childcare|育児|pet|猫|犬|work|仕事|office|会社|baito|バイト|music|音楽|band|バンド|idol|"
    r"รัก|คอมเมดี้|โรแมนติก|ชีวิตประจำวัน|โรงเรียน|ชมรม|อาหาร|ทำอาหาร|ครอบครัว|แมว|หมา|คาเฟ่|ทำงาน|ดนตรี|ฮีลใจ|อบอุ่น)",
    re.IGNORECASE,
)

EXISTING_SERIES_KEYWORDS = [
    "jujutsu", "呪術", "bleach", "aoashi", "アオアシ", "อาโอะอาชิ", "battle spirits", "แบทเทิลสปิริตส์",
    "dark machine", "ดาร์กแมชชีน", "kurumi", "くるみ", "คุรุมิ", "rayearth", "レイアース", "เรย์เอิร์ธ",
    "magical girl", "魔法少女", "สาวน้อยเวทมนตร์", "reincarnated as a sword", "転生したら剣", "เกิดใหม่เป็นดาบ",
    "tensei goblin", "転生ゴブリン", "เกิดใหม่เป็นก็อบลิน", "code geass", "コードギアス", "โค้ดกีอัส",
    "milky", "ミルキー", "มิลกี้"
]


def app_youtube_ids():
    return set(re.findall(r'"youtube_id":\s*"([^"]+)"', MOCK_FILE.read_text(encoding="utf-8")))


def is_existing_series(title):
    tl = title.lower()
    return any(k in tl for k in EXISTING_SERIES_KEYWORDS)


def is_ep_1_or_2(title):
    # Prefer EP 1 or 2, or unspecified small ep
    m = re.search(r"(?:EP\s*|ตอนที่\s*|#\s*|Episode\s*|第\s*)(\d+)", title, re.IGNORECASE)
    if m:
        return int(m.group(1)) <= 2
    if "第一話" in title or "第1話" in title or "第１話" in title:
        return True
    if "第二話" in title or "第2話" in title or "第２話" in title:
        return True
    return False


def list_flat(ydl, url, limit=None):
    info = ydl.extract_info(url, download=False)
    entries = info.get("entries") or []
    return entries[:limit] if limit else entries


def inspect_video(ydl, vid, source_name):
    info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    subs = info.get("subtitles") or {}
    auto = info.get("automatic_captions") or {}
    title = info.get("title") or ""
    desc = info.get("description") or ""
    dur = info.get("duration") or 0
    channel = info.get("channel") or info.get("uploader") or source_name

    reasons = []
    if info.get("availability") not in (None, "public"):
        reasons.append(f"availability={info.get('availability')}")
    if info.get("playable_in_embed") is not True:
        reasons.append("not embeddable")
    if info.get("is_live") or info.get("was_live"):
        reasons.append("live")
    if not (MIN_S <= dur <= MAX_S):
        reasons.append(f"duration={dur}s")

    ja_manual_keys = [k for k in subs.keys() if k.startswith("ja")]
    th_manual_keys = [k for k in subs.keys() if k.startswith("th")]
    ja_auto_keys = [k for k in auto.keys() if k.startswith("ja")]

    case = None
    if ja_manual_keys:
        case = "A"
    elif ja_auto_keys and th_manual_keys:
        case = "B"
    else:
        if not ja_manual_keys and not ja_auto_keys:
            reasons.append("no ja track")
        elif not th_manual_keys:
            reasons.append("auto ja without manual th")

    if REJECT_GENRE.search(title + "\n" + desc[:500]):
        reasons.append("rejected genre keyword")

    return {
        "youtube_id": vid,
        "source": source_name,
        "channel": channel,
        "title": title,
        "description_snippet": desc[:300].replace("\n", " "),
        "duration": dur,
        "case": case,
        "ja_manual": ja_manual_keys,
        "th_manual": th_manual_keys,
        "ja_auto": ja_auto_keys,
        "positive_match": bool(POSITIVE_GENRE.search(title + "\n" + desc[:500])),
        "ok_technical": len(reasons) == 0,
        "reasons": reasons,
    }


def main():
    known_ids = app_youtube_ids()
    flat_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": "in_playlist",
        "socket_timeout": 15,
    }

    candidates = []
    seen_ids = set(known_ids)

    with yt_dlp.YoutubeDL(flat_opts) as ydl:
        for name, url, limit in CHANNELS:
            print(f"Scanning {name}...", file=sys.stderr)
            flat_opts["playlistend"] = limit
            with yt_dlp.YoutubeDL(flat_opts) as ydl_ch:
                entries = list_flat(ydl_ch, url, limit)
            for e in entries:
                vid = e.get("id")
                title = e.get("title") or ""
                dur = e.get("duration") or 0
                if not vid or vid in seen_ids:
                    continue
                if not FULL_EP.search(title) or SKIP_TITLE.search(title):
                    continue
                if dur and not (MIN_S <= dur <= MAX_S):
                    continue
                if is_existing_series(title) or REJECT_GENRE.search(title):
                    continue
                if not is_ep_1_or_2(title):
                    continue
                seen_ids.add(vid)
                candidates.append((vid, name, title, dur))

        flat_opts.pop("playlistend", None)
        for q in SEARCH_QUERIES:
            print(f"Searching {q}...", file=sys.stderr)
            try:
                entries = list_flat(ydl, q)
            except Exception as exc:
                print(f"Search failed: {exc}", file=sys.stderr)
                continue
            for e in entries:
                vid = e.get("id")
                title = e.get("title") or ""
                dur = e.get("duration") or 0
                if not vid or vid in seen_ids:
                    continue
                if SKIP_TITLE.search(title) or is_existing_series(title) or REJECT_GENRE.search(title):
                    continue
                if dur and not (MIN_S <= dur <= MAX_S):
                    continue
                seen_ids.add(vid)
                candidates.append((vid, "JP Search", title, dur))

    print(f"\nFound {len(candidates)} pre-filtered EP 1-2 candidates. Inspecting details...", file=sys.stderr)

    # Prioritize positive matches first
    candidates.sort(key=lambda x: (0 if POSITIVE_GENRE.search(x[2]) else 1, 0 if x[1] != "JP Search" else 1))

    full_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
        "socket_timeout": 15,
    }

    results = []
    passing = 0
    with yt_dlp.YoutubeDL(full_opts) as ydl:
        for i, (vid, src, title, dur) in enumerate(candidates[:60]):
            if i > 0:
                time.sleep(VIDEO_SLEEP_S)
            try:
                res = inspect_video(ydl, vid, src)
            except Exception as exc:
                if "429" in str(exc):
                    print(f"[{vid}] HTTP 429, sleeping {RETRY_SLEEP_S}s...", file=sys.stderr)
                    time.sleep(RETRY_SLEEP_S)
                    try:
                        res = inspect_video(ydl, vid, src)
                    except Exception as exc2:
                        print(f"[{vid}] Failed after retry: {exc2}", file=sys.stderr)
                        break
                else:
                    print(f"[{vid}] Error: {exc}", file=sys.stderr)
                    continue
            results.append(res)
            status = "PASS" if res["ok_technical"] else f"FAIL ({', '.join(res['reasons'])})"
            if res["ok_technical"]:
                passing += 1
            print(f"[{i+1}/{min(len(candidates), 60)}] {vid} | Case {res['case']} | {res['duration']}s | {status} | {res['title'][:60]}", file=sys.stderr)
            if passing >= 28:
                break

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved {len(results)} inspected candidates ({passing} technically passing) to {OUT_JSON}")


if __name__ == "__main__":
    main()
