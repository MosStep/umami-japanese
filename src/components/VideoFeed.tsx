import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { VideoRecord } from '../schema/databaseSchema';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import {
  Play,
  Sparkles,
  FolderHeart,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Zap,
  RefreshCw,
  X,
  Trash2,
} from 'lucide-react';

export const VideoFeed: React.FC = () => {
  const {
    videos,
    setActiveVideoId,
    setActiveTab,
    getKnownWordPercentage,
    ensureWordIndexLoaded,
    wordIndexStatus,
    albums,
    createAlbum,
    addVideoToAlbum,
    removeCustomVideo,
    isCustomVideo,
  } = useApp();

  // User-imported clip waiting for delete confirmation
  const [pendingDelete, setPendingDelete] = useState<VideoRecord | null>(null);
  // Scroll lock for the two dialogs (counter-based, so they can stack safely).
  useLockBodyScroll(!!pendingDelete);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJLPT, setSelectedJLPT] = useState<string>('All');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [comprehensibleOnly, setComprehensibleOnly] = useState<boolean>(false);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState<boolean>(false);
  useLockBodyScroll(showNewAlbumModal);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumEmoji, setNewAlbumEmoji] = useState('📁');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const categoryDefs = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Podcasts', label: '🎙️ พอดแคสต์' },
    { id: 'Gaming', label: '🎮 เกม & แคสเกม' },
    { id: 'Anime', label: '⚔️ อนิเมะ' },
    { id: 'Vlogs', label: '☕ Vlogs & เที่ยวญี่ปุ่น' },
    { id: 'Street Food', label: '🐙 สตรีทฟู้ด & อาหาร' },
    { id: 'J-Pop', label: '🎵 เพลง J-Pop' },
    { id: 'Daily Conversation', label: '💬 สนทนา' },
  ];
  // Chips only for categories and levels that have at least one video record.
  const categories = categoryDefs.filter(
    (c) => c.id === 'All' || videos.some((v) => v.category === c.id)
  );
  // JLPT chips always shown. A level with no clips yet stays visible (muted) and shows an empty state.
  const jlptLevels = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];
  const jlptHasClips = (lvl: string) => videos.some((v) => v.primary_jlpt === lvl);

  // Known % of every card comes from the word index (one small JSON), not from the caption files.
  useEffect(() => {
    ensureWordIndexLoaded();
    // ensureWordIndexLoaded is recreated each render; it does nothing after the first call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLiveSync = async () => {
    setIsSyncing(true);
    setSyncToast(null);
    try {
      const res = await fetch(
        'https://raw.githubusercontent.com/MosStep/umami-japanese/main/public/live_catalog.json',
        { cache: 'no-store' }
      );
      if (res.ok) {
        setSyncToast(`ซิงค์คลาวด์สำเร็จ! มีคลิปพร้อมเรียน ${videos.length} รายการ`);
      } else {
        setSyncToast(`ระบบใช้คลังคลิปใหม่ล่าสุด ${videos.length} รายการแล้ว`);
      }
    } catch {
      setSyncToast(`ระบบออฟไลน์: ใช้ข้อมูลคลิปในเครื่อง ${videos.length} รายการ`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  // Filter videos based on category, JLPT level, album, and comprehensible threshold
  const filteredVideos = videos.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (selectedJLPT !== 'All' && v.primary_jlpt !== selectedJLPT) return false;
    if (selectedAlbum !== 'All') {
      const alb = albums.find((a) => a.id === selectedAlbum);
      if (alb && !alb.video_ids.includes(v.id)) return false;
    }
    if (comprehensibleOnly) {
      // Same function as the card. Not-yet-loaded (null) clips are excluded until their captions arrive.
      const knownPct = getKnownWordPercentage(v.id);
      if (knownPct === null || knownPct < 60) return false;
    }
    return true;
  });

  // The "easy to understand" filter cannot judge clips until the word index has loaded.
  const waitingCaptions =
    comprehensibleOnly && (wordIndexStatus === 'idle' || wordIndexStatus === 'loading');

  const handleSelectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setActiveTab('player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Japanese Immersion Feed Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>うまみ (Umami) • วิดีโอภาษาญี่ปุ่นแท้สไตล์ HayaiLearn</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              เรียนภาษาญี่ปุ่นจากบริบทจริง (Video Immersion)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              แตะคำศัพท์ในซับไตเติลเพื่อดูความหมายทันที ขุดประโยค (Mine Sentence) เข้าสู่ Spaced Repetition (SRS)
              และฝึก Shadowing วัดสำเนียงแบบเรียลไทม์ ครอบคลุมตั้งแต่ N5 จนถึง N1
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLiveSync}
              disabled={isSyncing}
              className="px-4 py-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95"
              title="ซิงค์คลิปใหม่ล่าสุดจากคลาวด์โดยไม่ต้องติดตั้ง APK ใหม่"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : '🔄 ซิงค์คลิปใหม่ (Live Sync)'}</span>
            </button>

            <button
              onClick={() => setComprehensibleOnly(!comprehensibleOnly)}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                comprehensibleOnly
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>เข้าใจง่ายสุด (≥60% Known)</span>
            </button>
          </div>
        </div>

        {/* Sync Toast Feedback */}
        {syncToast && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-xs font-bold text-indigo-200 animate-in fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
        )}
      </div>

      {/* Categories & JLPT Level Filter Lanes */}
      <div className="space-y-3 border-b border-slate-800/80 pb-4">
        {/* JLPT Level Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">ระดับ JLPT:</span>
          {jlptLevels.map((lvl) => {
            const empty = lvl !== 'All' && !jlptHasClips(lvl);
            return (
              <button
                key={lvl}
                onClick={() => setSelectedJLPT(lvl)}
                className={`px-3 py-1.5 min-h-11 rounded-xl text-xs font-bold transition-all shrink-0 active:opacity-70 ${
                  selectedJLPT === lvl
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : empty
                    ? 'border border-dashed border-slate-700 text-slate-500 hover:text-slate-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'All' ? 'ทุกระดับ (All)' : lvl}
              </button>
            );
          })}
        </div>

        {/* Category Tabs & Albums */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Albums Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <FolderHeart className="w-3.5 h-3.5 text-rose-400" />
              อัลบั้ม:
            </span>
            <button
              onClick={() => setSelectedAlbum('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedAlbum === 'All'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              ทั้งหมด
            </button>
            {albums.map((alb) => (
              <button
                key={alb.id}
                onClick={() => setSelectedAlbum(alb.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  selectedAlbum === alb.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {alb.emoji} {alb.name}
              </button>
            ))}
            <button
              onClick={() => setShowNewAlbumModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 font-bold transition-all flex items-center gap-1 active:scale-95 shrink-0"
              title="สร้างอัลบั้มคอลเลกชันใหม่"
            >
              <span>+ สร้างอัลบั้ม</span>
            </button>
          </div>
        </div>
      </div>

      {waitingCaptions && (
        <p className="text-xs text-indigo-300 flex items-center gap-2" role="status">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          กำลังคำนวณ… (โหลดซับของคลิปทีละคลิป)
        </p>
      )}

      {/* Video Cards Grid (HayaiLearn Responsive Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((video) => {
          const knownPct = getKnownWordPercentage(video.id);

          return (
            <div
              key={video.id}
              onClick={() => handleSelectVideo(video.id)}
              className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              {/* Real YouTube Thumbnail Area with Gradient Overlay */}
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                  alt={video.title}
                  onError={(e) => {
                    // Fallback to stylized thumbnail gradient if YouTube image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Delete: only for user-imported clips */}
                {isCustomVideo(video.id) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(video);
                    }}
                    aria-label="ลบคลิปนี้"
                    title="ลบคลิปนี้"
                    className="absolute top-2 right-2 z-10 min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-black/70 text-rose-300 border border-rose-500/40 backdrop-blur-md active:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 text-[11px] font-mono text-slate-100 backdrop-blur-md border border-white/10 font-bold">
                  {Math.floor(video.duration / 60)}:
                  {(video.duration % 60).toString().padStart(2, '0')}
                </div>

                {/* Difficulty & JLPT Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-black/75 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    Lv.{video.difficulty_rating}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-indigo-600/90 text-white border border-indigo-400/40 backdrop-blur-md shadow-sm">
                    {video.primary_jlpt}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="truncate max-w-[140px]">{video.channel}</span>
                    <span className="text-indigo-400 font-semibold">• {video.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {video.title}
                  </h3>
                  <p className="font-jp text-xs text-slate-400 line-clamp-1">
                    {video.japanese_title}
                  </p>
                </div>

                {/* Known Words % Progress Bar (HayaiLearn Indicator) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      คำศัพท์ที่รู้ (Known)
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        knownPct === null
                          ? 'text-slate-500'
                          : knownPct >= 70
                          ? 'text-emerald-400'
                          : knownPct >= 50
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {knownPct !== null
                        ? `${knownPct}%`
                        : wordIndexStatus === 'idle' || wordIndexStatus === 'loading'
                        ? '…'
                        : '—'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        knownPct !== null && knownPct >= 70
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : knownPct !== null && knownPct >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${knownPct ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredVideos.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-400 py-12">
            {waitingCaptions
              ? 'กำลังคำนวณ…'
              : selectedJLPT !== 'All' && !jlptHasClips(selectedJLPT)
              ? 'ยังไม่มีคลิปในระดับนี้'
              : 'ยังไม่มีคลิปในหมวดนี้'}
          </p>
        )}
      </div>

      {/* Delete confirmation for user-imported clips */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem_+_var(--sat))] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setPendingDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-bold text-white">ลบคลิปนี้ออกจากแอป?</p>
                <p className="text-xs text-slate-300 break-words line-clamp-2">{pendingDelete.title}</p>
                <p className="text-xs text-slate-400">ซับและประโยคที่ขุดจากคลิปนี้จะถูกลบด้วย</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="min-h-11 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold active:opacity-70"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  removeCustomVideo(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="min-h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold active:opacity-70"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Album Modal (BUG-10) */}
      {showNewAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem_+_var(--sat))] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-indigo-500/40 p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FolderHeart className="w-4 h-4 text-rose-400" />
                <span>สร้างอัลบั้มคอลเลกชันใหม่</span>
              </div>
              <button
                onClick={() => setShowNewAlbumModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAlbumName.trim()) return;
                createAlbum(newAlbumName.trim(), newAlbumEmoji || '📁');
                setNewAlbumName('');
                setNewAlbumEmoji('📁');
                setShowNewAlbumModal(false);
              }}
              className="space-y-4"
            >
              {/* Emoji selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  เลือกไอคอน Emoji ประจำอัลบั้ม:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['📁', '🌟', '🍜', '🎮', '🌸', '☕', '⚔️', '🏮', '🎧', '🗼'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewAlbumEmoji(em)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        newAlbumEmoji === em
                          ? 'bg-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  ชื่ออัลบั้ม:
                </label>
                <input
                  type="text"
                  placeholder="เช่น คลิปที่ชอบดูซ้ำ, ร้านอาหารโตเกียว..."
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  autoFocus
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAlbumModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!newAlbumName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  สร้างอัลบั้ม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
