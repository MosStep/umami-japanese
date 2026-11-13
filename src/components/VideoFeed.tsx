import React, { useEffect, useState } from 'react';
import { useApp, isResumableClip } from '../context/AppContext';
import type { VideoRecord } from '../schema/databaseSchema';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { hasExplanations } from '../data/explanations';
import { DAILY_GOAL_MIN, STUDY_MIN_MINUTES, STUDY_MIN_REVIEWS, dayDiff, localDayKey } from '../utils/streak';
import { countDue, loadWordSrs } from '../utils/wordSrs';
import { lastBackupDay } from '../utils/backup';
import { loadClipsDone } from '../utils/clipProgress';
import heroImg from '../assets/hero-street.webp';
import {
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Zap,
  SlidersHorizontal,
  X,
  Trash2,
} from 'lucide-react';

const FIT_MIN = 80;
const FIT_MAX = 95;

export const VideoFeed: React.FC = () => {
  const {
    videos,
    stats,
    activeVideoId,
    setActiveVideoId,
    setActiveTab,
    getKnownWordPercentage,
    ensureWordIndexLoaded,
    wordIndexStatus,
    removeCustomVideo,
    isCustomVideo,
    dictionaryWords,
    wordStates,
    streak,
    studiedToday,
    setShowSettingsModal,
  } = useApp();

  // User-imported clip waiting for delete confirmation
  const [pendingDelete, setPendingDelete] = useState<VideoRecord | null>(null);
  // Scroll lock for the two dialogs (counter-based, so they can stack safely).
  useLockBodyScroll(!!pendingDelete);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJLPT, setSelectedJLPT] = useState<string>('All');
  const [comprehensibleOnly, setComprehensibleOnly] = useState<boolean>(false);
  // Category filter lives in a bottom sheet; only level chips stay on the page.
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

  // "พอดีตัว" (i+1): clips where you already know FIT_MIN-FIT_MAX% of the words: a few new words, still followable.
  // When none fits yet, the closest clips below FIT_MAX are shown instead (best first).
  const baseVideos = videos.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (selectedJLPT !== 'All' && v.primary_jlpt !== selectedJLPT) return false;
    return true;
  });
  const fitPct = (v: VideoRecord) => getKnownWordPercentage(v.id);
  const fitting = baseVideos.filter((v) => {
    const p = fitPct(v);
    return p !== null && p >= FIT_MIN && p <= FIT_MAX;
  });
  const fitFallback = comprehensibleOnly && fitting.length === 0;
  const filteredVideos = !comprehensibleOnly
    ? baseVideos
    : (fitFallback
        ? baseVideos.filter((v) => {
            const p = fitPct(v);
            return p !== null && p < FIT_MAX;
          })
        : fitting
      )
        .sort((a, b) => (fitPct(b) ?? 0) - (fitPct(a) ?? 0))
        .slice(0, fitFallback ? 8 : undefined);
  const doneClips = loadClipsDone();

  // The "easy to understand" filter cannot judge clips until the word index has loaded.
  const waitingCaptions =
    comprehensibleOnly && (wordIndexStatus === 'idle' || wordIndexStatus === 'loading');

  const todayMin = Math.floor(stats.daily_minutes?.[localDayKey(new Date())] ?? 0);
  const goalPct = Math.min(100, Math.round((todayMin / DAILY_GOAL_MIN) * 100));
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'おはよう！ อรุณสวัสดิ์' : hour < 17 ? 'こんにちは！ สวัสดีตอนบ่าย' : 'こんばんは！ สวัสดีตอนเย็น';

  const resumeVideo = isResumableClip(activeVideoId) ? videos.find((v) => v.id === activeVideoId) : undefined;

  // "Today" card: due words, one clip (resume, else a well-fitting one), streak status, backup nudge.
  const [srsSnapshot] = useState(loadWordSrs);
  const { due: dueWords, fresh: freshWords } = countDue(dictionaryWords.map((w) => w.id), srsSnapshot);
  const todayKey = localDayKey(new Date());
  const todayReviews = stats.daily_reviews?.[todayKey] ?? 0;
  const minLeft = Math.max(1, Math.ceil(STUDY_MIN_MINUTES - (stats.daily_minutes?.[todayKey] ?? 0)));
  const reviewsLeft = Math.max(1, STUDY_MIN_REVIEWS - todayReviews);
  const suggestedVideo =
    resumeVideo ??
    (() => {
      let best: VideoRecord | undefined;
      let bestPct = -1;
      for (const v of videos) {
        const pct = getKnownWordPercentage(v.id);
        if (pct !== null && pct >= 60 && pct <= 95 && pct > bestPct) {
          best = v;
          bestPct = pct;
        }
      }
      return best ?? videos.find((v) => v.primary_jlpt === 'N5') ?? videos[0];
    })();
  const knownWordCount = Object.values(wordStates).filter((s) => s === 'known' || s === 'learning').length;
  const backupDay = lastBackupDay();
  const backupDue =
    (knownWordCount >= 20 || streak >= 3) && (!backupDay || dayDiff(backupDay, todayKey) >= 14);
  const extraFilterCount = selectedCategory !== 'All' ? 1 : 0;

  const handleSelectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setActiveTab('player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Welcome banner: greeting, today's goal, streak */}
      <section className="relative overflow-hidden rounded-3xl h-44 sm:h-56 bg-slate-900">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="relative h-full p-4 sm:p-6 flex flex-col justify-end gap-2">
          <p className="text-sm font-semibold text-amber-200 font-jp">{greeting}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {todayMin >= DAILY_GOAL_MIN ? 'ถึงเป้าวันนี้แล้ว เก่งมาก! 🎉' : 'วันนี้ดูคลิปญี่ปุ่นกันสักตอน'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>เป้าวันนี้</span>
                <span className="font-mono">
                  {Math.min(todayMin, DAILY_GOAL_MIN)}/{DAILY_GOAL_MIN} นาที
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden" role="progressbar" aria-valuenow={goalPct} aria-valuemin={0} aria-valuemax={100} aria-label="เป้าดูคลิปวันนี้">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all" style={{ width: `${goalPct}%` }} />
              </div>
            </div>
            <span className="shrink-0 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-sm font-bold text-amber-300">
              🔥 {streak} วัน
            </span>
          </div>
        </div>
      </section>

      {/* Today: one place to start (review due words, one clip), streak status, backup nudge */}
      <section className="sm:max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-3 space-y-2" aria-label="วันนี้">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h2 className="text-sm font-bold text-slate-100">วันนี้</h2>
          <span className={`text-xs font-semibold ${studiedToday ? 'text-emerald-300' : 'text-amber-300'}`}>
            {studiedToday
              ? '✓ วันนี้นับวันต่อเนื่องแล้ว'
              : `ดูอีก ${minLeft} นาที หรือทบทวน ${reviewsLeft} คำ`}
          </span>
        </div>
        {dictionaryWords.length > 0 && (
          <button
            onClick={() => setActiveTab('dojo')}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 text-left active:opacity-80"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-500/15 grid place-items-center">
              <Layers className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-100">ทบทวนคำศัพท์</p>
              <p className="text-xs text-slate-400">
                {dueWords > 0
                  ? `${dueWords} คำรอทบทวน${freshWords > 0 ? ` · คำใหม่ ${freshWords}` : ''}`
                  : freshWords > 0
                  ? `เรียนคำใหม่ ${freshWords} คำ`
                  : 'ทบทวนครบแล้ว ✓'}
              </p>
            </div>
            {dueWords > 0 && (
              <span className="shrink-0 min-w-7 h-7 px-2 rounded-full bg-amber-500 text-slate-950 text-sm font-bold grid place-items-center">
                {dueWords}
              </span>
            )}
          </button>
        )}
        {suggestedVideo && (
          <button
            onClick={() => handleSelectVideo(suggestedVideo.id)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 text-left active:opacity-80"
          >
            <div className="relative w-24 shrink-0 aspect-video rounded-lg overflow-hidden bg-slate-950">
              <img
                src={`https://img.youtube.com/vi/${suggestedVideo.youtube_id}/mqdefault.jpg`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-5 h-5 fill-white text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-indigo-300">{resumeVideo ? 'ดูต่อ' : 'คลิปแนะนำ'}</p>
              <p className="text-sm font-bold text-slate-100 line-clamp-2">{suggestedVideo.title}</p>
            </div>
          </button>
        )}
        {backupDue && (
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full min-h-10 px-3 rounded-xl text-left text-xs text-sky-300 hover:bg-slate-800/60"
          >
            💾 {backupDay ? `สำรองข้อมูลล่าสุด ${dayDiff(backupDay, todayKey)} วันก่อน` : 'ยังไม่เคยสำรองข้อมูล'} · แตะเพื่อสำรองกันหาย
          </button>
        )}
      </section>

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
            พอดีตัว
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
          <button
            onClick={() => setSelectedCategory('All')}
            className="ml-auto min-h-9 px-2 text-indigo-300 font-semibold"
          >
            ล้าง
          </button>
        </div>
      )}

      {comprehensibleOnly && !waitingCaptions && (
        <p className="text-xs text-slate-400 -mt-2">
          {fitFallback
            ? `ยังไม่มีคลิปที่รู้คำ ${FIT_MIN}% ขึ้นไป นี่คือคลิปที่ใกล้ที่สุด กดจำคำในคลิปเพิ่มแล้วจะเจอคลิปพอดีตัวมากขึ้น`
            : `คลิปที่คุณรู้คำ ${FIT_MIN}–${FIT_MAX}%: มีคำใหม่นิดหน่อย แต่ยังดูรู้เรื่อง`}
        </p>
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

                {/* JLPT badge + "has line explanations" badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-black/75 text-white backdrop-blur-md">
                    {video.primary_jlpt}
                  </span>
                  {doneClips[video.youtube_id] && (
                    <span className="px-1.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/90 text-slate-950" title="ดูจบแล้ว">
                      ✓ ดูจบ
                    </span>
                  )}
                  {hasExplanations(video.youtube_id) && (
                    <span className="px-1.5 py-0.5 rounded-md text-xs font-bold bg-amber-400/90 text-slate-950" title="มีคำอธิบายประโยค">
                      💡 อธิบาย
                    </span>
                  )}
                </div>
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

      {/* Filter sheet: category (less used, so off the main page) */}
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

    </div>
  );
};
