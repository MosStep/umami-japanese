import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SubtitleLineRecord } from '../schema/databaseSchema';
import { buildClipQuiz, harvestWords, QuizQuestion } from '../utils/clipQuiz';
import { saveQuizScore } from '../utils/clipProgress';
import { audioService } from '../utils/audioService';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { Check, Volume2, X } from 'lucide-react';

interface Props {
  youtubeId: string;
  lines: SubtitleLineRecord[];
  /** Finished the clip (true) or opened the quiz by hand from the transcript (false). */
  finished: boolean;
  /** Rewatch with the translation hidden: lines heard and lines understood without opening the Thai. */
  rewatch?: { heard: number; understood: number };
  onClose: () => void;
}

const QUESTION_TITLE: Record<QuizQuestion['kind'], string> = {
  meaning: 'คำนี้แปลว่าอะไร',
  listen: 'ฟังแล้วเลือกความหมาย',
  sentence: 'ประโยคนี้แปลว่าอะไร',
  cloze: 'เติมคำในช่องว่าง',
  order: 'เรียงคำให้เป็นประโยค',
};

/** End-of-clip sheet: optional 5-question quiz, then new words from the clip to add to the flashcards. */
export const ClipFinishSheet: React.FC<Props> = ({ youtubeId, lines, finished, rewatch, onClose }) => {
  const { getWordStatus, setWordStatus, addXP, recordReview, setActiveTab } = useApp();
  useLockBodyScroll(true);

  const quiz = useMemo(() => buildClipQuiz(lines, getWordStatus), [lines]); // built once per sheet
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>(finished ? 'intro' : 'quiz');
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState(false);

  const harvest = useMemo(
    () => (step === 'result' || step === 'intro' ? harvestWords(lines, getWordStatus, missed) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, missed],
  );
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const chosen = selected ?? new Set(harvest.map((w) => w.id));

  const q = quiz[qi];
  const answered = q ? (q.kind === 'order' ? orderChecked : picked !== null) : false;
  const correct =
    q && answered
      ? q.kind === 'order'
        ? order.map((i) => q.pieces[i]).join('') === q.pieces.join('')
        : picked === q.answer
      : false;

  const finishAnswer = (ok: boolean) => {
    recordReview();
    if (ok) {
      setScore((s) => s + 1);
      addXP('reading', 3);
    } else if (q && 'word' in q) {
      setMissed((m) => new Set(m).add(q.word.id));
    }
  };

  const pick = (i: number) => {
    if (!q || q.kind === 'order' || picked !== null) return;
    setPicked(i);
    finishAnswer(i === q.answer);
  };

  const checkOrder = () => {
    if (!q || q.kind !== 'order') return;
    setOrderChecked(true);
    finishAnswer(order.map((i) => q.pieces[i]).join('') === q.pieces.join(''));
  };

  const next = () => {
    if (qi + 1 < quiz.length) {
      setQi(qi + 1);
      setPicked(null);
      setOrder([]);
      setOrderChecked(false);
      if (quiz[qi + 1].kind === 'listen') audioService.playJapanese((quiz[qi + 1] as { word: { lemma: string } }).word.lemma);
    } else {
      saveQuizScore(youtubeId, score);
      setSelected(null);
      setStep('result');
    }
  };

  const startQuiz = () => {
    setStep('quiz');
    if (quiz[0]?.kind === 'listen') audioService.playJapanese(quiz[0].word.lemma);
  };

  const addWords = () => {
    for (const id of chosen) setWordStatus(id, 'learning');
    setAdded(true);
  };

  const toggle = (id: string) => {
    const s = new Set(chosen);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const optionClass = (i: number) => {
    if (picked === null) return 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700';
    if (q && q.kind !== 'order' && i === q.answer) return 'bg-emerald-500/20 border-emerald-400 text-emerald-100';
    if (i === picked) return 'bg-rose-500/20 border-rose-400 text-rose-100';
    return 'bg-slate-800/60 border-slate-800 text-slate-500';
  };

  const harvestBlock = harvest.length > 0 && (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-200">คำใหม่จากคลิปนี้ ({harvest.length})</p>
      <div className="flex flex-wrap gap-1.5">
        {harvest.map((w) => {
          const on = chosen.has(w.id);
          return (
            <button
              key={w.id}
              onClick={() => !added && toggle(w.id)}
              aria-pressed={on}
              className={`min-h-10 px-3 rounded-xl border text-left text-sm transition-colors ${
                on ? 'bg-indigo-500/20 border-indigo-400 text-white' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <span className="font-jp font-bold">{w.lemma}</span>
              <span className="text-xs text-slate-400"> · {w.meaning}</span>
            </button>
          );
        })}
      </div>
      {added ? (
        <div className="flex items-center gap-2">
          <p className="flex-1 text-sm text-emerald-300 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> เพิ่มเข้าคลังฝึกแล้ว
          </p>
          <button
            onClick={() => {
              onClose();
              setActiveTab('dojo');
            }}
            className="min-h-11 px-4 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold"
          >
            ไปฝึกเลย
          </button>
        </div>
      ) : (
        <button
          onClick={addWords}
          disabled={chosen.size === 0}
          className="w-full min-h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-bold"
        >
          เพิ่ม {chosen.size} คำเข้าคลังฝึก
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-label={finished ? 'จบคลิป' : 'แบบทดสอบคลิป'}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))] space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {step === 'quiz' && q ? `ข้อ ${qi + 1}/${quiz.length} · ${QUESTION_TITLE[q.kind]}` : step === 'result' ? 'ผลแบบทดสอบ' : 'จบคลิปแล้ว 🎉'}
          </h2>
          <button onClick={onClose} aria-label="ปิด" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <>
            {rewatch && rewatch.heard > 0 && (
              <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-100">
                ดูรอบนี้เข้าใจเองโดยไม่เปิดคำแปล {rewatch.understood}/{rewatch.heard} ประโยค
              </p>
            )}
            {quiz.length >= 3 ? (
              <button onClick={startQuiz} className="w-full min-h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                ทำแบบทดสอบ {quiz.length} ข้อ
              </button>
            ) : (
              <p className="text-sm text-slate-400">คลิปนี้มีคำศัพท์ไม่พอทำแบบทดสอบ</p>
            )}
            {harvestBlock}
          </>
        )}

        {step === 'quiz' && !q && <p className="text-sm text-slate-400">คลิปนี้มีคำศัพท์ไม่พอทำแบบทดสอบ</p>}

        {step === 'quiz' && q && (
          <div className="space-y-3">
            {q.kind === 'meaning' && (
              <p className="text-center py-3">
                <span className="block text-3xl font-jp font-extrabold text-white">{q.word.lemma}</span>
                {q.word.reading && q.word.reading !== q.word.lemma && <span className="text-sm text-slate-400 font-jp">{q.word.reading}</span>}
              </p>
            )}
            {q.kind === 'listen' && (
              <div className="flex flex-col items-center gap-2 py-2">
                <button
                  onClick={() => audioService.playJapanese(q.word.lemma)}
                  aria-label="ฟังอีกครั้ง"
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 grid place-items-center text-white"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                {picked !== null && <span className="text-xl font-jp font-bold text-white">{q.word.lemma}</span>}
              </div>
            )}
            {q.kind === 'sentence' && <p className="text-center py-2 text-xl font-jp font-bold text-white leading-relaxed">{q.line.raw_text}</p>}
            {q.kind === 'cloze' && (
              <div className="text-center py-2 space-y-1">
                <p className="text-xl font-jp font-bold text-white leading-relaxed">
                  {q.line.tokens_json.map((t, i) =>
                    i === q.blank ? (
                      <span key={i} className="inline-block min-w-12 mx-0.5 border-b-2 border-amber-400 text-amber-300">
                        {picked !== null ? t.surface : ' '}
                      </span>
                    ) : (
                      <span key={i}>{t.surface}</span>
                    ),
                  )}
                </p>
                <p className="text-sm text-emerald-300/90">{q.line.thai_translation || q.line.natural_translation}</p>
              </div>
            )}

            {q.kind !== 'order' && (
              <div className="grid gap-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className={`min-h-12 px-4 py-2 rounded-xl border text-left text-sm leading-6 transition-colors ${q.kind === 'cloze' ? 'font-jp text-base' : ''} ${optionClass(i)}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.kind === 'order' && (
              <div className="space-y-3">
                <p className="text-sm text-emerald-300/90 text-center">{q.line.thai_translation || q.line.natural_translation}</p>
                <div
                  className={`min-h-14 p-2 rounded-xl border flex flex-wrap gap-1.5 ${
                    orderChecked ? (correct ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-400 bg-rose-500/10') : 'border-slate-700 bg-slate-950/60'
                  }`}
                >
                  {order.map((pi, k) => (
                    <button
                      key={k}
                      disabled={orderChecked}
                      onClick={() => setOrder(order.filter((_, j) => j !== k))}
                      className="min-h-10 px-3 rounded-lg bg-indigo-500/25 border border-indigo-400/60 text-white font-jp text-base"
                    >
                      {q.pieces[pi]}
                    </button>
                  ))}
                </div>
                {orderChecked && !correct && <p className="text-sm text-slate-300 font-jp text-center">เฉลย: {q.line.raw_text}</p>}
                {!orderChecked && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {q.shuffled.map((pi) =>
                      order.includes(pi) ? null : (
                        <button
                          key={pi}
                          onClick={() => setOrder([...order, pi])}
                          className="min-h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-jp text-base hover:bg-slate-700"
                        >
                          {q.pieces[pi]}
                        </button>
                      ),
                    )}
                  </div>
                )}
                {!orderChecked && (
                  <button
                    onClick={checkOrder}
                    disabled={order.length !== q.pieces.length}
                    className="w-full min-h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-bold"
                  >
                    ตรวจคำตอบ
                  </button>
                )}
              </div>
            )}

            {answered && (
              <button onClick={next} className="w-full min-h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                {correct ? 'ถูกต้อง! ' : 'ยังไม่ถูก · '}
                {qi + 1 < quiz.length ? 'ข้อต่อไป' : 'ดูผล'}
              </button>
            )}
          </div>
        )}

        {step === 'result' && (
          <>
            <div className="text-center py-2">
              <p className="text-4xl font-extrabold text-white">
                {score}/{quiz.length}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {score === quiz.length ? 'เต็ม! เข้าใจคลิปนี้ดีมาก 🎉' : score >= quiz.length - 2 ? 'เก่งมาก เกือบเต็มแล้ว' : 'ลองดูคลิปนี้อีกรอบ แล้วจะเข้าใจมากขึ้น'}
              </p>
            </div>
            {harvestBlock}
            {harvest.length === 0 && (
              <button onClick={onClose} className="w-full min-h-11 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold">
                ปิด
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
