import React, { useEffect, useMemo, useRef, useState } from 'react';
import { audioService } from '../utils/audioService';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { ArrowLeft, Languages, RotateCcw, Search, Volume2, X } from 'lucide-react';

/** Open from anywhere: openKanji('日') or openKanji(null) for the list. */
export const KANJI_EVENT = 'umami:kanji';
export const openKanji = (k: string | null = null) => window.dispatchEvent(new CustomEvent(KANJI_EVENT, { detail: k }));
export const kanjiIn = (text: string): string[] => [...new Set(text.match(/[一-鿿]/g) ?? [])];

interface KanjiEntry {
  k: string;
  n: number;
  w: [string, string, string][];
  on?: string;
  kun?: string;
  th?: string;
}

// KanjiVG stroke-order data (CC BY-SA 3.0), a pinned release served by jsDelivr; one small SVG per kanji.
const KANJIVG = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@r20250816/kanji/';
const SEEN_KEY = 'umami_kanji_seen';
const svgCache = new Map<string, string[]>();

const loadSeen = (): Record<string, 1> => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
  } catch {
    return {};
  }
};

/** Stroke paths (in drawing order) of one kanji from KanjiVG. */
const loadStrokes = async (k: string): Promise<string[]> => {
  if (svgCache.has(k)) return svgCache.get(k)!;
  const code = k.codePointAt(0)!.toString(16).padStart(5, '0');
  const res = await fetch(`${KANJIVG}${code}.svg`);
  if (!res.ok) throw new Error(String(res.status));
  const doc = new DOMParser().parseFromString(await res.text(), 'image/svg+xml');
  const paths = [...doc.querySelectorAll('path[d]')].map((p) => p.getAttribute('d') ?? '').filter(Boolean);
  svgCache.set(k, paths);
  return paths;
};

/** Animated stroke order: strokes draw one after another; tap replay to draw again. */
const StrokeOrder: React.FC<{ k: string }> = ({ k }) => {
  const [paths, setPaths] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [run, setRun] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let alive = true;
    setPaths(null);
    setFailed(false);
    loadStrokes(k)
      .then((p) => alive && setPaths(p))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [k]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !paths) return;
    const els = [...svg.querySelectorAll<SVGPathElement>('path.stroke')];
    const anims: Animation[] = [];
    let delay = 200;
    for (const el of els) {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      const dur = Math.max(250, len * 9);
      anims.push(el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur, delay, fill: 'forwards', easing: 'ease-in-out' }));
      delay += dur + 120;
    }
    return () => anims.forEach((a) => a.cancel());
  }, [paths, run]);

  if (failed) return <p className="text-xs text-slate-500 text-center py-6">โหลดลำดับขีดไม่ได้ (ต้องต่ออินเทอร์เน็ต)</p>;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-40 h-40 rounded-2xl bg-slate-950 border border-slate-800">
        {!paths && <p className="absolute inset-0 grid place-items-center text-6xl font-jp text-slate-700">{k}</p>}
        {paths && (
          <svg ref={svgRef} viewBox="0 0 109 109" className="w-full h-full">
            {paths.map((d, i) => (
              <path key={`g${i}`} d={d} fill="none" stroke="#334155" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {paths.map((d, i) => (
              <path key={`s${run}-${i}`} className="stroke" d={d} fill="none" stroke="#fbbf24" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        )}
      </div>
      {paths && (
        <button onClick={() => setRun((r) => r + 1)} className="min-h-9 px-3 text-xs text-slate-400 flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5" /> เขียนให้ดูอีกครั้ง · {paths.length} ขีด
        </button>
      )}
    </div>
  );
};

/** Kanji sheet (mounted once in App): list of kanji in the clips, and a detail page with stroke order and clip words. */
export const KanjiSheet: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<KanjiEntry[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(120);
  const [seen, setSeen] = useState(loadSeen);
  useLockBodyScroll(open);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setCurrent((e as CustomEvent<string | null>).detail);
      setOpen(true);
    };
    window.addEventListener(KANJI_EVENT, onOpen);
    return () => window.removeEventListener(KANJI_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (open && !data) import('../data/kanji.json').then((m) => setData(m.default as unknown as KanjiEntry[]));
  }, [open, data]);

  const byK = useMemo(() => new Map((data ?? []).map((e, i) => [e.k, { ...e, rank: i + 1 }])), [data]);
  const entry = current ? byK.get(current) : undefined;
  useEffect(() => {
    if (!current || seen[current]) return;
    const next = { ...seen, [current]: 1 as const };
    setSeen(next);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
    } catch {}
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    const q = query.trim();
    if (!q) return data ?? [];
    return (data ?? []).filter((e) => q.includes(e.k) || e.th?.includes(q) || e.w.some((w) => w[0].includes(q) || w[1].includes(q) || w[2].includes(q)));
  }, [data, query]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-label="คันจิ"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="shrink-0 flex items-center gap-2 p-4 pb-2">
          {current && (
            <button onClick={() => setCurrent(null)} aria-label="กลับ" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="flex-1 text-base font-bold text-white">{current ? `คันจิ ${current}` : 'คันจิในคลิป'}</h2>
          <button onClick={() => setOpen(false)} aria-label="ปิด" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 space-y-3">
          {!data && <p className="text-sm text-slate-400">กำลังโหลด…</p>}

          {current && data && (
            <>
              <div className="flex items-start gap-4">
                <StrokeOrder k={current} />
                <div className="flex-1 min-w-0 space-y-1.5 pt-1">
                  {entry?.th && <p className="text-base font-bold text-white">{entry.th}</p>}
                  {entry?.on && (
                    <p className="text-sm text-slate-300">
                      <span className="text-xs text-slate-500">อง </span>
                      <span className="font-jp">{entry.on}</span>
                    </p>
                  )}
                  {entry?.kun && (
                    <p className="text-sm text-slate-300">
                      <span className="text-xs text-slate-500">คุง </span>
                      <span className="font-jp">{entry.kun}</span>
                    </p>
                  )}
                  {entry ? (
                    <p className="text-xs text-slate-500">อันดับ {entry.rank} ที่เจอบ่อยในคลิป · {entry.n} ครั้ง</p>
                  ) : (
                    <p className="text-xs text-slate-500">ยังไม่มีข้อมูลคันจินี้ในคลิป</p>
                  )}
                  <button onClick={() => audioService.playJapanese(current)} className="min-h-9 px-2.5 rounded-lg bg-slate-800 text-xs text-slate-200 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> ฟัง
                  </button>
                </div>
              </div>
              {entry && entry.w.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-indigo-300" /> คำในคลิปที่ใช้คันจินี้
                  </p>
                  {entry.w.map(([lemma, reading, th]) => (
                    <button
                      key={lemma}
                      onClick={() => audioService.playJapanese(lemma)}
                      className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700"
                    >
                      <span className="font-jp text-lg font-bold text-white">
                        {[...lemma].map((c, i) => (
                          <span key={i} className={c === current ? 'text-amber-300' : ''}>
                            {c}
                          </span>
                        ))}
                      </span>
                      <span className="font-jp text-xs text-slate-400">{reading}</span>
                      <span className="ml-auto text-sm text-slate-300 text-right">{th}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-500">ลำดับขีดจาก KanjiVG (CC BY-SA 3.0)</p>
            </>
          )}

          {!current && data && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(120);
                  }}
                  placeholder="ค้นหาคันจิ คำ หรือความหมาย"
                  className="w-full min-h-11 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                {data.length} ตัว เรียงจากที่เจอบ่อยในคลิป · เปิดดูแล้ว {Object.keys(seen).length}
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {list.slice(0, limit).map((e) => (
                  <button
                    key={e.k}
                    onClick={() => setCurrent(e.k)}
                    className={`aspect-square rounded-xl border font-jp text-2xl font-bold grid place-items-center ${
                      seen[e.k] ? 'bg-slate-950 border-emerald-500/30 text-emerald-200' : 'bg-slate-800/60 border-slate-700 text-white'
                    }`}
                  >
                    {e.k}
                  </button>
                ))}
              </div>
              {list.length > limit && (
                <button onClick={() => setLimit((l) => l + 120)} className="w-full min-h-11 rounded-xl bg-slate-800 text-sm text-slate-200">
                  แสดงเพิ่ม ({list.length - limit})
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/** Words-tab entry card. */
export const KanjiCard: React.FC = () => (
  <button
    onClick={() => openKanji(null)}
    className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left active:opacity-80"
  >
    <span className="w-6 text-center font-jp text-xl font-bold text-emerald-300">字</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-bold text-white">คันจิ</span>
      <span className="block text-xs text-slate-400">ลำดับขีด และคำในคลิปที่ใช้คันจินั้น</span>
    </span>
  </button>
);
