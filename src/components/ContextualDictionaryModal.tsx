import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubtitleTokenJSON, SubtitleLineRecord } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
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
    callAICompletion,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'context' | 'grammar' | 'ai-live'>('context');
  const [userNote, setUserNote] = useState('');
  const [liveAIResponse, setLiveAIResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  const currentStatus = getWordStatus(token.word_id);
  const isMined = minedSentences.some(
    (m) => m.subtitle_line_id === line.id && m.target_word_id === token.word_id
  );

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Mobile Bottom Sheet & Desktop Modal */}
      <div className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh]">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header Bar */}
        <div className="px-5 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Contextual Dictionary
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Hero Information */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3 bg-gradient-to-b from-indigo-950/20 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold font-jp text-white tracking-wide">
                  {token.lemma}
                </h2>
                <span className="text-sm sm:text-base text-indigo-300 font-jp">
                  【{token.reading_kana}】
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {token.romaji}
                </span>
                <button
                  onClick={() => playAudio(token.surface)}
                  className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Pitch Accent Contour & JLPT */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {token.jlpt_level}
                </span>
                <span className="text-xs text-slate-400 truncate max-w-[140px]">
                  {token.part_of_speech}
                </span>
                {token.pitch_morae && token.pitch_morae.length > 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-jp">
                    <span className="text-slate-500 text-[10px] mr-1">Pitch:</span>
                    {token.pitch_morae.map((m, idx) => (
                      <span
                        key={idx}
                        className={`px-1 py-0.2 rounded text-[10px] font-mono ${
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
            </div>

            {/* Quick Word Status Buttons (Touch friendly) */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setWordStatus(token.word_id, 'new')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center min-h-[38px] ${
                  currentStatus === 'new'
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                1. ยังไม่รู้
              </button>
              <button
                onClick={() => setWordStatus(token.word_id, 'learning')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center min-h-[38px] ${
                  currentStatus === 'learning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                2. กำลังจำ
              </button>
              <button
                onClick={() => setWordStatus(token.word_id, 'known')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center min-h-[38px] ${
                  currentStatus === 'known'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                3. จำได้แล้ว
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('context')}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'context'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400'
            }`}
          >
            ความหมายในบริบท (Context)
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            วิเคราะห์ไวยากรณ์ (Grammar)
          </button>
          {aiProvider !== 'local' && (
            <button
              onClick={() => {
                setActiveTab('ai-live');
                if (!liveAIResponse) handleFetchLiveAI();
              }}
              className={`py-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ai-live'
                  ? 'border-rose-500 text-rose-400 font-bold'
                  : 'border-transparent text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Live AI ({aiModel})
            </button>
          )}
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'context' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ความหมายในประโยคนี้:</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">
                  "{token.thai_meaning || token.contextual_meaning}"
                </p>
                {token.thai_meaning && token.contextual_meaning && (
                  <p className="text-xs text-slate-400">
                    EN: {token.contextual_meaning}
                  </p>
                )}
                {token.grammar_note && (
                  <p className="text-xs text-indigo-300/80 italic pt-1">
                    Note: {token.grammar_note}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ความหมายทั่วไป (Dictionary):
                </span>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                  {token.general_meanings.map((gm, idx) => (
                    <li key={idx}>{gm}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  ประโยคต้นทาง (Source Sentence):
                </span>
                <p className="font-jp text-sm text-slate-200 font-semibold">{line.raw_text}</p>
                <p className="text-xs text-emerald-400 font-medium">🇹🇭 {line.thai_translation || line.natural_translation}</p>
                {line.thai_translation && line.natural_translation && (
                  <p className="text-xs text-slate-400">{line.natural_translation}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] uppercase font-semibold text-indigo-400 block mb-1">
                  Grammar Summary:
                </span>
                <p className="text-slate-200 leading-relaxed">{line.ai_grammar_summary}</p>
              </div>

              {line.ai_detailed_breakdown?.particles && line.ai_detailed_breakdown.particles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Particles:
                  </span>
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
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Model: {aiModel} ({aiProvider === 'tenixe' ? 'Tenixe' : 'Kob AI'})</span>
                <button
                  onClick={handleFetchLiveAI}
                  disabled={isLoadingAI}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  {isLoadingAI ? 'Analyzing...' : 'Re-analyze'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                {isLoadingAI ? 'Consulting neural network...' : liveAIResponse}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar: One-Click Sentence Mining */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 safe-area-bottom">
          <input
            type="text"
            placeholder="เพิ่มโน้ตช่วยจำ (Optional note)..."
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[40px]"
          />

          <button
            onClick={handleMine}
            disabled={isMined}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow transition-all min-h-[42px] ${
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
