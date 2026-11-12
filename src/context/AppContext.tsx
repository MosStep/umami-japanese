import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  VideoRecord,
  SubtitleLineRecord,
  SubtitleTokenJSON,
  DictionaryWordRecord,
  WordLearningStatus,
  MinedSentenceRecord,
} from '../schema/databaseSchema';
import {
  MOCK_VIDEOS,
  MOCK_SUBTITLE_LINES,
  DICTIONARY_WORDS,
} from '../data/mockVideos';
import {
  buildRealSubtitleLines,
  GLOSS_ID_PREFIX,
  glossaryFor,
  linkWordIndexKey,
  loadGlossary,
  loadCaptionFile,
  loadWordIndex,
  type WordIndex,
} from '../data/captions';
import { STORAGE_KEYS } from '../config/storageKeys';
import { runMigration108 } from '../utils/migration108';
import { localDayKey, nextStreak } from '../utils/streak';
import { runMigrationAi } from '../utils/migrationAi';

// One-time 1.0.8 cleanup (seeded demo stats/words/cards, broken imported clips). Runs at module load,
// before any state initializer below reads localStorage.
runMigration108();
// Kob AI -> Tenixe settings cleanup (idempotent), also before the AI state initializers.
runMigrationAi();

export interface UserStats {
  streak_days: number;
  total_immersion_minutes: number;
  xp_viewing: number;
  xp_reading: number;
  xp_listening: number;
  xp_shadowing: number;
  // Set by the 1.0.8 migration once its seed subtraction has been written (see utils/migration108.ts).
  migr_108_xp?: boolean;
  // Local calendar day (YYYY-MM-DD) of the last app use; drives the streak.
  last_active_day?: string;
  // Per local day (YYYY-MM-DD): watched minutes and XP earned. Last 90 days kept; drives the daily goal and week view.
  daily_minutes?: Record<string, number>;
  daily_xp?: Record<string, number>;
}

/** Adds `amount` to today's entry of a per-day map, keeping only the newest 90 days. */
const bumpToday = (map: Record<string, number> | undefined, amount: number): Record<string, number> => {
  const today = localDayKey(new Date());
  const next = { ...(map ?? {}), [today]: (map?.[today] ?? 0) + amount };
  const days = Object.keys(next).sort();
  for (const d of days.slice(0, Math.max(0, days.length - 90))) delete next[d];
  return next;
};

export interface Album {
  id: string;
  name: string;
  emoji: string;
  video_ids: string[];
}

export type FuriganaMode = 'all' | 'learning_only' | 'off';
export type ReadingGuideMode = 'hiragana' | 'romaji' | 'off';
export type AIProvider = 'local' | 'tenixe' | 'kob-ai';
export type KobAIModel = 'nemotron-3-ultra' | 'minimax-m3.1-flash' | 'deepseek-v4.1-flash';

interface AppContextType {
  // Navigation
  activeTab: 'feed' | 'player' | 'words' | 'dojo' | 'profile';
  setActiveTab: (tab: 'feed' | 'player' | 'words' | 'dojo' | 'profile') => void;

  // Videos
  videos: VideoRecord[];
  activeVideoId: string;
  setActiveVideoId: (id: string) => void;
  activeVideo: VideoRecord;
  activeSubtitleLines: SubtitleLineRecord[];
  captionsLoading: boolean;
  getLineById: (videoId: string | undefined, lineId: string | undefined) => SubtitleLineRecord | undefined;
  getLinesForVideo: (videoId: string) => SubtitleLineRecord[];
  addCustomVideo: (video: VideoRecord, lines: SubtitleLineRecord[]) => void;
  removeCustomVideo: (id: string) => void;
  isCustomVideo: (id: string) => boolean;

  // Word States
  wordStates: Record<string, WordLearningStatus>;
  setWordStatus: (wordId: string, status: WordLearningStatus) => void;
  getWordStatus: (wordId: string) => WordLearningStatus;
  // null = not computable yet (captions still loading) or no content words.
  getKnownWordPercentage: (videoId: string) => number | null;
  // Word index (src/data/captions/word-index.json) that gives the feed's known %; loaded on demand.
  wordIndexStatus: 'idle' | 'loading' | 'ready' | 'failed';
  ensureWordIndexLoaded: () => void;
  dictionaryWords: DictionaryWordRecord[];

  // Subtitles & Player UI Preferences
  furiganaMode: FuriganaMode;
  setFuriganaMode: (mode: FuriganaMode) => void;
  readingGuideMode: ReadingGuideMode;
  setReadingGuideMode: (mode: ReadingGuideMode) => void;
  showPitchAccent: boolean;
  setShowPitchAccent: (show: boolean) => void;
  showMicroGloss: boolean;
  setShowMicroGloss: (show: boolean) => void;

  // Selected Token & Contextual Modal
  selectedToken: { token: SubtitleTokenJSON; line: SubtitleLineRecord } | null;
  setSelectedToken: (data: { token: SubtitleTokenJSON; line: SubtitleLineRecord } | null) => void;

  // Sentence Mining
  minedSentences: MinedSentenceRecord[];
  mineSentence: (line: SubtitleLineRecord, targetWordId?: string, note?: string) => void;
  removeMinedSentence: (id: string) => void;
  updateSRSReview: (minedId: string, grade: 'again' | 'hard' | 'good' | 'easy') => void;

  // Albums
  albums: Album[];
  createAlbum: (name: string, emoji: string) => void;
  addVideoToAlbum: (albumId: string, videoId: string) => void;

  // Gamification & XP
  stats: UserStats;
  addXP: (type: 'viewing' | 'reading' | 'listening' | 'shadowing', amount: number) => void;
  addImmersionSeconds: (seconds: number) => void;

  // AI & External API Settings (Tenixe / Kob AI / Local)
  aiProvider: AIProvider;
  setAiProvider: (provider: AIProvider) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  callAICompletion: (prompt: string, systemPrompt?: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | null>(null);

// Part-of-speech labels (Thai, from captions.ts POS_THAI) that are not content words.
const NON_CONTENT_POS = new Set(['คำช่วย', 'คำช่วยกริยา', 'เครื่องหมาย']);
// Dictionary ids: a token whose word_id is here is linked to a dictionary entry.
const DICTIONARY_IDS = new Set(DICTIONARY_WORDS.map((w) => w.id));

const DEFAULT_ALBUMS: Album[] = [
  { id: 'alb-daily', name: 'Anime Starter Episodes', emoji: '⚔️', video_ids: ['vid-anione-jjk-01', 'vid-anione-bleach-01', 'vid-anione-aoashi-s2-01'] },
  { id: 'alb-favorites', name: 'Must-Watch Anime', emoji: '🌟', video_ids: ['vid-anione-jjk-01', 'vid-anione-jjk-02', 'vid-anione-bleach-01'] },
];

export const LAST_VIDEO_KEY = 'umami_last_video';
const DEFAULT_VIDEO_ID = 'vid-anione-jjk-01';
// Read once at startup: whether the user opened a clip in an earlier session (storage may be unavailable).
const storedLastVideo: string | null = (() => {
  try {
    return localStorage.getItem(LAST_VIDEO_KEY);
  } catch {
    return null;
  }
})();
/** True when the feed should offer "ดูต่อ" for this clip id. */
export const isResumableClip = (id: string) => storedLastVideo !== null || id !== DEFAULT_VIDEO_ID;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'player' | 'words' | 'dojo' | 'profile'>('feed');
  // Last opened clip survives restarts (feed shows it as "ดูต่อ"); storage can be unavailable, so guard it.
  const [activeVideoId, setActiveVideoId] = useState<string>(storedLastVideo || DEFAULT_VIDEO_ID);
  useEffect(() => {
    // Don't record the built-in default as "watched" before the user picked anything.
    if (storedLastVideo === null && activeVideoId === DEFAULT_VIDEO_ID) return;
    try {
      localStorage.setItem(LAST_VIDEO_KEY, activeVideoId);
    } catch {
      /* private mode / blocked storage: keep the in-memory value */
    }
  }, [activeVideoId]);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // External API Config (Kob AI active by default with user key)
  const [apiKey, setApiKeyState] = useState<string>(() => {
    // No built-in key: the user enters their own key in Settings; it is stored only on this device.
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  });
  const [aiModel, setAiModelState] = useState<string>(() => {
    // nemotron-3-ultra takes minutes per reply; migrate saved Tenixe choices to claude-haiku-5-5.
    let saved = localStorage.getItem(STORAGE_KEYS.AI_MODEL) || '';
    const savedProvider = localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) || 'tenixe';
    if (savedProvider === 'tenixe' && (!saved || saved === 'nemotron-3-ultra')) {
      saved = 'claude-haiku-5-5';
      try {
        localStorage.setItem(STORAGE_KEYS.AI_MODEL, saved);
      } catch {
        // storage unavailable: the in-memory default still applies
      }
    }
    return saved || 'claude-haiku-5-5';
  });
  const [aiProvider, setAiProviderState] = useState<AIProvider>(() => {
    return (localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) as AIProvider) || 'tenixe';
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  };

  const setAiModel = (model: string) => {
    setAiModelState(model);
    localStorage.setItem(STORAGE_KEYS.AI_MODEL, model);
  };

  const setAiProvider = (provider: AIProvider) => {
    setAiProviderState(provider);
    localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, provider);
  };

  // Custom videos imported by user
  const [customVideos, setCustomVideos] = useState<VideoRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customLines, setCustomLines] = useState<Record<string, SubtitleLineRecord[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_LINES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const allVideos = [...MOCK_VIDEOS, ...customVideos];
  // Precedence: user-made custom lines > real YouTube captions > hand-written MOCK lines.
  const manualLines = { ...MOCK_SUBTITLE_LINES, ...customLines };
  // Real captions per video record id, loaded on demand. null = no caption file (MOCK fallback).
  const [realLines, setRealLines] = useState<Record<string, SubtitleLineRecord[] | null>>({});
  const [wordIndex, setWordIndex] = useState<WordIndex | null>(null);
  const [wordIndexStatus, setWordIndexStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const allLines = useMemo(() => {
    const real: Record<string, SubtitleLineRecord[]> = {};
    for (const [id, lines] of Object.entries(realLines)) {
      if (lines) real[id] = lines;
    }
    return { ...MOCK_SUBTITLE_LINES, ...real, ...customLines };
  }, [realLines, customLines]);

  const activeVideo = allVideos.find((v) => v.id === activeVideoId) || allVideos[0];
  // While the active video's real captions load, show no lines (player shows a loading text)
  // instead of the hand-written MOCK lines. Custom lines are shown immediately.
  const captionsLoading =
    !!activeVideo.youtube_id && !(activeVideo.id in realLines) && !customLines[activeVideo.id];
  const activeSubtitleLines = captionsLoading ? [] : allLines[activeVideo.id] || [];

  const getLinesForVideo = (videoId: string): SubtitleLineRecord[] => allLines[videoId] || [];
  const getLineById = (videoId: string | undefined, lineId: string | undefined): SubtitleLineRecord | undefined => {
    if (!lineId) return undefined;
    if (videoId) return (allLines[videoId] || []).find((l) => l.id === lineId);
    for (const list of Object.values(allLines)) {
      const found = list.find((l) => l.id === lineId);
      if (found) return found;
    }
    return undefined;
  };

  // Word status tracking
  const [wordStates, setWordStates] = useState<Record<string, WordLearningStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORD_STATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Mined sentences collection
  const [minedSentences, setMinedSentences] = useState<MinedSentenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MINED_SENTENCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Drop persisted sentences whose video no longer exists (deleted records or stale seeds).
          const knownVideoIds = new Set([...MOCK_VIDEOS, ...customVideos].map((v) => v.id));
          return parsed.filter((item: MinedSentenceRecord) => knownVideoIds.has(item.video_id));
        }
      }
    } catch {}
    return [];
  });

  // User Stats & Gamification XP
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      streak_days: 0,
      total_immersion_minutes: 0,
      xp_viewing: 0,
      xp_reading: 0,
      xp_listening: 0,
      xp_shadowing: 0,
    };
  });

  // User Albums
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALBUMS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ALBUMS;
  });

  // Subtitle Preferences
  const [furiganaMode, setFuriganaMode] = useState<FuriganaMode>('all');
  const [readingGuideMode, setReadingGuideModeState] = useState<ReadingGuideMode>(() => {
    return (localStorage.getItem('umami_reading_guide_mode') as ReadingGuideMode) || 'hiragana';
  });
  const setReadingGuideMode = (mode: ReadingGuideMode) => {
    setReadingGuideModeState(mode);
    localStorage.setItem('umami_reading_guide_mode', mode);
  };
  const [showPitchAccent, setShowPitchAccent] = useState<boolean>(true);
  const [showMicroGloss, setShowMicroGloss] = useState<boolean>(true);

  // Selected word token for the popup dictionary
  const [selectedToken, setSelectedToken] = useState<{
    token: SubtitleTokenJSON;
    line: SubtitleLineRecord;
  } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORD_STATES, JSON.stringify(wordStates));
  }, [wordStates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MINED_SENTENCES, JSON.stringify(minedSentences));
  }, [minedSentences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  // Once the last-active day is persisted inside the stats object, the legacy separate key is obsolete.
  useEffect(() => {
    if (!stats.last_active_day) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_DAY);
    } catch {}
  }, [stats.last_active_day]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(customVideos));
  }, [customVideos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LINES, JSON.stringify(customLines));
  }, [customLines]);

  const setWordStatus = (wordId: string, status: WordLearningStatus) => {
    setWordStates((prev) => ({ ...prev, [wordId]: status }));
    if (status === 'known') addXP('reading', 15);
    else if (status === 'learning') addXP('reading', 5);
  };

  const getWordStatus = (wordId: string): WordLearningStatus => {
    return wordStates[wordId] || 'new';
  };

  // Known % of a clip = unique content words whose status is 'known' / unique content words.
  // Content words exclude particles, auxiliaries and punctuation (Thai POS labels from captions.ts).
  // Linked words are keyed by dictionary id; unlinked ones by lemma. No minimum floor.
  // Returns null when the clip's captions are not loaded yet (never falls back to MOCK lines for real clips).
  // Per clip: content-word key -> dictionary/lemma-linked word_ids (all occurrences in the clip).
  // Memoized on the line data only, so it is not rebuilt on every render or status change.
  const clipWordIds = useMemo(() => {
    const out: Record<string, Map<string, string[]>> = {};
    for (const [videoId, lines] of Object.entries(allLines)) {
      const words = new Map<string, string[]>();
      for (const line of lines) {
        for (const t of line.tokens_json) {
          if (NON_CONTENT_POS.has(t.part_of_speech || '')) continue;
          const key = DICTIONARY_IDS.has(t.word_id) ? `id:${t.word_id}` : `lemma:${t.lemma || t.surface}`;
          const ids = words.get(key);
          if (ids) ids.push(t.word_id);
          else words.set(key, [t.word_id]);
        }
      }
      out[videoId] = words;
    }
    return out;
  }, [allLines]);

  // Known % per clip with real captions, from the word index (no caption file is loaded for it).
  // Each index key resolves to a dictionary id (linked) or to its lemma (unlinked, never known).
  // Unique resolved keys / unique content words, known = linked id whose status is 'known'.
  const knownPctByYoutubeId = useMemo(() => {
    const out: Record<string, number | null> = {};
    if (!wordIndex) return out;
    for (const [youtubeId, keys] of Object.entries(wordIndex)) {
      const resolved = new Map<string, boolean>(); // resolved key -> known
      for (const key of keys) {
        const entry = linkWordIndexKey(key);
        const rk = entry ? `id:${entry.id}` : `lemma:${key.slice(0, key.indexOf('|'))}`;
        // Unlinked words carry the stable id g:<lemma>|<reading> (data/captions glossWordId), same as the key.
        const known = entry ? wordStates[entry.id] === 'known' : wordStates[`g:${key}`] === 'known';
        resolved.set(rk, (resolved.get(rk) ?? false) || known);
      }
      if (resolved.size === 0) {
        out[youtubeId] = null;
        continue;
      }
      let known = 0;
      for (const isKnown of resolved.values()) if (isKnown) known++;
      out[youtubeId] = Math.round((known / resolved.size) * 100);
    }
    return out;
  }, [wordIndex, wordStates]);

  // Known % per clip with custom (non-YouTube) lines, from their tokens.
  // Known = unique content word with any occurrence whose status is 'known'. No floor; null = no content words.
  const knownPctByVideo = useMemo(() => {
    const out: Record<string, number | null> = {};
    for (const [videoId, words] of Object.entries(clipWordIds)) {
      if (words.size === 0) {
        out[videoId] = null;
        continue;
      }
      let known = 0;
      for (const ids of words.values()) {
        if (ids.some((id) => wordStates[id] === 'known')) known++;
      }
      out[videoId] = Math.round((known / words.size) * 100);
    }
    return out;
  }, [clipWordIds, wordStates]);

  // null = not known yet ("…" while the index loads, "—" when it failed or the clip has no content words).
  const getKnownWordPercentage = (videoId: string): number | null => {
    const video = allVideos.find((v) => v.id === videoId);
    if (!video) return null;
    if (video.youtube_id && !customLines[videoId]) {
      return knownPctByYoutubeId[video.youtube_id] ?? null;
    }
    return knownPctByVideo[videoId] ?? null;
  };

  // Loads the word index once (a single small JSON, not the caption files). Called by the feed.
  const ensureWordIndexLoaded = () => {
    if (wordIndexStatus !== 'idle') return;
    setWordIndexStatus('loading');
    loadWordIndex().then((idx) => {
      if (idx) {
        setWordIndex(idx);
        setWordIndexStatus('ready');
      } else {
        setWordIndexStatus('failed');
      }
    });
  };

  const addXP = (type: 'viewing' | 'reading' | 'listening' | 'shadowing', amount: number) => {
    setStats((prev) => ({
      ...prev,
      [`xp_${type}`]: prev[`xp_${type}`] + amount,
      daily_xp: bumpToday(prev.daily_xp, amount),
    }));
  };

  // Real playing time from the player (fractional minutes; the profile shows whole minutes).
  const addImmersionSeconds = (seconds: number) => {
    if (!(seconds > 0)) return;
    setStats((prev) => ({
      ...prev,
      total_immersion_minutes: prev.total_immersion_minutes + seconds / 60,
      daily_minutes: bumpToday(prev.daily_minutes, seconds / 60),
    }));
  };

  // Counts one day of app use: streak +1 on the next consecutive local day, restart at 1 after a gap.
  // The last-active day lives inside the stats object (one write with the streak). A legacy separate key
  // from 1.0.8 test builds is read once when the stats do not have it yet, and removed after it is persisted.
  const recordDailyActivity = () => {
    try {
      const now = new Date();
      const today = localDayKey(now);
      const legacyLast = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DAY);
      setStats((prev) => {
        const last = prev.last_active_day ?? legacyLast;
        if (last === today) {
          return prev.last_active_day === today ? prev : { ...prev, last_active_day: today };
        }
        return {
          ...prev,
          streak_days: nextStreak(prev.streak_days, last ?? null, today, now),
          last_active_day: today,
        };
      });
    } catch {}
  };

  useEffect(() => {
    recordDailyActivity();
    const onVisible = () => {
      if (document.visibilityState === 'visible') recordDailyActivity();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
    // Runs once on mount; the day check inside makes repeated calls harmless.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mineSentence = (line: SubtitleLineRecord, targetWordId?: string, note?: string) => {
    // Lines without Japanese text (Thai-only captions) cannot be mined.
    if (!line || !line.tokens_json || !line.raw_text) return;
    const target = targetWordId || (line.tokens_json[0] ? line.tokens_json[0].word_id : 'generic');
    const existing = minedSentences.find(
      (m) => m.subtitle_line_id === line.id && m.target_word_id === target
    );
    if (existing) return;

    const newMined: MinedSentenceRecord = {
      id: `mined-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: 'local_user',
      video_id: line.video_id,
      subtitle_line_id: line.id,
      target_word_id: target,
      user_note: note || '',
      album_id: albums[0]?.id || '',
      srs_interval: 1,
      srs_ease: 2.5,
      srs_repetitions: 0,
      next_review_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setMinedSentences((prev) => [newMined, ...prev]);
    addXP('reading', 20);
  };

  const removeMinedSentence = (id: string) => {
    setMinedSentences((prev) => prev.filter((m) => m.id !== id));
  };

  const updateSRSReview = (minedId: string, grade: 'again' | 'hard' | 'good' | 'easy') => {
    setMinedSentences((prev) =>
      prev.map((card) => {
        if (card.id !== minedId) return card;

        let interval = card.srs_interval;
        let ease = card.srs_ease;
        let repetitions = card.srs_repetitions;

        if (grade === 'again') {
          interval = 0.5;
          repetitions = 0;
          ease = Math.max(1.3, ease - 0.2);
        } else if (grade === 'hard') {
          interval = Math.max(1, interval * 1.2);
          ease = Math.max(1.3, ease - 0.15);
          repetitions += 1;
        } else if (grade === 'good') {
          if (repetitions === 0) interval = 1;
          else if (repetitions === 1) interval = 3;
          else interval = Math.round(interval * ease);
          repetitions += 1;
        } else if (grade === 'easy') {
          if (repetitions === 0) interval = 2;
          else if (repetitions === 1) interval = 5;
          else interval = Math.round(interval * ease * 1.4);
          ease += 0.15;
          repetitions += 1;
        }

        const nextDate = new Date();
        nextDate.setHours(nextDate.getHours() + Math.round(interval * 24));

        return {
          ...card,
          srs_interval: interval,
          srs_ease: ease,
          srs_repetitions: repetitions,
          next_review_at: nextDate.toISOString(),
        };
      })
    );
    addXP('reading', 10);
    addXP('listening', 10);
  };

  const createAlbum = (name: string, emoji: string) => {
    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      name,
      emoji: emoji || '📁',
      video_ids: [],
    };
    setAlbums((prev) => [...prev, newAlbum]);
  };

  const addVideoToAlbum = (albumId: string, videoId: string) => {
    setAlbums((prev) =>
      prev.map((alb) =>
        alb.id === albumId && !alb.video_ids.includes(videoId)
          ? { ...alb, video_ids: [...alb.video_ids, videoId] }
          : alb
      )
    );
  };

  const addCustomVideo = (video: VideoRecord, lines: SubtitleLineRecord[]) => {
    setCustomVideos((prev) => [video, ...prev]);
    setCustomLines((prev) => ({ ...prev, [video.id]: lines }));
    setActiveVideoId(video.id);
    setActiveTab('player');
  };

  const isCustomVideo = (id: string): boolean => customVideos.some((v) => v.id === id);

  // Removes a user-imported clip together with its custom lines and any mined sentences on it.
  const removeCustomVideo = (id: string) => {
    setCustomVideos((prev) => prev.filter((v) => v.id !== id));
    setCustomLines((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setMinedSentences((prev) => prev.filter((m) => m.video_id !== id));
    setAlbums((prev) =>
      prev.map((alb) =>
        alb.video_ids.includes(id) ? { ...alb, video_ids: alb.video_ids.filter((vid) => vid !== id) } : alb
      )
    );
    if (activeVideoId === id) setActiveVideoId('vid-anione-jjk-01');
  };

  // Tenixe / Kob AI caller. Tenixe uses streaming SSE (avoids the ~55 s non-streaming cut-off).
  const NO_KEY_MESSAGE = 'ยังไม่ได้ใส่ API key — ไปที่ ⚙️ ตั้งค่า แล้วเลือก Tenixe และวาง key ของคุณ';
  const TENIXE_ENDPOINT = 'https://api.tenixe.com/api/v1/chat/completions';
  const KOB_MODELS: string[] = ['nemotron-3-ultra', 'minimax-m3.1-flash', 'deepseek-v4.1-flash'];

  // Short, key-free text for error messages: whitespace collapsed, API key masked, max 120 chars.
  const snippetOf = (text: string, key: string): string => {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    const masked = key ? clean.split(key).join('***') : clean;
    return masked.slice(0, 120);
  };

  const describeAIError = (err: unknown, key: string): string => {
    if (err instanceof Error) {
      const msg = snippetOf(err.message, key);
      return err.name && err.name !== 'Error' ? `${err.name}: ${msg}` : msg;
    }
    return snippetOf(String(err), key) || 'unknown error';
  };

  const streamTenixeChat = async (
    key: string,
    model: string,
    messages: { role: string; content: string }[],
    maxTokens: number
  ): Promise<string> => {
    const response = await fetch(TENIXE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        stream: true,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}${body ? `: ${snippetOf(body, key)}` : ''}`);
    }
    if (!response.body) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let output = '';
    let finished = false;

    const handleLine = (rawLine: string) => {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) return;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') {
        finished = true;
        return;
      }
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === 'string') output += delta;
      } catch {
        // ignore keep-alive or partial JSON lines
      }
    };

    while (!finished) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx = buffer.indexOf('\n');
      while (idx >= 0 && !finished) {
        handleLine(buffer.slice(0, idx));
        buffer = buffer.slice(idx + 1);
        idx = buffer.indexOf('\n');
      }
    }
    if (!finished && buffer) handleLine(buffer);
    try {
      await reader.cancel();
    } catch {
      // stream already closed
    }
    return output.trim();
  };

  const callAICompletion = async (prompt: string, systemPrompt?: string): Promise<string> => {
    const key = apiKey.trim();
    if (aiProvider === 'local' || !key) return NO_KEY_MESSAGE;

    const messages = [
      {
        role: 'system',
        content:
          systemPrompt ||
          'You are an expert Japanese tutor for the うまみ (Umami) Japanese Immersion app. Answer in clear natural Japanese with English explanations.',
      },
      { role: 'user', content: prompt },
    ];

    if (aiProvider === 'tenixe') {
      const primaryModel = aiModel || 'claude-haiku-5-5';
      const failures: string[] = [];
      try {
        const text = await streamTenixeChat(key, primaryModel, messages, 800);
        if (text) return text;
        throw new Error('empty response');
      } catch (err) {
        const detail = describeAIError(err, key);
        failures.push(`${primaryModel}: ${detail}`);
        console.warn(`Tenixe primary model ${primaryModel} failed, retrying with deepseek-v4-flash:`, err);
      }
      try {
        // Reasoning model: needs a large max_tokens budget
        const text = await streamTenixeChat(key, 'deepseek-v4-flash', messages, 20000);
        if (text) return text;
        throw new Error('empty response');
      } catch (err) {
        const detail = describeAIError(err, key);
        failures.push(`deepseek-v4-flash: ${detail}`);
        console.error('Tenixe fallback model deepseek-v4-flash failed:', err);
      }
      return `AI ตอบกลับไม่สำเร็จ (${failures.join('; ')})`;
    }

    // Kob AI (non-streaming, unchanged behaviour)
    try {
      const response = await fetch('https://kob-ai.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: KOB_MODELS.includes(aiModel) ? aiModel : 'minimax-m3.1-flash',
          messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const choice = data.choices?.[0]?.message;
        return choice?.content?.trim() || choice?.reasoning?.trim() || 'AI returned an empty response.';
      }
      const errorBody = await response.text().catch(() => '');
      console.error('API error:', response.status, errorBody);
      return `AI ตอบกลับไม่สำเร็จ (HTTP ${response.status}${errorBody ? `: ${snippetOf(errorBody, key)}` : ''})`;
    } catch (err: any) {
      console.error('Failed to call AI API:', err);
      return `AI ตอบกลับไม่สำเร็จ (${describeAIError(err, key)})`;
    }
  };

  const [glossaryReady, setGlossaryReady] = useState(false);
  useEffect(() => {
    loadGlossary().then(() => setGlossaryReady(true));
  }, []);

  // Automatically derive full dictionary from DICTIONARY_WORDS + all video subtitle tokens
  const dictionaryWords = React.useMemo(() => {
    const map = new Map<string, DictionaryWordRecord>();
    DICTIONARY_WORDS.forEach((w) => map.set(w.id, w));

    // Dictionary is derived from manual lines only, not real captions (keeps caption tokens out of the dictionary).
    Object.values(manualLines).forEach((lines) => {
      lines.forEach((line) => {
        line.tokens_json.forEach((t) => {
          if (!map.has(t.word_id) && t.surface) {
            map.set(t.word_id, {
              id: t.word_id,
              lemma: t.lemma || t.surface,
              reading_kana: t.reading_kana || t.surface,
              romaji: t.romaji || '',
              pitch_accent: t.pitch_accent || 'LHH',
              pitch_morae: t.pitch_morae || [],
              jlpt_level: t.jlpt_level || 'N5',
              frequency_rank: 50,
              part_of_speech: t.part_of_speech || 'Word',
              core_meanings: [t.thai_meaning || t.contextual_meaning || ''],
            });
          }
        });
      });
    });

    // Words marked in real clips (stable ids g:<lemma>|<reading>) join the deck, with their glossary meaning.
    Object.keys(wordStates).forEach((id) => {
      if (!id.startsWith(GLOSS_ID_PREFIX) || map.has(id)) return;
      const [lemma, reading = ''] = id.slice(GLOSS_ID_PREFIX.length).split('|');
      if (!lemma) return;
      map.set(id, {
        id,
        lemma,
        reading_kana: reading || lemma,
        romaji: '',
        pitch_accent: '',
        pitch_morae: [],
        jlpt_level: 'N5',
        frequency_rank: 999,
        part_of_speech: 'คำจากคลิป',
        core_meanings: glossaryFor(lemma, reading) ?? [],
      });
    });

    return Array.from(map.values());
    // glossaryReady: rebuild once the glossary has loaded so clip words get their meanings.
  }, [manualLines, wordStates, glossaryReady]);

  // Load real captions for the active video and for every video that has mined sentences.
  const neededVideoKey = Array.from(
    new Set([activeVideo.id, ...minedSentences.map((m) => m.video_id)])
  ).join('|');
  useEffect(() => {
    let cancelled = false;
    neededVideoKey.split('|').forEach((videoId) => {
      const video = allVideos.find((v) => v.id === videoId);
      if (!video || !video.youtube_id) return;
      loadCaptionFile(video.youtube_id).then((file) => {
        if (cancelled) return;
        setRealLines((prev) =>
          videoId in prev
            ? prev
            : { ...prev, [videoId]: file ? buildRealSubtitleLines(file, videoId, video.primary_jlpt) : null }
        );
      });
    });
    return () => {
      cancelled = true;
    };
    // allVideos is derived from state each render; the key captures what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neededVideoKey]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        videos: allVideos,
        activeVideoId,
        setActiveVideoId,
        activeVideo,
        activeSubtitleLines,
        captionsLoading,
        getLineById,
        getLinesForVideo,
        addCustomVideo,
        removeCustomVideo,
        isCustomVideo,
        wordStates,
        setWordStatus,
        getWordStatus,
        getKnownWordPercentage,
        wordIndexStatus,
        ensureWordIndexLoaded,
        dictionaryWords,
        furiganaMode,
        setFuriganaMode,
        readingGuideMode,
        setReadingGuideMode,
        showPitchAccent,
        setShowPitchAccent,
        showMicroGloss,
        setShowMicroGloss,
        selectedToken,
        setSelectedToken,
        minedSentences,
        mineSentence,
        removeMinedSentence,
        updateSRSReview,
        albums,
        createAlbum,
        addVideoToAlbum,
        stats,
        addXP,
        addImmersionSeconds,
        aiProvider,
        setAiProvider,
        apiKey,
        setApiKey,
        aiModel,
        setAiModel,
        showSettingsModal,
        setShowSettingsModal,
        callAICompletion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
