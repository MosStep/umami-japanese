import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_VERSION } from '../config/version';
import {
  Compass,
  Tv,
  BookA,
  Swords,
  Flame,
  Clock,
  Sparkles,
  Settings,
  Key,
} from 'lucide-react';

interface NavbarProps {
  onOpenUpdate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpdate }) => {
  const {
    activeTab,
    setActiveTab,
    stats,
    minedSentences,
    wordStates,
    setShowSettingsModal,
    aiProvider,
  } = useApp();

  const knownWords = Object.values(wordStates).filter((s) => s === 'known').length;
  const learningWords = Object.values(wordStates).filter((s) => s === 'learning').length;

  const totalXP =
    stats.xp_viewing + stats.xp_reading + stats.xp_listening + stats.xp_shadowing;

  return (
    <>
      {/* Top Header Bar (Desktop & Mobile) */}
      {/* safe-top keeps the bar below the status bar / camera cutout (edge-to-edge WebView) */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 safe-top">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 py-2.5">
          {/* Brand / Logo */}
          <div
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <span className="text-white font-black text-base sm:text-lg tracking-wider font-jp">旨</span>
              </div>
            </div>
            <span className="font-bold text-slate-100 tracking-tight text-lg font-jp">うまみ</span>
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile, replaced by Bottom Bar) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>วิดีโอ</span>
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'player'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>กำลังดู</span>
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'words'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookA className="w-4 h-4" />
              <span>คำศัพท์</span>
            </button>

            <button
              onClick={() => setActiveTab('dojo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === 'dojo'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>ฝึก</span>
              {minedSentences.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-300 font-semibold border border-rose-500/40">
                  {minedSentences.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right: streak + settings (version, AI key, updates live in Settings) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className="min-h-11 flex items-center gap-1 px-2.5 rounded-xl text-sm text-amber-300 hover:bg-slate-900 transition-colors"
              aria-label={`เรียนต่อเนื่อง ${stats.streak_days} วัน`}
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{stats.streak_days}</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
              aria-label="ตั้งค่า"
              title="ตั้งค่า"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Optimized for Phones / Touch Targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[56px] min-h-[48px] ${
            activeTab === 'feed'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">วิดีโอ</span>
        </button>

        <button
          onClick={() => setActiveTab('player')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[56px] min-h-[48px] ${
            activeTab === 'player'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">กำลังดู</span>
        </button>

        <button
          onClick={() => setActiveTab('words')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[56px] min-h-[48px] ${
            activeTab === 'words'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookA className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">คำศัพท์</span>
        </button>

        <button
          onClick={() => setActiveTab('dojo')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[56px] min-h-[48px] relative ${
            activeTab === 'dojo'
              ? 'text-rose-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="w-5 h-5 mb-0.5 text-rose-400" />
          <span className="text-[11px]">ฝึก</span>
          {minedSentences.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[56px] min-h-[48px] ${
            activeTab === 'profile'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">ฉัน</span>
        </button>
      </nav>
    </>
  );
};
