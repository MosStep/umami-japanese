import React, { useState, useEffect, useRef } from 'react';
import { useApp, FuriganaMode } from '../context/AppContext';
import { SubtitleLineRecord, SubtitleTokenJSON } from '../schema/databaseSchema';
import { ContextualDictionaryModal } from './ContextualDictionaryModal';
import { audioService } from '../utils/audioService';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Bookmark,
  Volume2,
  Settings,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Sliders,
  Maximize2,
  Radio,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ImmersionPlayer: React.FC = () => {
  const {
    activeVideo,
    activeSubtitleLines,
    getWordStatus,
    setWordStatus,
    mineSentence,
    minedSentences,
    selectedToken,
    setSelectedToken,
    furiganaMode,
    setFuriganaMode,
    readingGuideMode,
    setReadingGuideMode,
    showPitchAccent,
    setShowPitchAccent,
    showMicroGloss,
    setShowMicroGloss,
    addXP,
  } = useApp();

  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoPauseAtEnd, setAutoPauseAtEnd] = useState<boolean>(false);
  const [loopCurrentLine, setLoopCurrentLine] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [hideTranslation, setHideTranslation] = useState<boolean>(() => {
    return localStorage.getItem('umami_hide_translation') === 'true';
  });
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});

  const toggleHideTranslation = () => {
    const next = !hideTranslation;
    setHideTranslation(next);
    localStorage.setItem('umami_hide_translation', String(next));
  };

  const playerRef = useRef<any>(null);
  const iframeFallbackRef = useRef<HTMLIFrameElement>(null);
  const activeLineElementRef = useRef<HTMLDivElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLine = activeSubtitleLines[currentLineIndex] || activeSubtitleLines[0];

  // Dynamic real-time spoken token calculation
  const getActiveTokenIndex = () => {
    if (!activeLine || !activeLine.tokens_json || activeLine.tokens_json.length === 0) return -1;
    const curMs = currentTimeSec * 1000;
    if (curMs < activeLine.start_time_ms) return 0;
    if (curMs >= activeLine.end_time_ms) return activeLine.tokens_json.length - 1;
    const duration = activeLine.end_time_ms - activeLine.start_time_ms;
    if (duration <= 0) return 0;
    const elapsed = curMs - activeLine.start_time_ms;
    const ratio = Math.max(0, Math.min(1, elapsed / duration));
    const totalChars = activeLine.tokens_json.reduce((sum, t) => sum + Math.max(1, t.surface.length), 0);
    let acc = 0;
    for (let i = 0; i < activeLine.tokens_json.length; i++) {
      const weight = Math.max(1, activeLine.tokens_json[i].surface.length) / totalChars;
      if (ratio <= acc + weight || i === activeLine.tokens_json.length - 1) {
        return i;
      }
      acc += weight;
    }
    return 0;
  };

  const activeTokenIndex = getActiveTokenIndex();
  const activeToken = activeTokenIndex >= 0 && activeLine ? activeLine.tokens_json[activeTokenIndex] : null;

  // Guaranteed audio playback on all mobile devices
  const playNativeAudio = (text: string) => {
    audioService.playJapanese(text, playbackSpeed);
  };

  // 1. Load YouTube IFrame API script
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Initialize or Update YouTube Player
  useEffect(() => {
    let playerInstance: any = null;

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      try {
        // Destroy previous player instance if exists
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }

        playerInstance = new YT.Player('yt-player-container', {
          videoId: activeVideo.youtube_id,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            controls: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;
              setIsPlayerReady(true);
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
          },
        });
        playerRef.current = playerInstance;
      } catch (err) {
        console.warn('YT.Player init error, using iframe fallback:', err);
      }
    };

    initPlayer();

    return () => {
      if (playerInstance && typeof playerInstance.destroy === 'function') {
        try {
          playerInstance.destroy();
        } catch {}
      }
    };
  }, [activeVideo.youtube_id]);

  // 3. Real-Time Timestamp Synchronization (HayaiLearn Real-time Sync Engine)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const sec = playerRef.current.getCurrentTime();
          if (typeof sec === 'number' && !isNaN(sec)) {
            setCurrentTimeSec(sec);

            // Match active subtitle line with smooth continuity (HayaiLearn Real-time Flow)
            const matchedIndex = activeSubtitleLines.findIndex((line, idx) => {
              const nextLine = activeSubtitleLines[idx + 1];
              const lineEnd = nextLine
                ? Math.min(line.end_time_ms / 1000 + 0.5, nextLine.start_time_ms / 1000)
                : line.end_time_ms / 1000 + 0.8;
              return sec >= (line.start_time_ms / 1000 - 0.2) && sec <= lineEnd;
            });

            if (matchedIndex !== -1 && matchedIndex !== currentLineIndex) {
              setCurrentLineIndex(matchedIndex);
              addXP('viewing', 2);
            }

            // Loop sentence logic
            if (activeLine && loopCurrentLine && sec >= activeLine.end_time_ms / 1000) {
              playerRef.current.seekTo(activeLine.start_time_ms / 1000, true);
            }

            // Auto-pause logic
            if (activeLine && autoPauseAtEnd && sec >= activeLine.end_time_ms / 1000) {
              playerRef.current.pauseVideo();
              setIsPlaying(false);
            }
          }
        } catch {}
      }
    }, 150);

    return () => clearInterval(syncInterval);
  }, [activeSubtitleLines, currentLineIndex, activeLine, loopCurrentLine, autoPauseAtEnd]);

  // Auto-scroll inside transcript container ONLY (NEVER pull or scroll the entire window down!)
  useEffect(() => {
    const container = transcriptContainerRef.current;
    const element = activeLineElementRef.current;
    if (container && element) {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const containerHeight = container.clientHeight;
      container.scrollTo({
        top: Math.max(0, elementTop - containerHeight / 2 + elementHeight / 2),
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex]);

  // Jump to specific subtitle line and sync video timestamp
  const seekToLine = (index: number) => {
    if (index < 0 || index >= activeSubtitleLines.length) return;
    setCurrentLineIndex(index);
    const line = activeSubtitleLines[index];
    if (line) {
      const targetSec = line.start_time_ms / 1000;
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(targetSec, true);
        playerRef.current.playVideo();
      } else if (iframeFallbackRef.current?.contentWindow) {
        // Fallback postMessage
        iframeFallbackRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [targetSec, true] }),
          '*'
        );
      }
    }
  };

  // Toggle video play / pause
  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        if (activeLine) {
          playerRef.current.seekTo(activeLine.start_time_ms / 1000, true);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Replay current line audio and seek video
  const replayCurrentLine = () => {
    if (!activeLine) return;
    seekToLine(currentLineIndex);
    playNativeAudio(activeLine.raw_text);
  };

  // When clicking a token: pause video, auto-speak word, and open dictionary
  const handleTokenClick = (token: SubtitleTokenJSON, line: SubtitleLineRecord) => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
    // Auto-speak token immediately!
    playNativeAudio(token.surface);
    setSelectedToken({ token, line });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        seekToLine(Math.max(0, currentLineIndex - 1));
      } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        seekToLine(Math.min(activeSubtitleLines.length - 1, currentLineIndex + 1));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        replayCurrentLine();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (activeLine) {
          mineSentence(activeLine);
        }
      } else if (['1', '2', '3'].includes(e.key) && selectedToken) {
        e.preventDefault();
        const statusMap = { '1': 'new', '2': 'learning', '3': 'known' } as const;
        setWordStatus(selectedToken.token.word_id, statusMap[e.key as '1' | '2' | '3']);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubtitleLines, currentLineIndex, activeLine, selectedToken, isPlaying]);

  const isCurrentLineMined = minedSentences.some(
    (m) => m.subtitle_line_id === activeLine?.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Main Split-Screen Player (HayaiLearn Architecture: Left Video & Subtitles, Right Transcript) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Video & Subtitle Deck) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visual Player Frame */}
          <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl aspect-video flex flex-col justify-between group">
            {/* Real YouTube API Player Container */}
            <div id="yt-player-container" className="absolute inset-0 w-full h-full pointer-events-auto" />

            {/* Fallback iframe if API container takes time to mount */}
            {!isPlayerReady && (
              <iframe
                ref={iframeFallbackRef}
                className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_id}?enablejsapi=1&origin=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.origin : '*'
                )}&playsinline=1&rel=0&modestbranding=1&controls=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {/* Top Video Header Overlay */}
            <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-indigo-600/90 text-white border border-indigo-400/40 backdrop-blur-md">
                  {activeVideo.primary_jlpt}
                </span>
                <span className="text-xs sm:text-sm text-slate-100 font-bold truncate max-w-[200px] sm:max-w-md drop-shadow">
                  {activeVideo.title}
                </span>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setShowSettingsMenu(true)}
                  className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md transition-colors"
                  title="ตั้งค่าการแสดงซับไตเติล"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Japanese Subtitle Dock (Sleek Glassmorphic Panel) */}
          <div className="relative rounded-3xl bg-slate-900/95 border-2 border-slate-800 p-4 sm:p-6 space-y-3.5 shadow-2xl backdrop-blur-md text-center">
            {activeLine ? (
              <>
                {/* Real-Time Sync Indicator & Reading Guide Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
                  {/* Live Speech Indicator */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                    <span className="text-slate-400 font-semibold text-[11px]">
                      บรรทัดที่ {currentLineIndex + 1}
                    </span>
                    {activeToken && isPlaying && (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-amber-300 font-bold border border-indigo-500/30 text-[11px] flex items-center gap-1 animate-in fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        「{activeToken.surface}」{activeToken.thai_meaning ? `(${activeToken.thai_meaning})` : ''}
                      </span>
                    )}
                  </div>

                  {/* Reading Guide & Translation Toggle Controls */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Reading Guide Toggle Pills: [ 読 ฮิรากานะ ] [ Abc โรมันจิ ] [ ✕ ปิด ] */}
                    <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setReadingGuideMode('hiragana')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          readingGuideMode === 'hiragana'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="แสดงฟูริงะนะ / ฮิรากานะกำกับคันจิ"
                      >
                        読 ฮิรากานะ
                      </button>
                      <button
                        onClick={() => setReadingGuideMode('romaji')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          readingGuideMode === 'romaji'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="แสดงโรมันจิกำกับคันจิ"
                      >
                        Abc โรมันจิ
                      </button>
                      <button
                        onClick={() => setReadingGuideMode('off')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                          readingGuideMode === 'off'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="ปิดตัวช่วยอ่าน (คันจิล้วน)"
                      >
                        ✕ ปิด
                      </button>
                    </div>

                    {/* Translation Spoiler Toggle Button */}
                    <button
                      onClick={toggleHideTranslation}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        hideTranslation
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                      title={hideTranslation ? 'คลิกเพื่อแสดงคำแปลอัตโนมัติ' : 'คลิกเพื่อซ่อนเฉลยคำแปล (แตะเปิดดูทีละประโยค)'}
                    >
                      {hideTranslation ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{hideTranslation ? 'ซ่อนเฉลยแปล' : 'แสดงคำแปล'}</span>
                    </button>
                  </div>
                </div>

                {/* Tokenized Japanese Subtitle (Tappable with real-time active speech highlight) */}
                <div className="inline-flex flex-wrap items-end justify-center gap-x-2 gap-y-3 leading-relaxed pt-1">
                  {activeLine.tokens_json.map((token, idx) => {
                    const status = getWordStatus(token.word_id);
                    const isSpokenNow = isPlaying && idx === activeTokenIndex;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleTokenClick(token, activeLine)}
                        className={`group/token cursor-pointer select-none inline-flex flex-col items-center transition-all ${
                          isSpokenNow
                            ? 'bg-indigo-500/30 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/40 rounded-2xl px-2.5 py-1 scale-105'
                            : 'hover:scale-105 active:scale-95 px-1 py-0.5'
                        }`}
                        title="แตะเพื่อฟังเสียงและดูคำแปลทันที"
                      >
                        {/* Token with Furigana Ruby or Romaji */}
                        <ruby
                          className={`text-2xl sm:text-3xl font-jp font-extrabold tracking-wide ${
                            isSpokenNow
                              ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'text-white'
                          }`}
                        >
                          {token.surface}
                          {readingGuideMode === 'hiragana' &&
                            token.reading_kana &&
                            token.reading_kana !== token.surface && (
                              <rt className="text-xs sm:text-sm font-jp font-bold text-indigo-300 pb-0.5">
                                {token.reading_kana}
                              </rt>
                            )}
                          {readingGuideMode === 'romaji' && token.romaji && (
                            <rt className="text-[11px] font-sans font-semibold text-cyan-300 pb-0.5">
                              {token.romaji}
                            </rt>
                          )}
                        </ruby>

                        {/* Active Speech Dot Indicator */}
                        {isSpokenNow && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce mt-0.5 shadow-sm shadow-amber-400" />
                        )}

                        {/* Pitch Accent Contour Bar */}
                        {showPitchAccent && token.pitch_morae && !isSpokenNow && (
                          <div className="w-full flex items-center justify-center gap-0.5 h-1 mt-0.5">
                            {token.pitch_morae.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className={`flex-1 h-0.5 rounded-full ${
                                  m.high ? 'bg-amber-400' : 'bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Status Color-Coded Underline */}
                        <div
                          className={`w-full h-1 rounded-full mt-1 transition-colors ${
                            status === 'known'
                              ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                              : status === 'learning'
                              ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                              : 'border-b-2 border-dotted border-slate-600'
                          }`}
                        />

                        {/* Micro-gloss Preview */}
                        {showMicroGloss && status !== 'known' && !isSpokenNow && (
                          <span className="text-[10px] text-amber-300 font-sans tracking-tight max-w-[90px] truncate text-center mt-0.5 font-medium">
                            {token.thai_meaning || token.contextual_meaning}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sleek Floating Compact Definition Card (แตะคำศัพท์แล้วขึ้นแถบกะทัดรัด ไม่บังจอ) */}
                {selectedToken && (
                  <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/40 p-3 sm:p-4 shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-150 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => playNativeAudio(selectedToken.token.surface)}
                          className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all flex items-center gap-1 border border-amber-500/40"
                          title="ฟังเสียงคำนี้"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs font-bold">ฟัง</span>
                        </button>
                        <span className="text-xl sm:text-2xl font-jp font-extrabold text-white tracking-wide">
                          {selectedToken.token.surface}
                        </span>
                        <span className="text-sm font-jp text-indigo-300 font-bold">
                          ({selectedToken.token.reading_kana})
                        </span>
                        {selectedToken.token.romaji && (
                          <span className="text-xs font-mono text-cyan-300">
                            [{selectedToken.token.romaji}]
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-indigo-600 text-white">
                          {selectedToken.token.jlpt_level}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedToken(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        title="ปิดการ์ดคำแปล"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meaning row & 1-tap Status */}
                    <div className="mt-2 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🇹🇭</span>
                        <span className="text-sm font-bold text-emerald-300">
                          {selectedToken.token.thai_meaning || selectedToken.token.contextual_meaning}
                        </span>
                        {selectedToken.token.part_of_speech && (
                          <span className="text-xs text-slate-400">
                            ({selectedToken.token.part_of_speech})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <button
                          onClick={() => setWordStatus(selectedToken.token.word_id, 'known')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            getWordStatus(selectedToken.token.word_id) === 'known'
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                          }`}
                        >
                          ✓ จำได้แล้ว
                        </button>
                        <button
                          onClick={() => setWordStatus(selectedToken.token.word_id, 'learning')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            getWordStatus(selectedToken.token.word_id) === 'learning'
                              ? 'bg-amber-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-amber-300'
                          }`}
                        >
                          ⚡ กำลังเรียน
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Natural & Thai Translation & Grammar Summary */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {hideTranslation && !revealedLines[activeLine.id] ? (
                    <button
                      onClick={() => setRevealedLines((prev) => ({ ...prev, [activeLine.id]: true }))}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm group"
                    >
                      <Eye className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>แตะเพื่อดูเฉลยคำแปลภาษาไทย 🇹🇭</span>
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-base sm:text-lg text-emerald-300 font-bold flex items-center justify-center gap-2">
                          <span className="text-base">🇹🇭</span>
                          <span>{activeLine.thai_translation || activeLine.natural_translation}</span>
                        </p>
                        {hideTranslation && (
                          <button
                            onClick={() => setRevealedLines((prev) => ({ ...prev, [activeLine.id]: false }))}
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 text-xs ml-1"
                            title="ซ่อนเฉลยประโยคนี้อีกครั้ง"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {activeLine.thai_translation && activeLine.natural_translation && (
                        <p className="text-xs text-slate-400 font-medium">
                          {activeLine.natural_translation}
                        </p>
                      )}
                      {activeLine.ai_grammar_summary && (
                        <p className="text-xs text-amber-300/90 italic line-clamp-1">
                          💡 {activeLine.ai_grammar_summary}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400">กำลังโหลดข้อมูลซับไตเติล...</p>
            )}
          </div>

          {/* Control Dock (Playback & Keyboard Shortcuts) */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => seekToLine(Math.max(0, currentLineIndex - 1))}
                className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="ย้อนกลับ 1 ประโยค (A หรือ ลูกศรซ้าย)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                title="เล่น / หยุดชั่วคราว (Space)"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span className="text-xs sm:text-sm">{isPlaying ? 'พัก' : 'เล่น'}</span>
              </button>

              <button
                onClick={() => seekToLine(Math.min(activeSubtitleLines.length - 1, currentLineIndex + 1))}
                className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="ประโยคถัดไป (D หรือ ลูกศรขวา)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={replayCurrentLine}
                className="p-2.5 rounded-2xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors ml-1"
                title="เล่นเสียงประโยคนี้ซ้ำ (R)"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Loop & Auto-Pause Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setLoopCurrentLine(!loopCurrentLine)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-semibold transition-all ${
                  loopCurrentLine
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="วนลูปประโยคนี้ซ้ำๆ (R)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>วนซ้ำ (R)</span>
              </button>

              <button
                onClick={() => setAutoPauseAtEnd(!autoPauseAtEnd)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-semibold transition-all ${
                  autoPauseAtEnd
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="หยุดอัตโนมัติเมื่อจบบรรทัด"
              >
                <span>หยุดท้ายประโยค</span>
              </button>

              {/* Speed Dropdown */}
              <select
                value={playbackSpeed}
                onChange={(e) => {
                  const spd = parseFloat(e.target.value);
                  setPlaybackSpeed(spd);
                  if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
                    playerRef.current.setPlaybackRate(spd);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold focus:outline-none"
              >
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
              </select>
            </div>

            {/* Mine Sentence Button */}
            <div>
              <button
                onClick={() => mineSentence(activeLine)}
                disabled={isCurrentLineMined}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 ${
                  isCurrentLineMined
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
                title="ขุดประโยคนี้เข้า The Dojo (M)"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isCurrentLineMined ? 'ขุดแล้ว (Mined)' : 'ขุดประโยค (M)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Synchronized Transcript & Line Navigator) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 max-h-[640px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              บทบรรยายแบบซิงค์สด (Transcript)
            </span>
            <span className="text-xs text-indigo-400 font-mono font-bold">
              {currentLineIndex + 1} / {activeSubtitleLines.length}
            </span>
          </div>

            {/* Lines List */}
            <div ref={transcriptContainerRef} className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {activeSubtitleLines.map((line, idx) => {
                const isActive = idx === currentLineIndex;
                const isMined = minedSentences.some(
                  (m) => m.subtitle_line_id === line.id
                );

                return (
                  <div
                    key={line.id}
                    ref={isActive ? activeLineElementRef : null}
                    onClick={() => seekToLine(idx)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-indigo-600/25 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/20 scale-[1.01] ring-1 ring-indigo-400/40'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <span className={`font-semibold flex items-center gap-1.5 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                        {isActive && <Radio className="w-3 h-3 text-rose-500 animate-pulse" />}
                        ประโยคที่ {idx + 1} ({Math.round(line.start_time_ms / 1000)}s)
                      </span>
                      {isMined && (
                        <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                          <Bookmark className="w-3 h-3 fill-emerald-400" />
                          ขุดแล้ว
                        </span>
                      )}
                    </div>
                    <p className="font-jp text-sm font-semibold line-clamp-2 text-white">
                      {line.raw_text}
                    </p>
                    <p className="text-xs text-emerald-400/90 mt-1 line-clamp-2 font-medium">
                      🇹🇭 {line.thai_translation || line.natural_translation}
                    </p>
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* Subtitle Preferences Modal (Clean, Centered, Never Clipped) */}
      {showSettingsMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-indigo-500/40 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>ตั้งค่าการแสดงซับไตเติล</span>
              </div>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Furigana Mode */}
            <div className="space-y-1.5">
              <span className="text-slate-300 block text-xs font-semibold">คำอ่านฟูริงะนะ (Furigana):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['all', 'learning_only', 'off'] as FuriganaMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFuriganaMode(mode)}
                    className={`py-2 rounded-xl text-xs capitalize font-bold transition-all ${
                      furiganaMode === mode
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'all' ? 'ทั้งหมด' : mode === 'learning_only' ? 'เฉพาะที่เรียน' : 'ปิด'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Accent Toggle */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs text-slate-200 font-semibold">กราฟเสียงสูงต่ำ (Pitch Accent)</span>
              <input
                type="checkbox"
                checked={showPitchAccent}
                onChange={(e) => setShowPitchAccent(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            {/* Microgloss Toggle */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs text-slate-200 font-semibold">คำแปลภาษาไทยใต้คำ (Microgloss)</span>
              <input
                type="checkbox"
                checked={showMicroGloss}
                onChange={(e) => setShowMicroGloss(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            <button
              onClick={() => setShowSettingsMenu(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              บันทึกและปิด
            </button>
          </div>
        </div>
      )}

      {/* Settings Menu Modal */}
    </div>
  );
};
