import React, { useEffect, useState } from 'react';
import { useApp, isResumableClip } from '../context/AppContext';
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
  SlidersHorizontal,
  X,
  Trash2,
} from 'lucide-react';

export const VideoFeed: React.FC = () => {
  const {
    videos,
    activeVideoId,
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
  // Category + album filters live in a bottom sheet; only level chips stay on the page.
  const [showFilters, setShowFilters] = useState<boolean>(false);
  useLockBodyScroll(showFilters);

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

  const resumeVideo = isResumableClip(activeVideoId) ? videos.find((v) => v.id === activeVideoId) : undefined;
  const extraFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedAlbum !== 'All' ? 1 : 0);

  const handleSelectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setActiveTab('player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Continue watching: the last opened clip */}
      {resumeVideo && (
        <button
          onClick={() => handleSelectVideo(resumeVideo.id)}
          className="w-full sm:max-w-md flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition-colors active:opacity-80"
        >
          <div className="relative w-28 shrink-0 aspect-video rounded-xl overflow-hidden bg-slate-950">
            <img
              src={`https://img.youtube.com/vi/${resumeVideo.youtube_id}/mqdefault.jpg`}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-6 h-6 fill-white text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-indigo-300">ดูต่อ</p>
            <p className="text-sm font-bold text-slate-100 line-clamp-2">{resumeVideo.title}</p>
          </div>
        </button>
      )}

      {/* Level chips (one row) + filter sheet button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {jlptLevels.map((lvl) => {
            const empty = lvl !== 'All' && !jlptHasClips(lvl);
            return (
              <button
                key={lvl}
                onClick={() => setSelectedJLPT(lvl)}
                aria-pressed={selectedJLPT === lvl}
                className={`px-3.5 min-h-10 rounded-full text-sm font-semibold transition-colors shrink-0 active:opacity-70 ${
                  selectedJLPT === lvl
                    ? 'bg-slate-100 text-slate-900'
                    : empty
                    ? 'border border-dashed border-slate-700 text-slate-500'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl === 'All' ? 'ทั้งหมด' : lvl}
              </button>
            );
          })}
          <button
            onClick={() => setComprehensibleOnly(!comprehensibleOnly)}
            aria-pressed={comprehensibleOnly}
            className={`px-3.5 min-h-10 rounded-full text-sm font-semibold transition-colors shrink-0 flex items-center gap-1.5 active:opacity-70 ${
              comprehensibleOnly ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            เข้าใจง่าย
          </button>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="relative shrink-0 min-h-10 min-w-10 px-3 rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 text-sm font-semibold"
          aria-label="ตัวกรองเพิ่มเติม"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">ตัวกรอง</span>
          {extraFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-indigo-500 text-[11px] font-bold text-white flex items-center justify-center">
              {extraFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active extra filters, so a hidden filter never surprises */}
      {extraFilterCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400 -mt-2">
          <span>กรองอยู่:</span>
          {selectedCategory !== 'All' && <span className="text-slate-200">{categories.find((c) => c.id === selectedCategory)?.label}</span>}
          {selectedAlbum !== 'All' && <span className="text-slate-200">{albums.find((a) => a.id === selectedAlbum)?.name}</span>}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedAlbum('All');
            }}
            className="ml-auto min-h-9 px-2 text-indigo-300 font-semibold"
          >
            ล้าง
          </button>
        </div>
      )}

      {waitingCaptions && (
        <p className="text-xs text-indigo-300 flex items-center gap-2" role="status">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          กำลังคำนวณ… (โหลดซับของคลิปทีละคลิป)
        </p>
      )}

      {/* Video Cards Grid (HayaiLearn Responsive Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredVideos.map((video) => {
          const knownPct = getKnownWordPercentage(video.id);

          return (
            <div
              key={video.id}
              onClick={() => handleSelectVideo(video.id)}
              className="group cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 transition-colors duration-200 overflow-hidden flex flex-col active:opacity-80"
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

                {/* JLPT badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold bg-black/75 text-white backdrop-blur-md">
                  {video.primary_jlpt}
                </span>
              </div>

              {/* Card meta: title, channel, known-word share */}
              <div className="px-3.5 py-3 flex-1 flex flex-col gap-2">
                <h3 className="font-bold text-slate-100 text-[15px] leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="truncate">{video.channel}</span>
                  <span className="ml-auto shrink-0 flex items-center gap-1.5" title="คำศัพท์ในคลิปที่คุณรู้แล้ว">
                    <span className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <span
                        className={`block h-full ${knownPct !== null && knownPct >= 70 ? 'bg-emerald-400' : knownPct !== null && knownPct >= 50 ? 'bg-amber-400' : 'bg-slate-500'}`}
                        style={{ width: `${knownPct ?? 0}%` }}
                      />
                    </span>
                    <span className="font-mono text-slate-300">
                      {knownPct !== null ? `รู้ ${knownPct}%` : wordIndexStatus === 'idle' || wordIndexStatus === 'loading' ? '…' : '—'}
                    </span>
                  </span>
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

      {/* Filter sheet: category + album (less used, so off the main page) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <div
            role="dialog"
            aria-label="ตัวกรอง"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))] space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">ตัวกรอง</h2>
              <button onClick={() => setShowFilters(false)} aria-label="ปิด" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-300">หมวด</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    aria-pressed={selectedCategory === cat.id}
                    className={`px-3.5 min-h-10 rounded-full text-sm font-semibold transition-colors ${
                      selectedCategory === cat.id ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <FolderHeart className="w-4 h-4 text-rose-400" /> อัลบั้มของฉัน
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAlbum('All')}
                  aria-pressed={selectedAlbum === 'All'}
                  className={`px-3.5 min-h-10 rounded-full text-sm font-semibold transition-colors ${
                    selectedAlbum === 'All' ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ทั้งหมด
                </button>
                {albums.map((alb) => (
                  <button
                    key={alb.id}
                    onClick={() => setSelectedAlbum(alb.id)}
                    aria-pressed={selectedAlbum === alb.id}
                    className={`px-3.5 min-h-10 rounded-full text-sm font-semibold transition-colors ${
                      selectedAlbum === alb.id ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {alb.emoji} {alb.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowFilters(false);
                    setShowNewAlbumModal(true);
                  }}
                  className="px-3.5 min-h-10 rounded-full text-sm font-semibold border border-dashed border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  + สร้างอัลบั้ม
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full min-h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              ดู {filteredVideos.length} คลิป
            </button>
          </div>
        </div>
      )}

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
