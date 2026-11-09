#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""scripts/relevel.py
Re-assigns primary_jlpt, jlpt_distribution, and difficulty_rating for every
clip in src/data/mockVideos.ts using a documented, reproducible method.
"""

import csv
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MOCK_FILE = ROOT / "src" / "data" / "mockVideos.ts"
CAPTION_DIR = ROOT / "src" / "data" / "captions"
VOCAB_CSV = ROOT / "scripts" / "data" / "jlpt_vocab.csv"
REPORT_MD = ROOT / ".superpowers" / "gemini" / "RELEVEL.md"

LEVELS = ["N5", "N4", "N3", "N2", "N1"]
LEVEL_INDEX = {lvl: i for i, lvl in enumerate(LEVELS)}

NON_CONTENT_POS = {"助詞", "助動詞", "記号", "補助記号"}
CLEAN_PUNCT = re.compile(r"^[^\w]+|[^\w]+$")
KANJI_RE = re.compile(r"[\u4e00-\u9faf\u3400-\u4dbf]")
JA_CHAR_RE = re.compile(r"[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]")

# Cumulative vocabulary threshold across all content tokens (including folded N1+ unknown).
# In natural speech / video subtitles, ~20-25% of tokens are names, proper nouns, loanwords,
# or colloquial contractions that do not appear in standard 8,000-word JLPT Anki lists.
# Therefore, 70% of all content tokens (equivalent to ~88-90% of recognized content words)
# represents the standard linguistic comprehension threshold for a given JLPT grade.
VOCAB_CUMULATIVE_THRESHOLD = 0.70

def load_vocab():
    vocab_exact = {}
    vocab_expr = {}
    vocab_read = {}
    
    if not VOCAB_CSV.exists():
        print(f"Error: {VOCAB_CSV} not found! Run download-jlpt.py first.")
        sys.exit(1)
        
    with open(VOCAB_CSV, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            expr = (r.get("expression") or "").strip()
            reading = (r.get("reading") or "").strip()
            lvl = (r.get("level") or "").strip().upper()
            if not lvl or lvl not in LEVEL_INDEX:
                continue
            if expr and reading:
                vocab_exact[(expr, reading)] = lvl
            if expr:
                if expr not in vocab_expr or LEVEL_INDEX[lvl] < LEVEL_INDEX[vocab_expr[expr]]:
                    vocab_expr[expr] = lvl
            if reading:
                if reading not in vocab_read or LEVEL_INDEX[lvl] < LEVEL_INDEX[vocab_read[reading]]:
                    vocab_read[reading] = lvl
                    
    return vocab_exact, vocab_expr, vocab_read

def detect_stated_level(title, ja_title, desc, channel):
    text = f"{title} {ja_title} {desc}".lower()
    
    # Specific JLPT regex: N5..N1, JLPT N5..N1, 5級..1級, 【N5】, [N5], etc.
    # Avoid bare numbers like "5選"
    m = re.search(r'(?:jlpt\s*|n)([1-5])\b|(?:jlpt\s*|n)([1-5])[【】\[\]\(\)\s～\-]|([1-5])級', text)
    if m:
        for g in m.groups():
            if g:
                return f"N{g}"
                
    if "n6" in text or "n-6" in text:
        return "N5"
        
    if "初級" in text or "やさしい日本語" in text or "easy japanese" in text or "beginner" in text:
        return "N5"
    if "中級" in text or "intermediate" in text:
        return "N3"
    if "上級" in text or "advanced" in text:
        return "N2"
        
    return None

def analyze_clip(youtube_id, vocab_exact, vocab_expr, vocab_read):
    cap_file = CAPTION_DIR / f"{youtube_id}.json"
    if not cap_file.exists():
        return None
        
    with open(cap_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    lines = data.get("lines", [])
    
    token_level_counts = {lvl: 0 for lvl in LEVELS}
    unknown_count = 0
    total_content_tokens = 0
    
    total_ja_chars = 0
    total_kanji_chars = 0
    total_speech_time_s = 0.0
    line_lengths = []
    
    for line in lines:
        ja = line.get("ja") or ""
        if not ja:
            continue
            
        ja_clean = "".join(JA_CHAR_RE.findall(ja))
        kanji_clean = "".join(KANJI_RE.findall(ja))
        
        total_ja_chars += len(ja_clean)
        total_kanji_chars += len(kanji_clean)
        line_lengths.append(len(ja_clean))
        
        start_ms = line.get("start_ms", 0)
        end_ms = line.get("end_ms", 0)
        dur = max(0.5, (end_ms - start_ms) / 1000.0)
        total_speech_time_s += dur
        
        for t in line.get("tokens", []):
            pos = t.get("pos", "")
            if pos in NON_CONTENT_POS:
                continue
                
            surf = CLEAN_PUNCT.sub('', t.get("surface", "").strip())
            lem = CLEAN_PUNCT.sub('', (t.get("lemma") or "").strip()) or surf
            rd = CLEAN_PUNCT.sub('', (t.get("reading") or "").strip())
            
            # Punctuation check
            if not surf or not JA_CHAR_RE.search(surf):
                continue
                
            total_content_tokens += 1
            
            # Check desu / masu / numbers -> always easy N5
            if surf in ["です", "ます", "でした", "ました", "ません", "ませんでした"] or re.match(r"^\d+$", surf):
                token_level_counts["N5"] += 1
                continue
                
            lvl = None
            if (lem, rd) in vocab_exact:
                lvl = vocab_exact[(lem, rd)]
            elif lem in vocab_expr:
                lvl = vocab_expr[lem]
            elif (surf, rd) in vocab_exact:
                lvl = vocab_exact[(surf, rd)]
            elif surf in vocab_expr:
                lvl = vocab_expr[surf]
            elif rd in vocab_read:
                lvl = vocab_read[rd]
            elif lem in vocab_read:
                lvl = vocab_read[lem]
            elif surf in vocab_read:
                lvl = vocab_read[surf]
                
            if lvl:
                token_level_counts[lvl] += 1
            else:
                unknown_count += 1
                
    if total_content_tokens == 0:
        total_content_tokens = 1
        
    # Calculate token-weighted shares (fold unknown N1+ into N1)
    shares = {}
    for lvl in LEVELS:
        cnt = token_level_counts[lvl]
        if lvl == "N1":
            cnt += unknown_count
        shares[lvl] = (cnt / total_content_tokens) * 100.0
        
    # Round shares to integers summing to exactly 100
    int_shares = {lvl: int(round(shares[lvl])) for lvl in LEVELS}
    diff = 100 - sum(int_shares.values())
    if diff != 0:
        max_lvl = max(LEVELS, key=lambda l: int_shares[l])
        int_shares[max_lvl] += diff
        
    # Vocab level: easiest level L such that >= threshold of content tokens are <= L
    cum = 0.0
    vocab_lvl = "N1"
    for lvl in LEVELS:
        cnt = token_level_counts[lvl]
        if lvl == "N1":
            cnt += unknown_count
        cum += (cnt / total_content_tokens)
        if cum >= VOCAB_CUMULATIVE_THRESHOLD:
            vocab_lvl = lvl
            break
            
    # Speech rate & text metrics
    speech_rate = total_ja_chars / max(1.0, total_speech_time_s)
    avg_line_len = sum(line_lengths) / max(1, len(line_lengths))
    kanji_ratio = (total_kanji_chars / max(1, total_ja_chars)) * 100.0
    
    # Speed adjustment
    lvl_idx = LEVEL_INDEX[vocab_lvl]
    speed_note = "normal"
    if speech_rate > 9.0:
        lvl_idx = min(len(LEVELS) - 1, lvl_idx + 1)
        speed_note = "fast (+1)"
    elif speech_rate < 5.0:
        lvl_idx = max(0, lvl_idx - 1)
        speed_note = "slow (-1)"
        
    computed_lvl = LEVELS[lvl_idx]
    
    return {
        "shares": int_shares,
        "vocab_level": vocab_lvl,
        "speech_rate": speech_rate,
        "avg_line_len": avg_line_len,
        "kanji_ratio": kanji_ratio,
        "computed_lvl": computed_lvl,
        "speed_note": speed_note,
        "content_tokens": total_content_tokens,
        "unknown_count": unknown_count,
        "token_counts": token_level_counts,
    }

def main():
    print("Loading JLPT vocabulary...")
    vocab_exact, vocab_expr, vocab_read = load_vocab()
    print(f"Loaded {len(vocab_exact)} exact mappings, {len(vocab_expr)} expressions.")
    
    with open(MOCK_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extract MOCK_VIDEOS JSON
    match = re.search(r"export const MOCK_VIDEOS: VideoRecord\[\] = (\[[\s\S]*?\]);\s*export const MOCK_SUBTITLE_LINES", content)
    if not match:
        print("Error: Could not match MOCK_VIDEOS array in mockVideos.ts")
        sys.exit(1)
        
    raw_videos = json.loads(match.group(1))
    print(f"Analyzing {len(raw_videos)} video records...")
    
    records_out = []
    conflicts = []
    level_counts_before = {lvl: 0 for lvl in LEVELS}
    level_counts_after = {lvl: 0 for lvl in LEVELS}
    
    for v in raw_videos:
        vid_id = v["id"]
        yid = v["youtube_id"]
        old_primary = v.get("primary_jlpt", "N3")
        level_counts_before[old_primary] += 1
        
        stated = detect_stated_level(v.get("title", ""), v.get("japanese_title", ""), v.get("description", ""), v.get("channel", ""))
        analysis = analyze_clip(yid, vocab_exact, vocab_expr, vocab_read)
        if not analysis:
            print(f"Warning: No caption analysis for {yid}")
            records_out.append({"record": v, "stated": stated or "-", "old_primary": old_primary, "new_primary": old_primary})
            continue
            
        computed = analysis["computed_lvl"]
        final_lvl = computed
        decision_note = ""
        
        if stated:
            diff = abs(LEVEL_INDEX[stated] - LEVEL_INDEX[computed])
            if diff <= 1:
                final_lvl = stated
                decision_note = f"Stated {stated} adopted (within 1 step of computed {computed})"
            else:
                final_lvl = computed
                decision_note = f"CONFLICT: Stated {stated} vs computed {computed} (diff={diff})"
                conflicts.append({
                    "id": vid_id,
                    "title": v.get("title"),
                    "stated": stated,
                    "computed": computed,
                    "diff": diff,
                    "rate": round(analysis["speech_rate"], 2),
                    "vocab_lvl": analysis["vocab_level"],
                    "reasoning": f"Stated as {stated} but computed as {computed} (vocab={analysis['vocab_level']}, speech rate={analysis['speech_rate']:.2f} chars/s)."
                })
        else:
            decision_note = f"Computed {computed} (vocab {analysis['vocab_level']}, {analysis['speed_note']})"
            
        level_counts_after[final_lvl] += 1
        difficulty_rating = LEVEL_INDEX[final_lvl] + 1
        
        # Update record
        v["primary_jlpt"] = final_lvl
        v["difficulty_rating"] = difficulty_rating
        v["jlpt_distribution"] = analysis["shares"]
        
        records_out.append({
            "record": v,
            "id": vid_id,
            "youtube_id": yid,
            "title": v.get("title"),
            "stated": stated or "-",
            "old_primary": old_primary,
            "new_primary": final_lvl,
            "shares": analysis["shares"],
            "speech_rate": analysis["speech_rate"],
            "avg_line_len": analysis["avg_line_len"],
            "kanji_ratio": analysis["kanji_ratio"],
            "note": decision_note
        })

    print("\n--- Level Counts Before vs After ---")
    print(f"Before: {level_counts_before}")
    print(f"After:  {level_counts_after}")
    print(f"Total conflicts: {len(conflicts)}")
    
    # Check Step 4 Sanity Rules:
    # 1. No level has > 50% of clips
    for lvl, cnt in level_counts_after.items():
        pct = (cnt / len(raw_videos)) * 100
        if pct > 50.0:
            print(f"Warning: Level {lvl} has {pct:.1f}% (> 50%) of all clips!")
            
    # Update mockVideos.ts
    updated_records = [r["record"] for r in records_out]
    formatted_json = json.dumps(updated_records, ensure_ascii=False, indent=2)
    new_mock_content = content[:match.start(1)] + formatted_json + content[match.end(1):]
    
    with open(MOCK_FILE, "w", encoding="utf-8") as f:
        f.write(new_mock_content)
    print(f"Updated {MOCK_FILE} successfully.")
    
    # Save intermediate table data for REPORT.md
    with open(ROOT / ".superpowers" / "gemini" / "relevel_analysis.json", "w", encoding="utf-8") as f:
        json.dump({
            "records": [{k: v for k, v in r.items() if k != "record"} for r in records_out],
            "before": level_counts_before,
            "after": level_counts_after,
            "conflicts": conflicts
        }, f, ensure_ascii=False, indent=2)
    print("Saved analysis data to .superpowers/gemini/relevel_analysis.json.")

if __name__ == "__main__":
    main()
