import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { glossaryFor, linkWordIndexKey } from '../data/captions';
import { audioService } from '../utils/audioService';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { CalendarDays, Check, GraduationCap, Volume2, X } from 'lucide-react';

type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
const EXAM_KEY = 'umami_jlpt_exam';

/** One JLPT word as it appears in the clips: all word-index keys of the same lemma (conjugated readings). */
interface JWord {
  lemma: string;
  reading: string;
  ids: string[];
  meaning: string;
}

const shuffle = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

const loadExam = (): { level: Level; date: string } | null => {
  try {
    return JSON.parse(localStorage.getItem(EXAM_KEY) || 'null');
  } catch {
    return null;
  }
};

const daysUntil = (iso: string) => Math.ceil((new Date(`${iso}T00:00:00`).getTime() - Date.now()) / 86400000);

/** Words tab: JLPT vocabulary progress, "I know all of this level", a quick level check, mock tests, exam countdown. */
export const JlptPanel: React.FC = () => {
  const { wordStates, markWordsKnown, addXP, recordReview } = useApp();
  const [data, setData] = useState<Record<Level, string[]> | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<null | { kind: 'check' } | { kind: 'test'; level: Level }>(null);
  const [confirm, setConfirm] = useState<Level | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [exam, setExam] = useState(loadExam);
  useLockBodyScroll(open);

  useEffect(() => {
    import('../data/jlpt-words.json').then((m) => setData(m.default as unknown as Record<Level, string[]>));
  }, []);

  const words = useMemo(() => {
    if (!data) return null;
    const out = {} as Record<Level, JWord[]>;
    for (const lv of LEVELS) {
      const byLemma = new Map<string, JWord>();
      for (const key of data[lv]) {
        const cut = key.indexOf('|');
        const lemma = key.slice(0, cut);
        const reading = key.slice(cut + 1);
        const entry = linkWordIndexKey(key);
        const id = entry ? entry.id : `g:${key}`;
        const w = byLemma.get(lemma);
        if (w) {
          if (!w.ids.includes(id)) w.ids.push(id);
          // Show the dictionary-form reading (引っ張る ひっぱる, not the conjugated ひっぱっ).
          const tail = lemma.match(/[぀-ゟ]+$/)?.[0] ?? '';
          if (tail && !w.reading.endsWith(tail) && reading.endsWith(tail)) w.reading = reading;
          if (!w.meaning) w.meaning = entry?.core_meanings[0] ?? glossaryFor(lemma, reading)?.[0] ?? '';
        } else {
          byLemma.set(lemma, { lemma, reading, ids: [id], meaning: entry?.core_meanings[0] ?? glossaryFor(lemma, reading)?.[0] ?? '' });
        }
      }
      out[lv] = [...byLemma.values()];
    }
    return out;
  }, [data]);

  const isKnown = (w: JWord) => w.ids.some((id) => wordStates[id] === 'known');
  const stats = LEVELS.map((lv) => {
    const list = words?.[lv] ?? [];
    const known = list.filter(isKnown).length;
    return { lv, known, total: list.length, pct: list.length ? Math.round((known / list.length) * 100) : 0 };
  });

  const markLevel = (lv: Level) => {
    const n = markWordsKnown((words?.[lv] ?? []).flatMap((w) => w.ids));
    setConfirm(null);
    setToast(`ตั้งคำระดับ ${lv} เป็น "รู้แล้ว" ${n} รายการ`);
    setTimeout(() => setToast(null), 3000);
  };

  const target = exam ? stats.find((s) => s.lv === exam.level) : undefined;
  const left = exam ? daysUntil(exam.date) : null;

  return (
    <>
      {/* Compact card on the Words tab */}
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 space-y-2.5 active:opacity-80"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-300" />
          <span className="text-sm font-bold text-white flex-1">เตรียมสอบ JLPT</span>
          {exam && left !== null && left >= 0 && (
            <span className="text-xs font-semibold text-amber-300">
              {exam.level} อีก {left} วัน
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {stats.map((s) => (
            <div key={s.lv} className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">{s.lv}</span>
                <span>{words ? `${s.pct}%` : '…'}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-400" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="เตรียมสอบ JLPT"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[88vh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">เตรียมสอบ JLPT</h2>
              <button onClick={() => setOpen(false)} aria-label="ปิด" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {mode?.kind === 'check' && words ? (
              <LevelCheck words={words} onDone={(lvs) => { lvs.forEach(markLevel); setMode(null); }} onCancel={() => setMode(null)} />
            ) : mode?.kind === 'test' && words ? (
              <MockTest
                level={mode.level}
                words={words[mode.level]}
                pool={LEVELS.flatMap((l) => words[l])}
                onAnswer={(ok) => {
                  recordReview();
                  if (ok) addXP('reading', 2);
                }}
                onClose={() => setMode(null)}
              />
            ) : (
              <>
                {/* Exam countdown */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-amber-300" /> วันสอบ
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={exam?.level ?? 'N5'}
                      onChange={(e) => {
                        const next = { level: e.target.value as Level, date: exam?.date ?? '' };
                        setExam(next);
                        localStorage.setItem(EXAM_KEY, JSON.stringify(next));
                      }}
                      className="min-h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    >
                      {LEVELS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={exam?.date ?? ''}
                      onChange={(e) => {
                        const next = { level: exam?.level ?? 'N5', date: e.target.value };
                        setExam(next);
                        localStorage.setItem(EXAM_KEY, JSON.stringify(next));
                      }}
                      className="flex-1 min-h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  {exam?.date && left !== null && target && (
                    <p className="text-xs text-slate-300">
                      {left >= 0 ? `อีก ${left} วันถึงวันสอบ ${exam.level}` : 'วันสอบผ่านไปแล้ว'} · รู้คำศัพท์ {exam.level} แล้ว {target.pct}%
                      {left > 0 && target.total > target.known && ` · ควรเพิ่มวันละ ~${Math.ceil((target.total - target.known) / left)} คำ`}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">JLPT ในไทยสอบปีละ 2 ครั้ง: อาทิตย์แรกของกรกฎาคมและธันวาคม</p>
                </div>

                {/* Levels */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-200">คำศัพท์ JLPT ที่เจอในคลิป</p>
                  {stats.map((s) => (
                    <div key={s.lv} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white w-8">{s.lv}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-indigo-400" style={{ width: `${s.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-300 w-24 text-right">
                          {s.known}/{s.total} คำ
                        </span>
                      </div>
                      {confirm === s.lv ? (
                        <div className="flex items-center gap-2">
                          <p className="flex-1 text-xs text-amber-200">ตั้งทุกคำ {s.lv} เป็น "รู้แล้ว"? คำที่กำลังเรียนอยู่จะไม่เปลี่ยน</p>
                          <button onClick={() => markLevel(s.lv)} className="min-h-10 px-3 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold">
                            ตกลง
                          </button>
                          <button onClick={() => setConfirm(null)} className="min-h-10 px-2 text-sm text-slate-400">
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMode({ kind: 'test', level: s.lv })}
                            disabled={!words}
                            className="flex-1 min-h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-40"
                          >
                            ข้อสอบจำลอง
                          </button>
                          <button
                            onClick={() => setConfirm(s.lv)}
                            disabled={!words || s.known === s.total}
                            className="min-h-10 px-3 rounded-xl bg-slate-800 text-slate-200 text-sm disabled:opacity-40"
                          >
                            รู้หมดแล้ว
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setMode({ kind: 'check' })}
                  disabled={!words}
                  className="w-full min-h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40"
                >
                  วัดระดับคำศัพท์ (2 นาที)
                </button>
                <p className="text-[11px] text-slate-500">
                  เปอร์เซ็นต์คิดจากคำในรายการ JLPT ที่ปรากฏในคลิปของแอป · คำที่ตั้งว่ารู้แล้วจะนับใน "รู้ X%" ของคลิปและไม่ถูกใส่เป็นการ์ดใหม่
                </p>
              </>
            )}
            {toast && <p className="text-sm text-emerald-300 flex items-center gap-1.5"><Check className="w-4 h-4" /> {toast}</p>}
          </div>
        </div>
      )}
    </>
  );
};

/** 25 frequent words (5 per level): know / don't know. Suggests marking every level answered ≥ 80% known. */
const LevelCheck: React.FC<{ words: Record<Level, JWord[]>; onDone: (levels: Level[]) => void; onCancel: () => void }> = ({ words, onDone, onCancel }) => {
  const items = useMemo(() => LEVELS.flatMap((lv) => shuffle(words[lv].filter((w) => w.meaning).slice(0, 60)).slice(0, 5).map((w) => ({ lv, w }))), [words]);
  const [i, setI] = useState(0);
  const [known, setKnown] = useState<Record<Level, number>>({ N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 });
  const [showMeaning, setShowMeaning] = useState(false);

  if (i >= items.length) {
    // Levels count only while every easier level also passed.
    const pass: Level[] = [];
    for (const lv of LEVELS) {
      if (known[lv] >= 4) pass.push(lv);
      else break;
    }
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-200">ผลวัดระดับ</p>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {LEVELS.map((lv) => (
            <div key={lv} className={`p-2 rounded-xl border ${pass.includes(lv) ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-950 border-slate-800'}`}>
              <p className="text-xs font-bold text-white">{lv}</p>
              <p className="text-xs text-slate-300">{known[lv]}/5</p>
            </div>
          ))}
        </div>
        {pass.length ? (
          <>
            <p className="text-sm text-slate-300">ดูเหมือนคุณรู้คำระดับ {pass.join(', ')} ส่วนใหญ่แล้ว ตั้งคำระดับนี้เป็น "รู้แล้ว" เลยไหม? (ตั้งคืนทีละคำได้)</p>
            <button onClick={() => onDone(pass)} className="w-full min-h-12 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
              ตั้งคำ {pass.join(', ')} เป็นรู้แล้ว
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-300">เริ่มจากคลิประดับ N5 ได้เลย กดจำคำในคลิปแล้วเปอร์เซ็นต์จะขึ้นเอง</p>
        )}
        <button onClick={onCancel} className="w-full min-h-11 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold">
          กลับ
        </button>
      </div>
    );
  }

  const { w } = items[i];
  const answer = (ok: boolean) => {
    if (ok) setKnown((k) => ({ ...k, [items[i].lv]: k[items[i].lv] + 1 }));
    setShowMeaning(false);
    setI(i + 1);
  };
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        คำที่ {i + 1}/{items.length} · รู้ความหมายคำนี้ไหม?
      </p>
      <div className="text-center py-4">
        <p className="text-4xl font-jp font-extrabold text-white">{w.lemma}</p>
        {w.reading !== w.lemma && <p className="text-sm text-slate-400 font-jp mt-1">{w.reading}</p>}
        {showMeaning ? (
          <p className="text-base text-emerald-300 mt-2">{w.meaning}</p>
        ) : (
          <button onClick={() => setShowMeaning(true)} className="mt-2 min-h-9 px-3 text-xs text-slate-500">
            ดูความหมาย
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => answer(false)} className="min-h-12 rounded-2xl bg-slate-800 text-slate-100 font-semibold">
          ไม่รู้
        </button>
        <button onClick={() => answer(true)} className="min-h-12 rounded-2xl bg-emerald-600 text-white font-bold">
          รู้
        </button>
      </div>
      <button onClick={onCancel} className="w-full min-h-10 text-sm text-slate-500">
        ยกเลิก
      </button>
    </div>
  );
};

/** 15 questions for one level: 10 "word → meaning" and 5 "listen → meaning". */
const MockTest: React.FC<{ level: Level; words: JWord[]; pool: JWord[]; onAnswer: (ok: boolean) => void; onClose: () => void }> = ({
  level,
  words,
  pool,
  onAnswer,
  onClose,
}) => {
  const qs = useMemo(() => {
    const usable = shuffle(words.filter((w) => w.meaning)).slice(0, 15);
    const meanings = [...new Set(pool.map((w) => w.meaning).filter(Boolean))];
    return usable.map((w, i) => {
      const options = shuffle([w.meaning, ...shuffle(meanings.filter((m) => m !== w.meaning)).slice(0, 3)]);
      return { w, listen: i >= 10, options, answer: options.indexOf(w.meaning) };
    });
  }, [words, pool]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<JWord[]>([]);
  const q = qs[i];

  useEffect(() => {
    if (q?.listen) audioService.playJapanese(q.w.lemma);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q) {
    const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
    return (
      <div className="space-y-3">
        <p className="text-center text-4xl font-extrabold text-white">
          {score}/{qs.length}
        </p>
        <p className="text-center text-sm text-slate-300">
          {pct >= 80 ? `คำศัพท์ ${level} แน่นแล้ว 🎉` : pct >= 60 ? `เกือบผ่าน ทบทวนคำ ${level} อีกนิด` : `ยังต้องฝึกคำ ${level} อีกเยอะ ลองดูคลิประดับนี้เพิ่ม`}
        </p>
        {missed.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">คำที่ตอบผิด</p>
            {missed.map((w) => (
              <p key={w.lemma} className="text-sm text-slate-300">
                <span className="font-jp font-bold text-white">{w.lemma}</span> ({w.reading}) — {w.meaning}
              </p>
            ))}
          </div>
        )}
        <button onClick={onClose} className="w-full min-h-11 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold">
          กลับ
        </button>
      </div>
    );
  }

  const pick = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    const ok = k === q.answer;
    onAnswer(ok);
    if (ok) setScore((s) => s + 1);
    else setMissed((m) => [...m, q.w]);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        ข้อสอบจำลอง {level} · ข้อ {i + 1}/{qs.length} · {q.listen ? 'ฟังแล้วเลือกความหมาย' : 'คำนี้แปลว่าอะไร'}
      </p>
      <div className="text-center py-3">
        {q.listen && picked === null ? (
          <button onClick={() => audioService.playJapanese(q.w.lemma)} aria-label="ฟังอีกครั้ง" className="w-16 h-16 rounded-full bg-indigo-600 grid place-items-center text-white mx-auto">
            <Volume2 className="w-7 h-7" />
          </button>
        ) : (
          <>
            <p className="text-3xl font-jp font-extrabold text-white">{q.w.lemma}</p>
            {q.w.reading !== q.w.lemma && <p className="text-sm text-slate-400 font-jp">{q.w.reading}</p>}
          </>
        )}
      </div>
      <div className="grid gap-2">
        {q.options.map((o, k) => (
          <button
            key={k}
            onClick={() => pick(k)}
            className={`min-h-12 px-4 rounded-xl border text-left text-sm ${
              picked === null
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : k === q.answer
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                : k === picked
                ? 'bg-rose-500/20 border-rose-400 text-rose-100'
                : 'bg-slate-800/60 border-slate-800 text-slate-500'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <button
          onClick={() => {
            setI(i + 1);
            setPicked(null);
          }}
          className="w-full min-h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold"
        >
          {i + 1 < qs.length ? 'ข้อต่อไป' : 'ดูผล'}
        </button>
      )}
      <button onClick={onClose} className="w-full min-h-10 text-sm text-slate-500">
        ออก
      </button>
    </div>
  );
};
