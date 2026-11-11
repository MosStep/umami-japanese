"""Rebuild caption files on the manual-Thai timeline.
One line per manual Thai cue (exact start/end/text); `ja` = auto-Japanese words (json3
word timestamps) spoken during that cue.
Usage: python -X utf8 scripts/realign-to-thai.py <youtube_id> ...
"""
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp

sys.path.insert(0, str(Path(__file__).resolve().parent))
import importlib.util
_spec = importlib.util.spec_from_file_location("fetch_captions", Path(__file__).resolve().parent / "fetch-captions.py")
fc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fc)

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src" / "data" / "captions"
GAP_MS = 600
NOISE = re.compile(r"[＞>]+")


def th_cues(data):
    cues = []
    for i, ev in enumerate(data.get("events") or []):
        if "segs" not in ev:
            continue
        text = fc.clean_text("".join(s.get("utf8", "") for s in ev["segs"]))
        if not text:
            continue
        start = int(ev.get("tStartMs", 0))
        dur = ev.get("dDurationMs")
        if dur is None:
            continue
        cues.append({"start": start, "end": max(start + int(dur), start + 1), "text": text})
    cues.sort(key=lambda c: c["start"])
    # unique start_ms
    seen = set()
    for c in cues:
        while c["start"] in seen:
            c["start"] += 1
            c["end"] = max(c["end"], c["start"] + 1)
        seen.add(c["start"])
    return cues


def ja_words(data):
    words, seen = [], set()
    for ev in data.get("events") or []:
        if "segs" not in ev or ev.get("aAppend"):
            continue
        base = int(ev.get("tStartMs", 0))
        for s in ev["segs"]:
            t = s.get("utf8", "")
            if not t.strip():
                continue
            st = base + int(s.get("tOffsetMs", 0))
            key = (st, t)
            if key in seen:
                continue
            seen.add(key)
            words.append((st, t.replace("\n", " ")))
    words.sort(key=lambda w: w[0])
    return words


def _script(ch):
    if fc.KANJI.match(ch):
        return "k"
    if "゠" <= ch <= "ヿ":
        return "K"
    if "぀" <= ch <= "ゟ":
        return "h"
    return "o"


SPLIT_MIN_CHARS = 4
SPAN_CAP_MS = 4000


def split_long_words(words, cues):
    """Phrase-level ASR segments (one timestamp for many words) are spread over the cues their time span covers,
    proportionally to overlap, cutting at the nearest kanji/kana script change."""
    out = []
    for n, (st, t) in enumerate(words):
        nxt = words[n + 1][0] if n + 1 < len(words) else st + SPAN_CAP_MS
        en = min(nxt, st + SPAN_CAP_MS)
        text = t.strip()
        ov = [(c["start"], max(0, min(en, c["end"]) - max(st, c["start"]))) for c in cues
              if c["start"] < en and c["end"] > st]
        ov = [o for o in ov if o[1] > 0]
        if len(text) < SPLIT_MIN_CHARS or len(ov) < 2 or fc.INLINE_TAG.search(text) or text.startswith(("[", "［")):
            out.append((st, t))
            continue
        total = sum(o[1] for o in ov)
        cuts, acc = [], 0
        for _, o in ov[:-1]:
            acc += o
            target = round(len(text) * acc / total)
            # snap to the nearest script change (a likely word boundary) within 3 chars
            cands = [i for i in range(max(1, target - 3), min(len(text), target + 4))
                     if _script(text[i - 1]) != _script(text[i])]
            cut = min(cands, key=lambda i: abs(i - target)) if cands else target
            cuts.append(min(max(cut, (cuts[-1] if cuts else 0)), len(text)))
        bounds = [0] + cuts + [len(text)]
        for (cstart, _), a, b in zip(ov, bounds, bounds[1:]):
            if b > a:
                out.append((max(st, cstart), text[a:b]))
    out.sort(key=lambda w: w[0])
    return out


def clean_ja(text):
    text = fc.INLINE_TAG.sub(" ", text)
    text = re.sub(r"［[^］]*］|（[^）]*）", " ", text)
    text = NOISE.sub(" ", text)
    text = re.sub(r"\s+", " ", fc.LATIN_FRAGMENT.sub(" ", text)).strip()
    text = text.lstrip("。、，,.？?！! ")
    if not text or (len(text) >= 2 and len(set(text)) == 1):
        return None
    if not fc.KANA.search(text) and not fc.KANJI.search(text):
        return None
    return text


# A cue cannot begin with these; when it does, the ASR put the phrase's first word in the previous cue.
CONT_START = ("に", "の", "が", "と", "を", "は", "で", "も", "へ", "や", "て", "た", "だ", "よ", "ね",
              "か", "けど", "から", "まで", "より", "って", "ん", "な", "ない", "ます", "です")
MOVE_WINDOW_MS = 1500


def assign(words, cues):
    parts = [[] for _ in cues]
    dropped = 0
    for st, t in words:
        best = None
        for i, c in enumerate(cues):
            if c["start"] <= st < c["end"]:
                best = i
                break
        if best is None:
            # In a gap: the next cue first (a word before a cue usually opens its phrase), else the previous one.
            nxt = next((i for i, c in enumerate(cues) if c["start"] > st), None)
            if nxt is not None and cues[nxt]["start"] - st <= GAP_MS:
                best = nxt
            elif nxt is not None and nxt > 0 and st - cues[nxt - 1]["end"] + 1 <= GAP_MS:
                best = nxt - 1
            elif nxt is None and cues and st - cues[-1]["end"] + 1 <= GAP_MS:
                best = len(cues) - 1
        if best is None:
            dropped += 1
        else:
            parts[best].append((st, t))
    # Keep phrases whole: if a cue starts with a continuation word, pull the previous cue's last word over.
    for i in range(1, len(cues)):
        cur, prev = parts[i], parts[i - 1]
        if cur and len(prev) >= 2 and cur[0][1].strip().startswith(CONT_START)                 and cues[i]["start"] - prev[-1][0] <= MOVE_WINDOW_MS:
            cur.insert(0, prev.pop())
    return [[t for _, t in p] for p in parts], dropped


def fetch(ydl, yid):
    info = ydl.extract_info(f"https://www.youtube.com/watch?v={yid}", download=False)
    th_kind, th_f = fc.pick_track(info, "th", ["th"])
    if th_kind != "manual":
        raise RuntimeError("no manual Thai track")
    ja_kind, ja_f = fc.pick_track(info, "ja", ["ja-orig", "ja"])
    if ja_kind != "auto":
        raise RuntimeError(f"ja track kind={ja_kind}")
    th = fc.fetch_json3(ydl, th_f)
    time.sleep(1)
    ja = fc.fetch_json3(ydl, ja_f)
    return th, ja


def build_record(yid, th_data, ja_data):
    """One line per manual Thai cue; ja = auto-Japanese words spoken during it. Used by fetch-captions.py."""
    cues = th_cues(th_data)
    words = split_long_words(ja_words(ja_data), cues)
    parts, dropped = assign(words, cues)
    lines = [{"start_ms": c["start"], "end_ms": c["end"], "ja": clean_ja("".join(p)), "th": c["text"]}
             for c, p in zip(cues, parts)]
    return {"youtube_id": yid, "source": {"ja": "auto", "th": "manual"}, "lines": lines,
            "_dropped": dropped, "_words": len(words)}


CACHE = ROOT / ".superpowers" / "realign-cache"


def process(ydl, yid):
    cp = CACHE / f"{yid}.json"
    if cp.exists():
        d = json.loads(cp.read_text(encoding="utf-8"))
        th_data, ja_data = d["th"], d["ja"]
    else:
        th_data, ja_data = fetch(ydl, yid)
        CACHE.mkdir(parents=True, exist_ok=True)
        cp.write_text(json.dumps({"th": th_data, "ja": ja_data}, ensure_ascii=False), encoding="utf-8")
    rec = build_record(yid, th_data, ja_data)
    lines = rec["lines"]
    dropped = rec.pop("_dropped")
    words = range(rec.pop("_words"))
    (OUT_DIR / f"{yid}.json").write_text(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    filled = sum(1 for l in lines if l["ja"])
    print(f"[{yid}] th_cues={len(lines)} ja_filled={filled} ja_null={len(lines)-filled} dropped_words={dropped} (words={len(words)})")


def main():
    ids = sys.argv[1:]
    with yt_dlp.YoutubeDL(fc.YDL_OPTS) as ydl:
        for n, yid in enumerate(ids):
            try:
                process(ydl, yid)
            except Exception as exc:  # noqa: BLE001
                if "429" in str(exc):
                    print(f"[{yid}] HTTP 429, waiting 60s once", file=sys.stderr)
                    time.sleep(60)
                    try:
                        process(ydl, yid)
                    except Exception as exc2:  # noqa: BLE001
                        print(f"[{yid}] 429 again/failed, stopping: {str(exc2)[:100]}", file=sys.stderr)
                        sys.exit(2)
                else:
                    print(f"[{yid}] FAILED: {str(exc).splitlines()[0][:120]}", file=sys.stderr)
            if n < len(ids) - 1:
                time.sleep(3)


if __name__ == "__main__":
    main()
