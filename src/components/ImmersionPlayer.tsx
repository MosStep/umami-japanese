import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import { useApp, FuriganaMode } from '../context/AppContext';
import { SubtitleLineRecord, SubtitleTokenJSON } from '../schema/databaseSchema';
import { ContextualDictionaryModal } from './ContextualDictionaryModal';
import { audioService } from '../utils/audioService';
import { loadExplanations, explanationFor, hasExplanations, LineExplanation } from '../data/explanations';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Bookmark,
  Volume2,
  Settings,
  Check,
  Zap,
  MoreHorizontal,
  BookOpen,
  CheckCircle2,
  Sliders,
  Maximize2,
  Radio,
  X,
  Eye,
  EyeOff,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';

// Pure resolver for the sync loop.
// - index: the line to show in the transcript. While a line is active this is the matched line;
//   in a gap / before the first line / after the last line it is the most recent line whose
//   start <= sec (or 0 before the first line).
// - active: true only when sec falls inside a line's window
//   [start - 0.15s, min(end + 0.3s, next.start)).
const resolveSubtitleLine = (
  lines: SubtitleLineRecord[],
  sec: number
): { index: number; active: boolean; spoken: number } => {
  let lastPassed = 0;
  let matched = -1;
  for (let i = 0; i < lines.length; i++) {
    const start = lines[i].start_time_ms / 1000;
    const next = lines[i + 1];
    const end = lines[i].end_time_ms / 1000;
    const windowEnd = next ? Math.min(end + 0.3, next.start_time_ms / 1000) : end + 0.3;
    if (sec >= start) lastPassed = i;
    if (sec >= start - 0.15 && sec < windowEnd) matched = i;
  }
  return matched !== -1
    ? { index: matched, active: true, spoken: lastPassed }
    : { index: lastPassed, active: false, spoken: lastPassed };
};

export const ImmersionPlayer: React.FC = () => {
  const {
    activeVideo,
    activeSubtitleLines,
    captionsLoading,
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
    addImmersionSeconds,
  } = useApp();

  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoPauseAtEnd, setAutoPauseAtEnd] = useState<boolean>(false);
  // Offline Thai explanations for this clip's lines (src/data/explanations); the panel stays open across lines.
  const [explanations, setExplanations] = useState<Record<string, LineExplanation>>({});
  const [showExplain, setShowExplain] = useState<boolean>(false);
  // Transcript list: always on desktop, collapsed by default on phones.
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  useEffect(() => {
    let alive = true;
    setExplanations({});
    loadExplanations(activeVideo.youtube_id).then((items) => alive && setExplanations(items));
    return () => {
      alive = false;
    };
  }, [activeVideo.youtube_id]);
  const [loopCurrentLine, setLoopCurrentLine] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [hideTranslation, setHideTranslation] = useState<boolean>(() => {
    return localStorage.getItem('umami_hide_translation') === 'true';
  });
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});
  const [showContextualModal, setShowContextualModal] = useState<boolean>(false);
  // Tiny tap-word popover: placement relative to the token row, measured on tap
  const [popPos, setPopPos] = useState<{ top: number; left: number; arrow: number; above: boolean } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const tappedElRef = useRef<HTMLElement | null>(null);
  // Preferences sheet: lock page scroll while it is open (counter-based, see utils/useLockBodyScroll).
  useLockBodyScroll(showSettingsMenu);
  // true only while playback time is inside a line's window (see resolveSubtitleLine)
  const [isLineActive, setIsLineActive] = useState<boolean>(false);

  const toggleHideTranslation = () => {
    const next = !hideTranslation;
    setHideTranslation(next);
    localStorage.setItem('umami_hide_translation', String(next));
  };

  const playerRef = useRef<any>(null);
  const iframeFallbackRef = useRef<HTMLIFrameElement>(null);
  const activeLineElementRef = useRef<HTMLDivElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  // Refs read by the sync interval, so the interval is created once per video
  const currentLineIndexRef = useRef<number>(0);
  const pausedLineIdRef = useRef<string | null>(null); // line id we last auto-paused at
  const seekPendingRef = useRef<{ targetSec: number; until: number } | null>(null);
  // Line being spoken (last line with start <= sec), carried between ticks.
  // Loop / auto-pause test its end before it advances, so short gaps cannot skip it.
  const spokenLineRef = useRef<number>(0);
  // Previous processed playback time; null after a seek so crossing is not inferred from it.
  const lastSecRef = useRef<number | null>(null);
  // "video:line" keys already credited with viewing XP in this player session (one credit per line).
  const creditedLinesRef = useRef<Set<string>>(new Set());
  const pendingImmersionSecRef = useRef<number>(0);
  const syncRef = useRef({
    lines: activeSubtitleLines,
    loop: loopCurrentLine,
    autoPause: autoPauseAtEnd,
    playbackSpeed,
    addXP,
  });
  syncRef.current = {
    lines: activeSubtitleLines,
    loop: loopCurrentLine,
    autoPause: autoPauseAtEnd,
    playbackSpeed,
    addXP,
  };

  const applyLineIndex = (idx: number) => {
    currentLineIndexRef.current = idx;
    setCurrentLineIndex(idx);
  };

  // Reset line index whenever active video changes
  useEffect(() => {
    applyLineIndex(0);
    pausedLineIdRef.current = null;
    seekPendingRef.current = null;
    spokenLineRef.current = 0;
    lastSecRef.current = null;
  }, [activeVideo.id]);

  const activeLine = activeSubtitleLines[currentLineIndex] || activeSubtitleLines[0];
  const activeExplain = activeLine ? explanationFor(explanations, activeLine.start_time_ms, activeLine.raw_text) : undefined;

  // Dynamic real-time spoken token calculation (no highlight when no line is active)
  const getActiveTokenIndex = () => {
    if (!isLineActive) return -1;
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
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;
      try {
        const sec = player.getCurrentTime();
        if (typeof sec !== 'number' || isNaN(sec)) return;
        setCurrentTimeSec(sec);

        // A seek was just issued: ignore player reads that are still far from the target
        const pending = seekPendingRef.current;
        if (pending) {
          if (Date.now() < pending.until && Math.abs(sec - pending.targetSec) > 0.5) return;
          seekPendingRef.current = null;
        }

        const { lines, loop, autoPause, playbackSpeed: speed, addXP: xp } = syncRef.current;
        const { index, active, spoken } = resolveSubtitleLine(lines, sec);
        setIsLineActive(active);

        const changed = index !== currentLineIndexRef.current;
        if (changed) applyLineIndex(index);
        // Viewing XP: once per line per player session (not on every replay or scrub back).
        const creditKey = `${activeVideo.id}:${lines[index]?.id}`;
        if (active && changed && !creditedLinesRef.current.has(creditKey)) {
          creditedLinesRef.current.add(creditKey);
          xp('viewing', 2);
        }

        // Test loop / auto-pause against the line that was being spoken BEFORE this tick,
        // then advance the spoken line.
        const prevSpoken = spokenLineRef.current;
        const prevSec = lastSecRef.current;
        spokenLineRef.current = spoken;
        lastSecRef.current = sec;

        const spokenLine = lines[prevSpoken];
        if (!spokenLine) return;
        const endSec = spokenLine.end_time_ms / 1000;

        // Crossing requires natural forward progress since the last tick (one 150 ms tick plus
        // timer slack, scaled by playback speed). Larger jumps are seeks (native scrub, our own
        // seeks) and never fire loop / auto-pause.
        const maxStep = 0.6 * Math.max(1, speed);
        const naturalStep = prevSec !== null && sec >= prevSec && sec - prevSec < maxStep;
        const crossed =
          naturalStep &&
          ((prevSec !== null && prevSec < endSec && endSec <= sec) || (sec >= endSec && sec - endSec < 0.5));

        // Re-arm auto-pause once the user has scrubbed back before this line's end
        if (pausedLineIdRef.current === spokenLine.id && sec < endSec - 0.3) {
          pausedLineIdRef.current = null;
        }

        // Loop sentence: seek back to the spoken line's start
        if (loop && crossed) {
          const startSec = spokenLine.start_time_ms / 1000;
          seekPendingRef.current = { targetSec: startSec, until: Date.now() + 1500 };
          spokenLineRef.current = prevSpoken;
          lastSecRef.current = null;
          player.seekTo(startSec, true);
          return;
        }

        // Auto-pause: once per line, so pressing play after a pause does not re-pause
        if (autoPause && crossed && pausedLineIdRef.current !== spokenLine.id) {
          pausedLineIdRef.current = spokenLine.id;
          player.pauseVideo();
          setIsPlaying(false);
        }
      } catch {}
    }, 150);

    return () => clearInterval(syncInterval);
  }, [activeVideo.id]);

  // Immersion time: count real seconds while the player reports PLAYING. Flushed every 30 s and on pause/unmount.
  useEffect(() => {
    if (!isPlaying) return;
    const flush = () => {
      const pending = pendingImmersionSecRef.current;
      pendingImmersionSecRef.current = 0;
      if (pending > 0) addImmersionSeconds(pending);
    };
    // Count a second only when the page is visible AND the YouTube player reports PLAYING (state 1).
    const tick = window.setInterval(() => {
      const playerState = playerRef.current?.getPlayerState?.();
      if (document.visibilityState !== 'visible' || playerState !== 1) return;
      pendingImmersionSecRef.current += 1;
      if (pendingImmersionSecRef.current >= 30) flush();
    }, 1000);
    // Backgrounding the app stops the count: save what was accumulated right away.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisibility);
      flush();
    };
    // addImmersionSeconds only uses a functional state update, so a stale reference is safe here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

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
    applyLineIndex(index);
    setIsLineActive(true);
    pausedLineIdRef.current = null; // re-arm auto-pause for this line
    spokenLineRef.current = index;
    lastSecRef.current = null;
    const line = activeSubtitleLines[index];
    if (line) {
      const targetSec = line.start_time_ms / 1000;
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        seekPendingRef.current = { targetSec, until: Date.now() + 1500 };
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
  const handleTokenClick = (token: SubtitleTokenJSON, line: SubtitleLineRecord, el: HTMLElement) => {
    // Tapping the same token again closes its popover
    if (selectedToken?.token === token) {
      setSelectedToken(null);
      return;
    }
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
    // Auto-speak token immediately!
    playNativeAudio(token.surface);
    tappedElRef.current = el;
    setSelectedToken({ token, line });
  };

  // Close the popover when the active line changes
  useEffect(() => {
    setSelectedToken(null);
  }, [activeLine?.id]);

  // Popover dismissal: outside tap, resize, Escape (not while the full dictionary modal is open)
  useEffect(() => {
    if (!selectedToken || showContextualModal) return;
    const onDown = (e: PointerEvent) => {
      const tgt = e.target as Element | null;
      if (tgt && typeof tgt.closest === 'function' && tgt.closest('[data-token-popover],[data-token]')) return;
      setSelectedToken(null);
    };
    const onResize = () => setSelectedToken(null);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
    };
  }, [selectedToken, showContextualModal, setSelectedToken]);

  // Position the popover: below the tapped token, flipped above if it would overflow the dock bottom.
  // Horizontally centred on the token, clamped to the dock with an 8px margin.
  useLayoutEffect(() => {
    const tokenEl = tappedElRef.current;
    const row = rowRef.current;
    const dock = dockRef.current;
    const pop = popRef.current;
    if (!selectedToken || showContextualModal || !tokenEl || !row || !dock || !pop) {
      setPopPos(null);
      return;
    }
    // Measure fresh on every open: the popover's containing block (offset parent) is the row,
    // and absolute top/left are relative to its padding box (hence the clientTop/clientLeft terms).
    const parent = (pop.offsetParent as HTMLElement | null) ?? row;
    const p = parent.getBoundingClientRect();
    const originX = p.left + parent.clientLeft;
    const originY = p.top + parent.clientTop;
    const t = tokenEl.getBoundingClientRect();
    const d = dock.getBoundingClientRect();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    const margin = 8;
    const gap = 6;
    const centerX = t.left + t.width / 2;
    const minL = d.left + margin;
    const maxL = Math.max(minL, d.right - margin - w);
    const left = Math.min(Math.max(centerX - w / 2, minL), maxL); // viewport x, horizontally clamped to dock
    const spaceBelow = d.bottom - t.bottom - margin;
    const spaceAbove = t.top - d.top - margin;
    // Default: below the token (top = token bottom + 6). Flip above only if it would overflow the dock bottom
    // (then bottom = token top - 6, i.e. top = token top - 6 - h).
    const above = spaceBelow < h + gap && spaceAbove > spaceBelow;
    const topViewport = above ? t.top - gap - h : t.bottom + gap;
    const top = topViewport - originY;
    const arrow = Math.min(Math.max(centerX - left, 10), w - 10);
    setPopPos({ top, left: left - originX, arrow, above });
  }, [selectedToken, showContextualModal, activeLine?.id]);

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
        if (activeLine && activeLine.raw_text) {
          mineSentence(activeLine);
        }
      } else if (e.key === 'Escape' && selectedToken && !showContextualModal) {
        e.preventDefault();
        setSelectedToken(null);
      } else if (['1', '2', '3'].includes(e.key) && selectedToken) {
        e.preventDefault();
        const statusMap = { '1': 'new', '2': 'learning', '3': 'known' } as const;
        setWordStatus(selectedToken.token.word_id, statusMap[e.key as '1' | '2' | '3']);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubtitleLines, currentLineIndex, activeLine, selectedToken, isPlaying, showContextualModal]);

  const isCurrentLineMined = minedSentences.some(
    (m) => m.subtitle_line_id === activeLine?.id
  );

  // Gap before the first line: the dock shows a waiting label instead of "no line"
  const isBeforeFirstLine =
    !isLineActive && activeSubtitleLines.length > 0 && currentTimeSec < activeSubtitleLines[0].start_time_ms / 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Main Split-Screen Player (HayaiLearn Architecture: Left Video & Subtitles, Right Transcript) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Video & Subtitle Deck) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visual Player Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col justify-between group">
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

          </div>

          {/* Title row + one settings button (subtitle, playback and reading options live there) */}
          <div className="flex items-center gap-2 -mt-1">
            <span className="shrink-0 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-200">{activeVideo.primary_jlpt}</span>
            <p className="flex-1 min-w-0 text-sm font-semibold text-slate-200 truncate">{activeVideo.title}</p>
            <button
              onClick={() => setShowSettingsMenu(true)}
              className="shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="ตั้งค่าซับและการเล่น"
              title="ตั้งค่าซับและการเล่น"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Japanese Subtitle Dock: fixed frame that never disappears.
              In a gap the last spoken line stays visible but dimmed. */}
          <div ref={dockRef} className="relative rounded-3xl bg-slate-900/95 border-2 border-slate-800 p-4 sm:p-6 flex flex-col gap-3 shadow-2xl backdrop-blur-md text-center">

            {activeLine ? (
              <>
                {/* Status row: line counter / gap label + translation toggle */}
                <div className="flex items-center justify-between gap-2 min-h-9 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {isLineActive ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                        <span>
                          {currentLineIndex + 1} / {activeSubtitleLines.length}
                        </span>
                      </>
                    ) : (
                      <span>{isBeforeFirstLine ? 'รอบทพูดแรก…' : '♪ ช่วงไม่มีบทพูด'}</span>
                    )}
                  </div>
                  <button
                    onClick={toggleHideTranslation}
                    aria-pressed={!hideTranslation}
                    className={`min-h-9 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors active:opacity-70 ${
                      hideTranslation ? 'text-amber-300 hover:bg-amber-500/10' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title={hideTranslation ? 'แสดงคำแปลอัตโนมัติ' : 'ซ่อนคำแปล (แตะเปิดดูทีละประโยค)'}
                  >
                    {hideTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{hideTranslation ? 'ซ่อนคำแปลอยู่' : 'คำแปล'}</span>
                  </button>
                </div>

                {/* Dimmed in gaps (last spoken line). Tokens stay tappable. */}
                <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isLineActive ? 'opacity-100' : 'opacity-50'}`}>
                  {/* Japanese line: compact ruby, stable min-height for 2 rows */}
                  <div ref={rowRef} className="relative flex flex-wrap items-end justify-center content-center gap-x-0.5 gap-y-1 min-h-[8.5rem] leading-relaxed">
                    {activeLine.tokens_json.length === 0 && (
                      <p className="text-sm text-slate-500">— ช่วงนี้ไม่มีซับญี่ปุ่น ดูคำแปลไทยด้านล่าง —</p>
                    )}
                    {activeLine.tokens_json.map((token, idx) => {
                      const status = getWordStatus(token.word_id);
                      const isSpokenNow = isPlaying && idx === activeTokenIndex;
                      const isTapped = selectedToken?.token === token;
                      // Selection uses only background + ring (no padding/border/text-size change), so tapping never reflows the line
                      const isSelected = isSpokenNow || isTapped;

                      return (
                        <div
                          key={idx}
                          data-token
                          onClick={(e) => handleTokenClick(token, activeLine, e.currentTarget)}
                          className={`cursor-pointer select-none inline-flex flex-col items-center min-w-8 min-h-8 px-0.5 py-0.5 rounded-lg transition-colors active:opacity-70 ${
                            isSelected ? 'bg-indigo-500/25 ring-1 ring-indigo-400' : ''
                          }`}
                          title="แตะเพื่อฟังเสียงและดูคำแปลทันที"
                        >
                          {/* Surface with furigana (ruby) or romaji */}
                          <ruby
                            className={`text-xl sm:text-2xl font-jp font-extrabold tracking-wide ${
                              isSpokenNow ? 'text-amber-200' : 'text-white'
                            }`}
                          >
                            {token.surface}
                            {readingGuideMode === 'hiragana' &&
                              furiganaMode !== 'off' &&
                              token.reading_kana &&
                              token.reading_kana !== token.surface &&
                              (furiganaMode === 'all' || status === 'learning') && (
                                <rt className="text-xs font-jp font-bold text-indigo-300">{token.reading_kana}</rt>
                              )}
                            {readingGuideMode === 'romaji' && token.romaji && (
                              <rt className="text-xs font-sans font-semibold text-cyan-300">{token.romaji}</rt>
                            )}
                          </ruby>

                          {/* Pitch accent contour (optional setting) */}
                          {showPitchAccent && token.pitch_morae && (
                            <div className="w-full flex items-center justify-center gap-0.5 h-1 mt-0.5">
                              {token.pitch_morae.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={`flex-1 h-0.5 rounded-full ${m.high ? 'bg-amber-400' : 'bg-slate-700'}`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Status underline: 1px dotted for unknown, 2px colour bar for learning/known */}
                          <div
                            className={`w-full mt-0.5 rounded-full ${
                              status === 'known'
                                ? 'h-0.5 bg-emerald-500'
                                : status === 'learning'
                                ? 'h-0.5 bg-amber-500'
                                : 'border-b border-dotted border-slate-500'
                            }`}
                          />
                        </div>
                      );
                    })}

                    {/* Tiny tap-word popover: anchored to the tapped token, never over the video */}
                    {selectedToken && !showContextualModal && (
                      <div
                        ref={popRef}
                        data-token-popover
                        role="dialog"
                        aria-label={selectedToken.token.surface}
                        style={
                          popPos
                            ? { top: popPos.top, left: popPos.left }
                            : { top: 0, left: 0, visibility: 'hidden' }
                        }
                        className="absolute z-30 w-max max-w-[15rem] rounded-xl bg-slate-900 border border-indigo-500/50 shadow-xl shadow-black/40 px-3 py-2 text-left animate-in fade-in duration-150"
                      >
                        {/* Caret pointing at the tapped word */}
                        <span
                          aria-hidden="true"
                          className={`absolute h-2.5 w-2.5 rotate-45 bg-slate-900 border-indigo-500/50 ${
                            popPos?.above ? '-bottom-[6px] border-r border-b' : '-top-[6px] border-l border-t'
                          }`}
                          style={{ left: (popPos?.arrow ?? 0) - 5 }}
                        />
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-lg font-jp font-extrabold text-white">{selectedToken.token.surface}</span>
                          {selectedToken.token.reading_kana && selectedToken.token.reading_kana !== selectedToken.token.surface && (
                            <span className="text-sm font-jp font-bold text-indigo-300">{selectedToken.token.reading_kana}</span>
                          )}
                        </div>
                        {(selectedToken.token.thai_meaning || selectedToken.token.contextual_meaning) && (
                          <p className="mt-0.5 text-sm font-bold text-emerald-300 line-clamp-2">
                            {selectedToken.token.thai_meaning || selectedToken.token.contextual_meaning}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => playNativeAudio(selectedToken.token.surface)}
                            aria-label="ฟังเสียง"
                            title="ฟังเสียง"
                            className="h-11 w-11 rounded-full flex items-center justify-center bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 active:opacity-70 transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setWordStatus(selectedToken.token.word_id, 'known')}
                            aria-label="จำได้แล้ว"
                            aria-pressed={getWordStatus(selectedToken.token.word_id) === 'known'}
                            title="จำได้แล้ว"
                            className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors active:opacity-70 ${
                              getWordStatus(selectedToken.token.word_id) === 'known'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setWordStatus(selectedToken.token.word_id, 'learning')}
                            aria-label="กำลังเรียน"
                            aria-pressed={getWordStatus(selectedToken.token.word_id) === 'learning'}
                            title="กำลังเรียน"
                            className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors active:opacity-70 ${
                              getWordStatus(selectedToken.token.word_id) === 'learning'
                                ? 'bg-amber-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:text-amber-300'
                            }`}
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowContextualModal(true)}
                            aria-label="ดูรายละเอียด"
                            title="ดูรายละเอียด"
                            className="h-11 w-11 rounded-full flex items-center justify-center bg-indigo-600/25 text-indigo-200 hover:bg-indigo-600/40 active:opacity-70 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Translation: always visible under the Japanese (unless spoiler-hidden) */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    {hideTranslation && !revealedLines[activeLine.id] ? (
                      <button
                        onClick={() => setRevealedLines((prev) => ({ ...prev, [activeLine.id]: true }))}
                        className="w-full min-h-11 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:opacity-70"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>แตะเพื่อดูเฉลยคำแปลภาษาไทย 🇹🇭</span>
                      </button>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 min-h-[3rem]">
                          <p className="flex-1 text-base font-bold leading-6 text-emerald-300 max-h-[7.5rem] overflow-y-auto overscroll-contain">
                            🇹🇭 {activeLine.thai_translation || activeLine.natural_translation}
                          </p>
                          {hideTranslation && (
                            <button
                              onClick={() => setRevealedLines((prev) => ({ ...prev, [activeLine.id]: false }))}
                              className="min-h-11 min-w-11 shrink-0 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300"
                              title="ซ่อนเฉลยประโยคนี้อีกครั้ง"
                              aria-label="ซ่อนเฉลยประโยคนี้อีกครั้ง"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {activeLine.thai_translation && activeLine.natural_translation && (
                          <p className="text-xs text-slate-400 font-medium line-clamp-1">{activeLine.natural_translation}</p>
                        )}
                        {activeLine.ai_grammar_summary && (
                          <p className="text-xs text-amber-300/90 italic line-clamp-1">💡 {activeLine.ai_grammar_summary}</p>
                        )}
                        {activeLine.raw_text && (
                          <div className="pt-1">
                            <button
                              onClick={() => setShowExplain((v) => !v)}
                              aria-expanded={showExplain}
                              className={`min-h-11 px-3 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors active:opacity-70 ${
                                showExplain
                                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                              }`}
                            >
                              <Lightbulb className="w-4 h-4 text-amber-400" />
                              <span>{showExplain ? 'ซ่อนคำอธิบาย' : 'อธิบายประโยค'}</span>
                            </button>
                            {showExplain && !activeExplain && (
                              <p className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-sm text-slate-400">
                                {!hasExplanations(activeVideo.youtube_id)
                                  ? 'คลิปนี้ยังไม่มีคำอธิบาย — ตอนนี้มีครบในคลิป N5 และเกือบครบใน N4 (ดูป้าย 💡 บนการ์ดคลิป) ระดับอื่นกำลังทยอยเพิ่ม'
                                  : activeLine.raw_text.replace(/\s+/g, '').length < 5
                                  ? 'ประโยคสั้น — แตะที่คำเพื่อดูความหมายได้เลย'
                                  : 'บรรทัดนี้ยังไม่มีคำอธิบาย'}
                              </p>
                            )}
                            {showExplain && activeExplain && (
                              <div className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-left max-h-[14rem] overflow-y-auto overscroll-contain">
                                {activeExplain.fix && (
                                  <p className="text-xs text-sky-300">
                                    ซับอัตโนมัติอาจได้ยินผิด น่าจะเป็น: <span className="text-sm text-sky-100">{activeExplain.fix}</span>
                                  </p>
                                )}
                                <p className="text-sm leading-6 text-slate-200">{activeExplain.x}</p>
                                {activeExplain.g && activeExplain.g.length > 0 && (
                                  <ul className="space-y-1.5 pt-1 border-t border-slate-800">
                                    {activeExplain.g.map((pt, i) => (
                                      <li key={i} className="text-sm leading-6">
                                        <span className="font-bold text-amber-300">{pt.f}</span>
                                        {pt.b && pt.b !== pt.f && <span className="text-xs text-slate-500"> ({pt.b})</span>}
                                        <span className="text-slate-300"> — {pt.e}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 min-h-[8rem] flex items-center justify-center">กำลังโหลดข้อมูลซับไตเติล...</p>
            )}
          </div>

          {/* Control Dock (Playback & Keyboard Shortcuts) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => seekToLine(Math.max(0, currentLineIndex - 1))}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="ประโยคก่อนหน้า"
                title="ย้อนกลับ 1 ประโยค (A หรือ ลูกศรซ้าย)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className="min-h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                title="เล่น / หยุดชั่วคราว (Space)"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span className="text-xs sm:text-sm">{isPlaying ? 'พัก' : 'เล่น'}</span>
              </button>

              <button
                onClick={() => seekToLine(Math.min(activeSubtitleLines.length - 1, currentLineIndex + 1))}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="ประโยคถัดไป"
                title="ประโยคถัดไป (D หรือ ลูกศรขวา)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={replayCurrentLine}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="เล่นประโยคนี้ซ้ำ"
                title="เล่นประโยคนี้ซ้ำ (R)"
              >
                <RotateCcw className={`w-4 h-4 ${loopCurrentLine ? 'text-indigo-300' : 'text-amber-400'}`} />
              </button>
            </div>

            {/* Save sentence to practice */}
            <button
              onClick={() => mineSentence(activeLine)}
              disabled={isCurrentLineMined || !activeLine || !activeLine.raw_text}
              className={`min-h-11 px-3.5 rounded-2xl text-sm font-semibold flex items-center gap-1.5 transition-colors active:opacity-70 ${
                isCurrentLineMined
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : !activeLine || !activeLine.raw_text
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
              }`}
              title={activeLine && !activeLine.raw_text ? 'บรรทัดนี้ไม่มีภาษาญี่ปุ่น' : 'เก็บประโยคนี้ไปฝึก (M)'}
            >
              <Bookmark className={`w-4 h-4 ${isCurrentLineMined ? 'fill-emerald-300' : ''}`} />
              <span>{isCurrentLineMined ? 'เก็บแล้ว' : 'เก็บประโยค'}</span>
            </button>

          </div>
        </div>

        {/* Right Column (Synchronized Transcript & Line Navigator) */}
        <div className={`lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 flex flex-col ${showTranscript ? 'max-h-[640px]' : ''} lg:max-h-[640px]`}>
          <button
            onClick={() => setShowTranscript((v) => !v)}
            aria-expanded={showTranscript}
            className={`min-h-11 flex items-center justify-between lg:pointer-events-none ${showTranscript ? 'pb-3 border-b border-slate-800' : ''} lg:pb-3 lg:border-b lg:border-slate-800`}
          >
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              ประโยคทั้งหมด
            </span>
            <span className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              {currentLineIndex + 1} / {activeSubtitleLines.length}
              <ChevronDown className={`w-4 h-4 lg:hidden transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
            </span>
          </button>

            {/* Lines List */}
            <div ref={transcriptContainerRef} className={`overflow-y-auto space-y-2.5 flex-1 pr-1 ${showTranscript ? '' : 'hidden'} lg:block`}>
              {captionsLoading && (
                <p className="text-xs text-slate-400 text-center py-6">กำลังโหลดคำบรรยาย... (Loading captions)</p>
              )}
              {activeSubtitleLines.map((line, idx) => {
                const isActive = isLineActive && idx === currentLineIndex;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem_+_var(--sat))] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-indigo-500/40 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>ตั้งค่าซับและการเล่น</span>
              </div>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reading guide above kanji */}
            <div className="space-y-1.5">
              <span className="text-slate-300 block text-xs font-semibold">ตัวช่วยอ่านบนคันจิ</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { mode: 'hiragana', label: 'ฮิรางานะ' },
                    { mode: 'romaji', label: 'โรมันจิ' },
                    { mode: 'off', label: 'ปิด' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => setReadingGuideMode(opt.mode)}
                    aria-pressed={readingGuideMode === opt.mode}
                    className={`min-h-10 rounded-xl text-xs font-bold transition-all ${
                      readingGuideMode === opt.mode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Playback: speed, loop, auto-pause */}
            <div className="space-y-1.5">
              <span className="text-slate-300 block text-xs font-semibold">ความเร็ว</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.5, 0.75, 1.0, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
                        playerRef.current.setPlaybackRate(spd);
                      }
                    }}
                    aria-pressed={playbackSpeed === spd}
                    className={`min-h-10 rounded-xl text-xs font-bold transition-all ${
                      playbackSpeed === spd ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs text-slate-200 font-semibold">วนซ้ำประโยคเดิม</span>
              <input type="checkbox" checked={loopCurrentLine} onChange={(e) => setLoopCurrentLine(e.target.checked)} className="w-4 h-4 accent-indigo-500 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs text-slate-200 font-semibold">หยุดเมื่อจบแต่ละประโยค</span>
              <input type="checkbox" checked={autoPauseAtEnd} onChange={(e) => setAutoPauseAtEnd(e.target.checked)} className="w-4 h-4 accent-indigo-500 rounded" />
            </label>

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

      {/* Contextual Dictionary Modal */}
      {showContextualModal && selectedToken && (
        <ContextualDictionaryModal
          data={selectedToken}
          onClose={() => {
            setShowContextualModal(false);
            setSelectedToken(null);
          }}
        />
      )}
    </div>
  );
};
