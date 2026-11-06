import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JLPTLevel, WordLearningStatus } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
import {
  BookA,
  Search,
  Volume2,
  Play,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Bottom-Up Philosophy */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <BookA className="w-5 h-5 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Words Directory (Bottom-Up Learning)
          </h1>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl">
          Browse vocabulary sorted by JLPT frequency rank. Switch words between{' '}
          <span className="text-emerald-400 font-medium">Known</span>,{' '}
          <span className="text-amber-400 font-medium">Learning</span>, and{' '}
          <span className="text-slate-400 font-medium">New</span>, or jump directly
          into video clips where each word is spoken in context.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Kanji, Kana, Romaji, English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* JLPT & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* JLPT Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {jlptTabs.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedJLPT(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedJLPT === lvl
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="known">Known Only (Emerald)</option>
            <option value="learning">Learning Only (Amber)</option>
            <option value="new">New Only</option>
          </select>
        </div>
      </div>

      {/* Words Table / Grid */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Word / Lemma</th>
                <th className="py-3 px-4">Reading & Romaji</th>
                <th className="py-3 px-4">Pitch Accent</th>
                <th className="py-3 px-4">JLPT & POS</th>
                <th className="py-3 px-4">Core Meanings</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">In Videos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredWords.map((word) => {
                const status = wordStates[word.id] || 'new';

                return (
                  <tr
                    key={word.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Lemma */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-jp text-xl font-bold text-white">
                          {word.lemma}
                        </span>
                        <button
                          onClick={() => playAudio(word.lemma)}
                          className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800"
                          title="Audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Reading */}
                    <td className="py-3.5 px-4">
                      <div className="font-jp text-indigo-300 text-sm">
                        {word.reading_kana}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {word.romaji}
                      </div>
                    </td>

                    {/* Pitch Accent */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {word.pitch_morae.map((m, idx) => (
                          <span
                            key={idx}
                            className={`px-1 rounded text-[10px] font-mono ${
                              m.high
                                ? 'bg-indigo-500/20 text-indigo-300 border-t border-indigo-400'
                                : 'text-slate-500 border-b border-slate-700'
                            }`}
                          >
                            {m.mora}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* JLPT & POS */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {word.jlpt_level}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[120px]">
                          {word.part_of_speech}
                        </span>
                      </div>
                    </td>

                    {/* Meanings */}
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      {word.core_meanings.join(', ')}
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {(['new', 'learning', 'known'] as WordLearningStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => setWordStatus(word.id, st)}
                              className={`px-2 py-0.5 rounded text-[10px] capitalize font-medium transition-colors ${
                                status === st
                                  ? st === 'known'
                                    ? 'bg-emerald-500/30 text-emerald-300 font-semibold'
                                    : st === 'learning'
                                    ? 'bg-amber-500/30 text-amber-300 font-semibold'
                                    : 'bg-slate-700 text-slate-200'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>
                    </td>

                    {/* In Videos Finder */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveVideoId(videos[0].id);
                          setActiveTab('player');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors"
                        title="Watch in Video"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Video</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
