import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubtitleTokenJSON, SubtitleLineRecord } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import {
  X,
  Volume2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  data: {
    token: SubtitleTokenJSON;
    line: SubtitleLineRecord;
  };
  onClose: () => void;
}

export const ContextualDictionaryModal: React.FC<Props> = ({ data, onClose }) => {
  const { token, line } = data;
  const {
    getWordStatus,
    setWordStatus,
    mineSentence,
    minedSentences,
    aiProvider,
    aiModel,
    apiKey,
    callAICompletion,
  } = useApp();

  // A tab is shown only when it has something to show (M1). Empty tabs are hidden, not shown blank.
  const hasMeanings = (token.general_meanings || [token.contextual_meaning]).some((m) => (m || '').trim().length > 0);
  const hasGrammar = !!(line.ai_grammar_summary?.trim() || (line.ai_detailed_breakdown?.particles?.length ?? 0) > 0);
  const [activeTab, setActiveTab] = useState<'context' | 'grammar' | 'ai-live'>(() =>
    hasMeanings ? 'context' : hasGrammar ? 'grammar' : 'context'
  );
  const [userNote, setUserNote] = useState('');
  const [liveAIResponse, setLiveAIResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // The sheet is only mounted while open.
  useLockBodyScroll(true);

  const currentStatus = getWordStatus(token.word_id);
  const isMined = minedSentences.some(
    (m) => m.subtitle_line_id === line.id && m.target_word_id === token.word_id
  );

  // Empty strings are treated as "no meaning" so the sheet never shows empty quotes or bullets.
  const meaning = (token.thai_meaning || token.contextual_meaning || '').trim();
  const meaningEn = token.thai_meaning && token.contextual_meaning ? token.contextual_meaning.trim() : '';
  const dictionaryMeanings = (token.general_meanings || [token.contextual_meaning])
    .map((m) => (m || '').trim())
    .filter((m) => m.length > 0);
  const thaiLine = (line.thai_translation || '').trim();
  const naturalLine = (line.natural_translation || '').trim();

  const playAudio = (text: string) => {
    audioService.playJapanese(text, 0.9);
  };

  // Auto-speak word on opening modal
  React.useEffect(() => {
    if (token?.surface) {
      playAudio(token.surface);
    }
  }, [token]);

  const handleMine = () => {
    mineSentence(line, token.word_id, userNote);
  };

  const handleFetchLiveAI = async () => {
    setIsLoadingAI(true);
    const prompt = `Analyze the word "${token.surface}" (lemma: "${token.lemma}") in this sentence: "${line.raw_text}". Explain its contextual nuance, particle linkages, and how a Japanese speaker naturally uses it.`;
    const result = await callAICompletion(prompt);
    setLiveAIResponse(result);
    setIsLoadingAI(false);
  };

  const tabClass = (active: boolean, accent: 'indigo' | 'rose') =>
    `py-2.5 px-3 min-h-11 text-xs font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 active:opacity-70 ${
      active
        ? accent === 'indigo'
          ? 'border-indigo-500 text-indigo-400 font-bold'
          : 'border-rose-500 text-rose-400 font-bold'
        : 'border-transparent text-slate-400'
    }`;

  const statusClass = (status: 'new' | 'learning' | 'known') => {
    const base = 'py-2 px-2 min-h-11 rounded-lg text-xs font-semibold text-center active:opacity-70';
    if (currentStatus !== status) return `${base} text-slate-400 hover:text-slate-200`;
    if (status === 'new') return `${base} bg-slate-800 text-slate-200 border border-slate-700`;
    if (status === 'learning') return `${base} bg-amber-500/20 text-amber-300 border border-amber-500/40`;
    return `${base} bg-emerald-500/20 text-emerald-300 border border-emerald-500/40`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[var(--sat)] sm:pt-[calc(1rem_+_var(--sat))] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Mobile Bottom Sheet & Desktop Modal */}
      <div className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh]">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header Bar */}
        <div className="pl-4 pr-2 sm:pl-5 sm:pr-3 py-2 sm:py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <span className="text-sm font-semibold text-slate-300">คำศัพท์ในประโยค</span>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 min-w-11 min-h-11 flex items-center justify-center active:opacity-70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body: scroll stays inside the sheet (no page scroll behind it) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* 1. Word, reading and Thai meaning (most useful info first) */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3 bg-gradient-to-b from-indigo-950/20 to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold font-jp text-white tracking-wide break-words">
                    {token.lemma}
                  </h2>
                  {token.reading_kana && (
                    <span className="text-sm sm:text-base text-indigo-300 font-jp">
                      【{token.reading_kana}】
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
                  {token.romaji && <span className="font-mono">{token.romaji}</span>}
                  <span className="px-2 py-0.5 rounded font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {token.jlpt_level}
                  </span>
                  <span className="truncate max-w-[140px]">{token.part_of_speech}</span>
                </div>
                {token.pitch_morae && token.pitch_morae.length > 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-jp flex-wrap">
                    <span className="text-slate-400 mr-1">ระดับเสียง:</span>
                    {token.pitch_morae.map((m, idx) => (
                      <span
                        key={idx}
                        className={`px-1 py-0.5 rounded text-xs font-mono ${
                          m.high
                            ? 'border-t-2 border-indigo-400 text-indigo-300 bg-indigo-500/10'
                            : 'border-b-2 border-slate-600 text-slate-400'
                        }`}
                      >
                        {m.mora}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => playAudio(token.surface)}
                className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors min-w-11 min-h-11 flex items-center justify-center shrink-0 active:opacity-70"
                aria-label="ฟังเสียง"
                title="ฟังเสียง"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meaning in this sentence */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ความหมายในประโยคนี้</span>
              </div>
              {meaning ? (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-white break-words">{meaning}</p>
                  {meaningEn && <p className="text-xs text-slate-400">EN: {meaningEn}</p>}
                  {token.grammar_note && (
                    <p className="text-xs text-indigo-300 italic pt-1">หมายเหตุ: {token.grammar_note}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  ยังไม่มีความหมายในคลัง
                  {/* The hint only appears when the Live AI tab exists and an API key is set. */}
                  {aiProvider !== 'local' && apiKey.trim() ? ' — กดแท็บ "Live AI" เพื่อให้ AI อธิบาย' : ''}
                </p>
              )}
            </div>

            {/* Source sentence with its Thai translation (Thai row only when the line has Thai) */}
            {(line.raw_text || thaiLine || naturalLine) && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">ประโยคต้นทาง:</span>
                {line.raw_text && (
                  <p className="font-jp text-sm text-slate-200 font-semibold break-words">{line.raw_text}</p>
                )}
                {thaiLine && <p className="text-xs text-emerald-400 font-medium break-words">🇹🇭 {thaiLine}</p>}
                {naturalLine && naturalLine !== thaiLine && (
                  <p className="text-xs text-slate-400 break-words">{naturalLine}</p>
                )}
              </div>
            )}

            {/* Word status (touch friendly) */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setWordStatus(token.word_id, 'new')} className={statusClass('new')}>
                1. ยังไม่รู้
              </button>
              <button onClick={() => setWordStatus(token.word_id, 'learning')} className={statusClass('learning')}>
                2. กำลังจำ
              </button>
              <button onClick={() => setWordStatus(token.word_id, 'known')} className={statusClass('known')}>
                3. จำได้แล้ว
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800 px-4 bg-slate-950/40 overflow-x-auto">
            {hasMeanings && (
              <button onClick={() => setActiveTab('context')} className={tabClass(activeTab === 'context', 'indigo')}>
                ความหมายทั่วไป
              </button>
            )}
            {hasGrammar && (
              <button onClick={() => setActiveTab('grammar')} className={tabClass(activeTab === 'grammar', 'indigo')}>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                วิเคราะห์ไวยากรณ์
              </button>
            )}
            {aiProvider !== 'local' && (
              <button
                onClick={() => {
                  setActiveTab('ai-live');
                  if (!liveAIResponse) handleFetchLiveAI();
                }}
                className={tabClass(activeTab === 'ai-live', 'rose')}
              >
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                Live AI ({aiModel})
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-5 space-y-4">
            {activeTab === 'context' && dictionaryMeanings.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">รายการความหมายทั่วไป:</span>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                  {dictionaryMeanings.map((gm, idx) => (
                    <li key={idx} className="break-words">{gm}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'grammar' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-semibold text-indigo-400 block mb-1">สรุปไวยากรณ์:</span>
                  <p className="text-slate-200 leading-relaxed">{line.ai_grammar_summary}</p>
                </div>

                {line.ai_detailed_breakdown?.particles && line.ai_detailed_breakdown.particles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">อนุภาค:</span>
                    <div className="space-y-1.5">
                      {line.ai_detailed_breakdown.particles.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-jp text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10">
                              {p.particle}
                            </span>
                            <span className="text-slate-300 font-medium">{p.role}</span>
                          </div>
                          <p className="text-slate-400">{p.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai-live' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>โมเดล: {aiModel} ({aiProvider === 'tenixe' ? 'Tenixe' : 'Kob AI'})</span>
                  <button
                    onClick={handleFetchLiveAI}
                    disabled={isLoadingAI}
                    className="px-3 py-2 min-h-11 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 active:opacity-70 disabled:opacity-50"
                  >
                    {isLoadingAI ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ใหม่'}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {isLoadingAI ? 'กำลังประมวลผล...' : liveAIResponse}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar: One-Click Sentence Mining */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 safe-area-bottom">
          <input
            type="text"
            placeholder="เพิ่มโน้ตช่วยจำ (ไม่บังคับ)..."
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-11"
          />

          <button
            onClick={handleMine}
            disabled={isMined}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow transition-all min-h-11 active:opacity-70 ${
              isMined
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isMined ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>บันทึกเข้า Dojo แล้ว</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>ขุดประโยคเข้า The Dojo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
