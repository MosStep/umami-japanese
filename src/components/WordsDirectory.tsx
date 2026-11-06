import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JLPTLevel, WordLearningStatus } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
import {
  BookA,
  Search,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  X,
  Flame,
  Check,
} from 'lucide-react';

export const WordsDirectory: React.FC = () => {
  const {
    dictionaryWords,
    wordStates,
    setWordStatus,
    videos,
    setActiveVideoId,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJLPT, setSelectedJLPT] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const jlptTabs = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

  const playAudio = (text: string) => {
    audioService.playJapanese(text);
  };

  // Status counts
  const countKnown = dictionaryWords.filter((w) => wordStates[w.id] === 'known').length;
  const countLearning = dictionaryWords.filter((w) => wordStates[w.id] === 'learning').length;
  const countNew = dictionaryWords.length - countKnown - countLearning;

  const filteredWords = dictionaryWords.filter((w) => {
    if (selectedJLPT !== 'All' && w.jlpt_level !== selectedJLPT) return false;
    const status = wordStates[w.id] || 'new';
    if (selectedStatus !== 'All' && status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLemma = w.lemma.toLowerCase().includes(q);
      const matchKana = w.reading_kana.toLowerCase().includes(q);
      const matchRomaji = w.romaji.toLowerCase().includes(q);
      const matchDef = w.core_meanings.some((m) => m.toLowerCase().includes(q));
      if (!matchLemma && !matchKana && !matchRomaji && !matchDef) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookA className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              คลังคำศัพท์ (Vocabulary Vault)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            คำศัพท์จริงจากวิดีโอ แตะเพื่อฟังเสียงต้นฉบับและเปลี่ยนสถานะการจำได้ทันที
          </p>
        </div>

        {/* Learning Progress Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>จำได้ {countKnown}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>กำลังเรียน {countLearning}</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาคันจิ, คานะ, โรมันจิ หรือคำแปลไทย..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters (JLPT & Status) */}
      <div className="space-y-2.5">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold mr-1 shrink-0">สถานะ:</span>
          {[
            { id: 'All', label: `ทั้งหมด (${dictionaryWords.length})` },
            { id: 'learning', label: `⚡ กำลังเรียน (${countLearning})` },
            { id: 'known', label: `✓ จำได้แล้ว (${countKnown})` },
            { id: 'new', label: `○ ยังไม่เริ่ม (${countNew})` },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedStatus === st.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* JLPT Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold mr-1 shrink-0">ระดับ:</span>
          {jlptTabs.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedJLPT(lvl)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedJLPT === lvl
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'All' ? 'ทุกระดับ' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards List (Mobile-First 1 Column on Phone, 2-3 Columns on Tablet/Desktop) */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredWords.map((word) => {
            const status = wordStates[word.id] || 'new';

            return (
              <div
                key={word.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
              >
                {/* Word Top: Sound, Lemma, Kana, Romaji & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-jp text-2xl font-black text-white tracking-wide">
                        {word.lemma}
                      </span>
                      <span className="font-jp text-sm font-bold text-indigo-300">
                        {word.reading_kana}
                      </span>
                      {word.romaji && (
                        <span className="text-xs font-mono text-cyan-300/80">
                          [{word.romaji}]
                        </span>
                      )}
                    </div>

                    {/* Meanings */}
                    <p className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 pt-0.5">
                      <span>🇹🇭</span>
                      <span>{word.core_meanings.join(', ')}</span>
                    </p>
                  </div>

                  {/* Sound & JLPT Badge */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-indigo-600 text-white">
                      {word.jlpt_level}
                    </span>
                    <button
                      onClick={() => playAudio(word.lemma)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 active:scale-95 transition-all"
                      title="ฟังเสียงคำนี้"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

                {/* Status Switcher Buttons (1-Tap Fast Toggle) */}
                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    สถานะ:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setWordStatus(word.id, 'known')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'known'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      ✓ จำได้แล้ว
                    </button>
                    <button
                      onClick={() => setWordStatus(word.id, 'learning')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'learning'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-amber-300'
                      }`}
                    >
                      ⚡ กำลังเรียน
                    </button>
                    <button
                      onClick={() => setWordStatus(word.id, 'new')}
                      className={`px-2 py-1 rounded-lg font-medium transition-all ${
                        status === 'new'
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      รีเซ็ต
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-8 text-center space-y-2">
          <BookA className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-300 font-semibold">ไม่พบคำศัพท์ตามเงื่อนไขที่ค้นหา</p>
          <p className="text-xs text-slate-500">ลองเปลี่ยนตัวกรองระดับ JLPT หรือคำค้นหา</p>
        </div>
      )}
    </div>
  );
};
