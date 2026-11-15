import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioService } from '../utils/audioService';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { ArrowLeft, BookOpenCheck, Play, Search, Volume2, X } from 'lucide-react';

/** Open the library from anywhere: window.dispatchEvent(new CustomEvent(GRAMMAR_EVENT, { detail: pattern | null })). */
export const GRAMMAR_EVENT = 'umami:grammar';
export const openGrammar = (pattern: string | null = null) =>
  window.dispatchEvent(new CustomEvent(GRAMMAR_EVENT, { detail: pattern }));
export const normPattern = (b: string) => b.replace(/^[\s〜～~ー]+/, '').replace(/[\s。、]+$/, '').trim();

type Example = [string, number, string, string, string, string]; // youtube_id, start_ms, ja, th, f, e
interface Pattern {
  p: string;
  n: number;
  lv: string;
  e?: string;
  x: Example[];
}

const SEEN_KEY = 'umami_grammar_seen';
const loadSeen = (): Record<string, 1> => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
  } catch {
    return {};
  }
};

/** Japanese line with the grammar part highlighted. */
const Highlight: React.FC<{ ja: string; f: string }> = ({ ja, f }) => {
  const i = f ? ja.indexOf(f) : -1;
  if (i < 0) return <>{ja}</>;
  return (
    <>
      {ja.slice(0, i)}
      <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-4">{f}</span>
      {ja.slice(i + f.length)}
    </>
  );
};

/** Grammar library sheet (mounted once in App): patterns met in the clips' explanations, with real example lines. */
export const GrammarLibrary: React.FC = () => {
  const { videos, setActiveVideoId, setActiveTab } = useApp();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Pattern[] | null>(null);
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState<string | null>(null);
  const [seen, setSeen] = useState(loadSeen);
  const [limit, setLimit] = useState(80);
  useLockBodyScroll(open);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const p = (e as CustomEvent<string | null>).detail;
      setCurrent(p ? normPattern(p) : null);
      setOpen(true);
    };
    window.addEventListener(GRAMMAR_EVENT, onOpen);
    return () => window.removeEventListener(GRAMMAR_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open && !data) import('../data/grammar.json').then((m) => setData(m.default as unknown as Pattern[]));
  }, [open, data]);

  const byP = useMemo(() => new Map((data ?? []).map((g) => [g.p, g])), [data]);
  const list = useMemo(() => {
    const q = query.trim();
    return (data ?? []).filter((g) => !q || g.p.includes(q) || g.e?.includes(q) || g.x.some((x) => x[5]?.includes(q)));
  }, [data, query]);

  const g = current ? byP.get(current) : undefined;
  useEffect(() => {
    if (!g || seen[g.p]) return;
    const next = { ...seen, [g.p]: 1 as const };
    setSeen(next);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
    } catch {}
  }, [g?.p]); // eslint-disable-line react-hooks/exhaustive-deps

  const openClip = (yt: string) => {
    const v = videos.find((x) => x.youtube_id === yt);
    if (!v) return;
    setActiveVideoId(v.id);
    setActiveTab('player');
    setOpen(false);
  };

  if (!open) return null;
  const seenCount = Object.keys(seen).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-label="คลังไวยากรณ์"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="shrink-0 flex items-center gap-2 p-4 pb-2">
          {current && (
            <button onClick={() => setCurrent(null)} aria-label="กลับ" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="flex-1 text-base font-bold text-white">{current ? <span className="font-jp">{current}</span> : 'คลังไวยากรณ์'}</h2>
          <button onClick={() => setOpen(false)} aria-label="ปิด" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 space-y-3">
          {!data && <p className="text-sm text-slate-400">กำลังโหลด…</p>}

          {data && current && !g && <p className="text-sm text-slate-400">ยังไม่มีข้อมูลของรูปนี้ในคลัง (เจอน้อยกว่า 4 ครั้ง)</p>}

          {g && (
            <>
              <p className="text-xs text-slate-400">เจอในคลิป {g.n} ครั้ง</p>
              {g.e && <p className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-6 text-slate-200">{g.e}</p>}
              <p className="text-sm font-semibold text-slate-200">ตัวอย่างจากคลิป</p>
              {g.x.map((x, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <p className="font-jp text-lg font-bold text-white leading-relaxed">
                    <Highlight ja={x[2]} f={x[4]} />
                  </p>
                  {x[3] && <p className="text-sm text-emerald-300/90">{x[3]}</p>}
                  {x[5] && <p className="text-xs text-slate-300">💡 {x[5]}</p>}
                  <div className="flex gap-1.5 pt-0.5">
                    <button onClick={() => audioService.playJapanese(x[2])} className="min-h-9 px-2.5 rounded-lg bg-slate-800 text-xs text-slate-200 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> ฟัง
                    </button>
                    {videos.some((v) => v.youtube_id === x[0]) && (
                      <button onClick={() => openClip(x[0])} className="min-h-9 px-2.5 rounded-lg bg-slate-800 text-xs text-slate-200 flex items-center gap-1">
                        <Play className="w-3.5 h-3.5" /> เปิดคลิป
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {data && !current && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(80);
                  }}
                  placeholder="ค้นหา เช่น てしまう หรือ เสียแล้ว"
                  className="w-full min-h-11 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                {data.length} รูปไวยากรณ์จากคำอธิบายประโยคในคลิป เรียงจากที่เจอบ่อย · เปิดดูแล้ว {seenCount}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {list.slice(0, limit).map((p) => (
                  <button
                    key={p.p}
                    onClick={() => setCurrent(p.p)}
                    className={`text-left p-2.5 rounded-xl border ${seen[p.p] ? 'bg-slate-950 border-slate-800' : 'bg-slate-800/60 border-slate-700'}`}
                  >
                    <span className="block font-jp text-base font-bold text-white truncate">{p.p}</span>
                    <span className="block text-[11px] text-slate-400">
                      {seen[p.p] ? '✓ ' : ''}เจอ {p.n} ครั้ง
                    </span>
                  </button>
                ))}
              </div>
              {list.length > limit && (
                <button onClick={() => setLimit((l) => l + 80)} className="w-full min-h-11 rounded-xl bg-slate-800 text-sm text-slate-200">
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
export const GrammarCard: React.FC = () => (
  <button
    onClick={() => openGrammar(null)}
    className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left active:opacity-80"
  >
    <BookOpenCheck className="w-5 h-5 text-amber-300 shrink-0" />
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-bold text-white">คลังไวยากรณ์</span>
      <span className="block text-xs text-slate-400">รูปไวยากรณ์ที่เจอในคลิป พร้อมตัวอย่างจริง</span>
    </span>
  </button>
);
