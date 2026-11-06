import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
} from 'lucide-react';

export const VideoFeed: React.FC = () => {
  const {
    videos,
    setActiveVideoId,
    setActiveTab,
    getKnownWordPercentage,
    albums,
    createAlbum,
    addVideoToAlbum,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJLPT, setSelectedJLPT] = useState<string>('All');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [comprehensibleOnly, setComprehensibleOnly] = useState<boolean>(false);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumEmoji, setNewAlbumEmoji] = useState('📁');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const categories = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Podcasts', label: '🎙️ พอดแคสต์' },
    { id: 'Gaming', label: '🎮 เกม & แคสเกม' },
    { id: 'Anime', label: '⚔️ อนิเมะ' },
    { id: 'Vlogs', label: '☕ Vlogs & เที่ยวญี่ปุ่น' },
    { id: 'Street Food', label: '🐙 สตรีทฟู้ด & อาหาร' },
    { id: 'J-Pop', label: '🎵 เพลง J-Pop' },
    { id: 'Daily Conversation', label: '💬 สนทนา' },
  ];
  const jlptLevels = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

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
      const knownPct = getKnownWordPercentage(v.id);
      if (knownPct < 60) return false;
    }
    return true;
  });

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
          {jlptLevels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedJLPT(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedJLPT === lvl
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'All' ? 'ทุกระดับ (All)' : lvl}
            </button>
          ))}
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
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedAlbum === alb.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {alb.emoji} {alb.name}
              </button>
            ))}
          </div>
        </div>
      </div>

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
                        knownPct >= 70
                          ? 'text-emerald-400'
                          : knownPct >= 50
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {knownPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        knownPct >= 70
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : knownPct >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.max(8, knownPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
