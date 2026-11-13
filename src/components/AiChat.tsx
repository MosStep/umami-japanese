import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CHAT_SCENARIOS, ChatLevel, ChatScenario } from '../data/chatScenarios';
import {
  AiHint,
  ChatTurn,
  addChatLog,
  hintSystemPrompt,
  hintUserPrompt,
  isThaiOnly,
  parseHints,
  parseReply,
  parseTeach,
  replySystemPrompt,
  replyUserPrompt,
  rubySegments,
  stripReadings,
  teachSystemPrompt,
} from '../utils/aiChat';
import { audioService } from '../utils/audioService';
import { startJapaneseRecognition, stopRecognition } from '../utils/speech';
import { localDayKey } from '../utils/streak';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { ArrowLeft, Check, Languages, Lightbulb, Mic, Send, Square, Volume2, VolumeX } from 'lucide-react';

const AUTOSPEAK_KEY = 'umami_chat_autospeak';
const LEVELS: ('all' | ChatLevel)[] = ['all', 'N5', 'N4', 'N3'];

/** Japanese with furigana from kanji[reading] marks. */
const Ruby: React.FC<{ text: string; readings: boolean }> = ({ text, readings }) => (
  <>
    {rubySegments(text).map((s, i) =>
      s.reading && readings ? (
        <ruby key={i}>
          {s.text}
          <rt className="text-[10px] font-normal text-slate-400">{s.reading}</rt>
        </ruby>
      ) : (
        <span key={i}>{s.text}</span>
      ),
    )}
  </>
);

/** ฝึก → คุยกับ AI: pick a situation, then talk (mic or keyboard) with hints, gentle corrections and a summary. */
export const AiChat: React.FC = () => {
  const { callAICompletion, apiKey, aiProvider, setShowSettingsModal, addXP, recordReview, readingGuideMode } = useApp();
  const readings = readingGuideMode !== 'off';
  const hasKey = aiProvider !== 'local' && apiKey.trim().length > 0;

  const [level, setLevel] = useState<'all' | ChatLevel>('all');
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState<null | 'reply' | 'hint' | 'teach'>(null);
  const [error, setError] = useState<string | null>(null);
  const [hints, setHints] = useState<AiHint[] | null>(null);
  const [teach, setTeach] = useState<(AiHint & { asked: string }) | null>(null);
  const [shownTh, setShownTh] = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem(AUTOSPEAK_KEY) !== 'off');
  const byVoiceRef = useRef(false);
  const loggedRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(!!scenario);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns.length, busy, hints, teach, error]);

  // Leaving the screen stops the microphone.
  useEffect(() => () => void stopRecognition(), []);

  const speak = (ja: string) => audioService.playJapanese(stripReadings(ja));

  const open = (sc: ChatScenario) => {
    setScenario(sc);
    setTurns([{ role: 'ai', ja: sc.opening.ja, th: sc.opening.th }]);
    setDone([]);
    setEnded(false);
    setInput('');
    setError(null);
    setHints(null);
    setTeach(null);
    setShownTh({});
    setShowSummary(false);
    loggedRef.current = false;
    if (autoSpeak) speak(sc.opening.ja);
  };

  const close = () => {
    void stopRecognition();
    setListening(false);
    setScenario(null);
  };

  const userTurns = turns.filter((t) => t.role === 'user').length;

  /** Asks the model for its next line after `history` (which ends with the learner's message). */
  const requestReply = async (sc: ChatScenario, history: ChatTurn[], doneNow: string[]) => {
    setBusy('reply');
    setError(null);
    try {
      let reply;
      let raw = '';
      for (let attempt = 0; attempt < 2 && !reply; attempt++) {
        raw = await callAICompletion(replyUserPrompt(history, doneNow), replySystemPrompt(sc));
        try {
          reply = parseReply(raw);
        } catch {
          /* retry once */
        }
      }
      if (!reply) {
        // The context returns its own Thai message when the key is missing or the call failed.
        setError(/[฀-๿]/.test(raw) && raw.length < 300 ? raw : 'AI ตอบไม่สำเร็จ ลองส่งอีกครั้ง');
        return;
      }
      const valid = new Set(sc.goals.map((g) => g.id));
      const nextDone = [...new Set([...doneNow, ...reply.done.filter((id) => valid.has(id))])];
      const fixed = history.map((t, i) => (i === history.length - 1 && reply.fix ? { ...t, fix: reply.fix } : t));
      setTurns([...fixed, { role: 'ai', ja: reply.ja, th: reply.th }]);
      setDone(nextDone);
      if (reply.end || (sc.goals.length > 0 && nextDone.length === sc.goals.length)) setEnded(true);
      recordReview();
      addXP(byVoiceRef.current ? 'shadowing' : 'reading', 4);
      addXP('listening', 3);
      if (autoSpeak) speak(reply.ja);
    } finally {
      setBusy(null);
    }
  };

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!scenario || !text || busy) return;
    if (listening) {
      void stopRecognition();
      setListening(false);
    }
    setInput('');
    setHints(null);
    if (isThaiOnly(text)) {
      // Thai input = "how do I say this?": teach the sentence instead of answering in character.
      setBusy('teach');
      setError(null);
      try {
        const raw = await callAICompletion(`The learner wants to say (Thai): ${text}`, teachSystemPrompt(scenario));
        try {
          setTeach({ ...parseTeach(raw), asked: text });
        } catch {
          setError(/[฀-๿]/.test(raw) && raw.length < 300 ? raw : 'AI ตอบไม่สำเร็จ ลองอีกครั้ง');
        }
      } finally {
        setBusy(null);
      }
      return;
    }
    setTeach(null);
    const history: ChatTurn[] = [...turns, { role: 'user', ja: text }];
    setTurns(history);
    await requestReply(scenario, history, done);
    byVoiceRef.current = false;
  };

  const retry = () => {
    if (scenario && turns[turns.length - 1]?.role === 'user') void requestReply(scenario, turns, done);
  };

  const askHint = async () => {
    if (!scenario || busy) return;
    setBusy('hint');
    setError(null);
    try {
      const raw = await callAICompletion(hintUserPrompt(scenario, turns, done), hintSystemPrompt(scenario));
      try {
        const list = parseHints(raw);
        if (list.length) setHints(list);
        else setError('ยังไม่มีคำแนะนำ ลองอีกครั้ง');
      } catch {
        setError(/[฀-๿]/.test(raw) && raw.length < 300 ? raw : 'ขอคำแนะนำไม่สำเร็จ ลองอีกครั้ง');
      }
    } finally {
      setBusy(null);
    }
  };

  const toggleMic = async () => {
    if (listening) {
      await stopRecognition();
      setListening(false);
      return;
    }
    setError(null);
    byVoiceRef.current = true;
    const ok = await startJapaneseRecognition(
      (partial) => setInput(partial),
      (final) => {
        setListening(false);
        if (final) setInput(final);
      },
      (msg) => {
        setListening(false);
        setError(msg);
      },
      (warn) => setError(warn),
    );
    setListening(ok);
  };

  const openSummary = () => {
    if (scenario && !loggedRef.current && userTurns > 0) {
      loggedRef.current = true;
      addChatLog({ id: scenario.id, day: localDayKey(new Date()), turns: userTurns, done: done.length, goals: scenario.goals.length });
    }
    setShowSummary(true);
  };

  const toggleAutoSpeak = () => {
    const next = !autoSpeak;
    setAutoSpeak(next);
    localStorage.setItem(AUTOSPEAK_KEY, next ? 'on' : 'off');
  };

  // ── Situation picker ────────────────────────────────────────────────────────────────────────────
  if (!scenario) {
    const list = CHAT_SCENARIOS.filter((s) => level === 'all' || s.level === level);
    return (
      <div className="space-y-4">
        {!hasKey && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2">
            <p className="text-sm text-amber-100">การคุยกับ AI ต้องใช้คีย์ Tenixe ใส่ครั้งเดียวใน ⚙️ ตั้งค่า</p>
            <button onClick={() => setShowSettingsModal(true)} className="min-h-11 px-4 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold">
              เปิดตั้งค่า
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              aria-pressed={level === lv}
              className={`min-h-10 px-4 rounded-full text-sm font-semibold ${level === lv ? 'bg-slate-100 text-slate-900' : 'bg-slate-800/80 text-slate-300'}`}
            >
              {lv === 'all' ? 'ทั้งหมด' : lv}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((sc) => (
            <button
              key={sc.id}
              onClick={() => open(sc)}
              className="text-left p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 active:opacity-80 flex gap-3"
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {sc.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{sc.title}</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300">{sc.level}</span>
                </span>
                <span className="block text-sm text-slate-400 mt-0.5">{sc.intro}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">พูดหรือพิมพ์ภาษาญี่ปุ่นได้ ถ้านึกไม่ออกพิมพ์ภาษาไทย แล้ว AI จะสอนประโยคให้</p>
      </div>
    );
  }

  // ── Conversation (full screen) ──────────────────────────────────────────────────────────────────
  const fixes = turns.filter((t) => t.role === 'user' && t.fix);
  const lastIsUser = turns[turns.length - 1]?.role === 'user';

  return (
    <div className="fixed inset-0 z-[45] bg-slate-950 flex flex-col pt-[var(--sat)] h-[100dvh]">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-2 py-2 border-b border-slate-800">
        <button onClick={close} aria-label="กลับ" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">
            {scenario.emoji} {scenario.title}
          </p>
          <p className="text-xs text-slate-400 truncate">คุยกับ: {scenario.partner}</p>
        </div>
        <button
          onClick={toggleAutoSpeak}
          aria-pressed={autoSpeak}
          aria-label={autoSpeak ? 'ปิดเสียงอ่านอัตโนมัติ' : 'เปิดเสียงอ่านอัตโนมัติ'}
          className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800"
        >
          {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
        <button onClick={openSummary} className="min-h-11 px-3 rounded-xl bg-slate-800 text-sm font-semibold text-slate-100">
          สรุป
        </button>
      </div>

      {/* Tasks */}
      {scenario.goals.length > 0 && (
        <div className="shrink-0 px-3 py-2 border-b border-slate-800/70 flex flex-wrap gap-1.5">
          {scenario.goals.map((g) => {
            const ok = done.includes(g.id);
            return (
              <span
                key={g.id}
                className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 ${ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800/80 text-slate-300'}`}
              >
                {ok ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-500" />}
                {g.th}
              </span>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 space-y-3">
        {turns.map((t, i) =>
          t.role === 'ai' ? (
            <div key={i} className="max-w-[88%] space-y-1">
              <div className="p-3 rounded-2xl rounded-tl-md bg-slate-800 text-white">
                <p className="font-jp text-lg font-bold leading-[2.1]">
                  <Ruby text={t.ja} readings={readings} />
                </p>
                {shownTh[i] && t.th && <p className="mt-1 pt-1 border-t border-slate-700 text-sm text-emerald-300">{t.th}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => speak(t.ja)} aria-label="ฟังอีกครั้ง" className="min-h-9 min-w-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800">
                  <Volume2 className="w-4 h-4" />
                </button>
                {t.th && (
                  <button
                    onClick={() => setShownTh((s) => ({ ...s, [i]: !s[i] }))}
                    className="min-h-9 px-2 flex items-center gap-1 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                  >
                    <Languages className="w-4 h-4" /> {shownTh[i] ? 'ซ่อนคำแปล' : 'คำแปล'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="ml-auto max-w-[88%] space-y-1">
              <div className="p-3 rounded-2xl rounded-tr-md bg-rose-600 text-white font-jp text-base font-semibold">{t.ja}</div>
              {t.fix && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left">
                  <p className="text-xs text-amber-300 mb-0.5">พูดแบบนี้จะเป็นธรรมชาติกว่า</p>
                  <p className="font-jp text-base font-bold text-white leading-[2]">
                    <Ruby text={t.fix.ja} readings={readings} />
                  </p>
                  {t.fix.note && <p className="text-xs text-slate-300 mt-0.5">{t.fix.note}</p>}
                </div>
              )}
            </div>
          ),
        )}

        {busy === 'reply' && <p className="text-sm text-slate-400 animate-pulse">{scenario.partner.split(' ')[0]} กำลังตอบ…</p>}

        {teach && (
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 space-y-1.5">
            <p className="text-xs text-indigo-300">"{teach.asked}" พูดว่า</p>
            <p className="font-jp text-lg font-bold text-white leading-[2.1]">
              <Ruby text={teach.ja} readings={readings} />
            </p>
            {teach.th && <p className="text-xs text-slate-300">{teach.th}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => speak(teach.ja)} className="min-h-10 px-3 rounded-xl bg-slate-800 text-sm text-slate-100 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> ฟัง
              </button>
              <button
                onClick={() => {
                  setInput(stripReadings(teach.ja));
                  setTeach(null);
                }}
                className="min-h-10 px-3 rounded-xl bg-indigo-600 text-sm font-semibold text-white"
              >
                ใช้ประโยคนี้
              </button>
            </div>
          </div>
        )}

        {hints && (
          <div className="space-y-1.5">
            <p className="text-xs text-slate-400">ลองพูดแบบนี้ (แตะเพื่อใส่ในช่องพิมพ์)</p>
            {hints.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(stripReadings(h.ja));
                  setHints(null);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50"
              >
                <span className="block font-jp text-base font-bold text-white leading-[2]">
                  <Ruby text={h.ja} readings={readings} />
                </span>
                <span className="block text-xs text-slate-400">{h.th}</span>
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-sm text-rose-200 flex items-center gap-2">
            <span className="flex-1">{error}</span>
            {lastIsUser && !busy && (
              <button onClick={retry} className="min-h-10 px-3 rounded-lg bg-slate-800 text-slate-100 text-sm font-semibold shrink-0">
                ลองอีกครั้ง
              </button>
            )}
          </div>
        )}

        {ended && !showSummary && (
          <button onClick={openSummary} className="w-full min-h-12 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
            🎉 ทำภารกิจครบแล้ว ดูสรุป
          </button>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-slate-800 px-2 pt-2 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))] space-y-2 bg-slate-950">
        {listening && <p className="px-2 text-xs text-rose-300 animate-pulse">กำลังฟัง… พูดภาษาญี่ปุ่นได้เลย แตะ ■ เมื่อพูดจบ</p>}
        <div className="flex items-end gap-1.5">
          <button
            onClick={askHint}
            disabled={!!busy}
            aria-label="ช่วยด้วย"
            title="ช่วยด้วย: ขอประโยคตัวอย่าง"
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-slate-800 text-amber-300 disabled:opacity-40"
          >
            <Lightbulb className={`w-5 h-5 ${busy === 'hint' ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={toggleMic}
            disabled={!!busy}
            aria-label={listening ? 'หยุดฟัง' : 'พูด'}
            className={`min-h-12 min-w-12 flex items-center justify-center rounded-2xl disabled:opacity-40 ${
              listening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-100'
            }`}
          >
            {listening ? <Square className="w-5 h-5 fill-white" /> : <Mic className="w-5 h-5" />}
          </button>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (!listening) byVoiceRef.current = false;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="พิมพ์ญี่ปุ่นหรือไทย"
            className="flex-1 min-h-12 max-h-28 px-3 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-base text-white placeholder:text-slate-500 placeholder:text-sm resize-none focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={() => void send()}
            disabled={!input.trim() || !!busy}
            aria-label="ส่ง"
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-rose-600 text-white disabled:opacity-40"
          >
            <Send className={`w-5 h-5 ${busy === 'teach' ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary */}
      {showSummary && (
        <div className="absolute inset-0 z-10 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowSummary(false)}>
          <div
            role="dialog"
            aria-label="สรุปการคุย"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))] space-y-4"
          >
            <h2 className="text-lg font-bold text-white">
              {scenario.emoji} สรุป: {scenario.title}
            </h2>
            <p className="text-sm text-slate-300">
              คุยไป {userTurns} ประโยค
              {scenario.goals.length > 0 && ` · ทำภารกิจได้ ${done.length}/${scenario.goals.length}`}
            </p>
            {scenario.goals.length > 0 && (
              <ul className="space-y-1.5">
                {scenario.goals.map((g) => {
                  const ok = done.includes(g.id);
                  return (
                    <li key={g.id} className={`flex items-center gap-2 text-sm ${ok ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {ok ? <Check className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border border-slate-600" />}
                      {g.th}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-200">
                {fixes.length ? `ประโยคที่ควรจำ (${fixes.length})` : userTurns ? 'ไม่มีจุดที่ต้องแก้ เยี่ยมมาก!' : 'ยังไม่ได้เริ่มคุย'}
              </p>
              {fixes.map((t, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-500 font-jp line-through">{t.ja}</p>
                  <p className="font-jp text-base font-bold text-white leading-[2]">
                    <Ruby text={t.fix!.ja} readings={readings} />
                  </p>
                  {t.fix!.note && <p className="text-xs text-slate-300">{t.fix!.note}</p>}
                  <button onClick={() => speak(t.fix!.ja)} className="mt-1 min-h-9 px-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 flex items-center gap-1">
                    <Volume2 className="w-4 h-4" /> ฟัง
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowSummary(false)} className="min-h-11 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold">
                คุยต่อ
              </button>
              <button onClick={() => open(scenario)} className="min-h-11 rounded-xl bg-slate-800 text-slate-100 text-sm font-semibold">
                เริ่มใหม่
              </button>
              <button onClick={close} className="col-span-2 min-h-11 rounded-xl bg-rose-600 text-white text-sm font-bold">
                เลือกสถานการณ์อื่น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
