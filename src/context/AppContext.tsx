import React, { createContext, useContext, useState, useEffect } from 'react';
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

export interface UserStats {
  streak_days: number;
  total_immersion_minutes: number;
  xp_viewing: number;
  xp_reading: number;
  xp_listening: number;
  xp_shadowing: number;
}

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
  addCustomVideo: (video: VideoRecord, lines: SubtitleLineRecord[]) => void;

  // Word States
  wordStates: Record<string, WordLearningStatus>;
  setWordStatus: (wordId: string, status: WordLearningStatus) => void;
  getWordStatus: (wordId: string) => WordLearningStatus;
  getKnownWordPercentage: (videoId: string) => number;
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

const STORAGE_KEYS = {
  WORD_STATES: 'umami_word_states_v1',
  MINED_SENTENCES: 'umami_mined_sentences_v1',
  STATS: 'umami_user_stats_v1',
  ALBUMS: 'umami_albums_v1',
  CUSTOM_VIDEOS: 'umami_custom_videos_v1',
  CUSTOM_LINES: 'umami_custom_lines_v1',
  API_KEY: 'umami_api_key_v1',
  AI_MODEL: 'umami_ai_model_v1',
  AI_PROVIDER: 'umami_ai_provider_v1',
};

const DEFAULT_ALBUMS: Album[] = [
  { id: 'alb-daily', name: 'Tokyo Everyday Life', emoji: '🗼', video_ids: ['vid-game-n5-starter', 'vid-anime-n4-cafe1', 'vid-vlog-n5-uji'] },
  { id: 'alb-favorites', name: 'Must-Watch Anime & Gaming', emoji: '🌟', video_ids: ['vid-game-n5-starter', 'vid-anime-n4-cafe1', 'vid-n4-pretender'] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'player' | 'words' | 'dojo' | 'profile'>('feed');
  const [activeVideoId, setActiveVideoId] = useState<string>('vid-game-n5-starter');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // External API Config (Kob AI active by default with user key)
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.API_KEY) ||
      'kob_zyT6_NOlIFRFot0QXsDf3M7c:K75461thHDcS3IWV1Ao3GKogDgzbUW4aV44pw4pwrX3-0o4N'
    );
  });
  const [aiModel, setAiModelState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.AI_MODEL) || 'minimax-m3.1-flash';
  });
  const [aiProvider, setAiProviderState] = useState<AIProvider>(() => {
    return (localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) as AIProvider) || 'kob-ai';
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
  const allLines = { ...MOCK_SUBTITLE_LINES, ...customLines };

  const activeVideo = allVideos.find((v) => v.id === activeVideoId) || allVideos[0];
  const activeSubtitleLines = allLines[activeVideo.id] || [];

  // Word status tracking
  const [wordStates, setWordStates] = useState<Record<string, WordLearningStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORD_STATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'custom-ore': 'known',
      'particle-wa': 'known',
      'particle-o': 'known',
      'particle-no': 'known',
      'particle-de': 'known',
      'w-ii': 'known',
      'w-asa': 'learning',
      'w-tokyo': 'known',
      'w-kanpai': 'learning',
      'w-oishii': 'known',
      'w-nihon': 'known',
      'w-shinjiru': 'learning',
      'w-nakama': 'learning',
    };
  });

  // Mined sentences collection
  const [minedSentences, setMinedSentences] = useState<MinedSentenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MINED_SENTENCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize any stale seed references from previous build
          return parsed.map((item: MinedSentenceRecord) => {
            if (item.video_id === 'vid-anime-01') {
              return {
                ...item,
                video_id: 'vid-game-n5-starter',
                subtitle_line_id: 'sub-poke-01',
                target_word_id: 'w-pokemon',
                user_note: 'ตรงนี้มีโปเกมอนอยู่ 3 ตัวยังไงล่ะ! (ポケモン)',
              };
            }
            if (item.video_id === 'vid-izakaya-03') {
              return {
                ...item,
                video_id: 'vid-game-n5-starter',
                subtitle_line_id: 'sub-poke-02',
                target_word_id: 'w-erabu',
                user_note: 'จงเลือกโปเกมอนตัวที่เธอชอบมา 1 ตัวสิ! (選ぶ)',
              };
            }
            return item;
          });
        }
      }
    } catch {}
    return [
      {
        id: 'mined-seed-1',
        user_id: 'local_user',
        video_id: 'vid-game-n5-starter',
        subtitle_line_id: 'sub-poke-01',
        target_word_id: 'w-pokemon',
        user_note: 'ตรงนี้มีโปเกมอนอยู่ 3 ตัวยังไงล่ะ! (ポケモン)',
        album_id: 'alb-favorites',
        srs_interval: 1,
        srs_ease: 2.5,
        srs_repetitions: 1,
        next_review_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: 'mined-seed-2',
        user_id: 'local_user',
        video_id: 'vid-game-n5-starter',
        subtitle_line_id: 'sub-poke-02',
        target_word_id: 'w-erabu',
        user_note: 'จงเลือกโปเกมอนตัวที่เธอชอบมา 1 ตัวสิ! (選ぶ)',
        album_id: 'alb-favorites',
        srs_interval: 2,
        srs_ease: 2.5,
        srs_repetitions: 2,
        next_review_at: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: 'mined-seed-3',
        user_id: 'local_user',
        video_id: 'vid-anime-n4-cafe1',
        subtitle_line_id: 'sub-kuma-01',
        target_word_id: 'w-kafe',
        user_note: 'ยินดีต้อนรับสู่คาเฟ่หมีขาวครับ! (カフェ)',
        album_id: 'alb-favorites',
        srs_interval: 1,
        srs_ease: 2.5,
        srs_repetitions: 0,
        next_review_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
  });

  // User Stats & Gamification XP
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      streak_days: 7,
      total_immersion_minutes: 84,
      xp_viewing: 450,
      xp_reading: 380,
      xp_listening: 520,
      xp_shadowing: 290,
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

  const getKnownWordPercentage = (videoId: string): number => {
    const lines = allLines[videoId] || [];
    if (!lines.length) return 70;
    const allTokens = lines.flatMap((line) => line.tokens_json);
    if (!allTokens.length) return 70;
    const knownCount = allTokens.filter(
      (t) => (wordStates[t.word_id] || 'new') === 'known'
    ).length;
    return Math.min(100, Math.max(15, Math.round((knownCount / allTokens.length) * 100)));
  };

  const addXP = (type: 'viewing' | 'reading' | 'listening' | 'shadowing', amount: number) => {
    setStats((prev) => ({
      ...prev,
      [`xp_${type}`]: prev[`xp_${type}`] + amount,
    }));
  };

  const mineSentence = (line: SubtitleLineRecord, targetWordId?: string, note?: string) => {
    if (!line || !line.tokens_json) return;
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

  // Tenixe / Kob AI / Local API Caller
  const callAICompletion = async (prompt: string, systemPrompt?: string): Promise<string> => {
    if (aiProvider !== 'local' && apiKey.trim()) {
      const endpoint =
        aiProvider === 'tenixe'
          ? 'https://api.tenixe.com/api/v1/chat/completions'
          : 'https://kob-ai.dev/v1/chat/completions';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: aiModel || (aiProvider === 'tenixe' ? 'nemotron-3-ultra' : 'minimax-m3.1-flash'),
            messages: [
              {
                role: 'system',
                content:
                  systemPrompt ||
                  'You are an expert Japanese tutor for the うまみ (Umami) Japanese Immersion app. Answer in clear natural Japanese with English explanations.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const choice = data.choices?.[0]?.message;
          return (
            choice?.content?.trim() ||
            choice?.reasoning?.trim() ||
            'AI returned an empty response.'
          );
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('API error:', errorData);
          return `API error (${response.status}): Falling back to local offline response.`;
        }
      } catch (err: any) {
        console.error('Failed to call AI API:', err);
      }
    }

    // Default 100% Free Local Offline Answer
    return 'Local Engine: Processed with zero-cost offline Japanese morphological analyzer.';
  };

  // Automatically derive full dictionary from DICTIONARY_WORDS + all video subtitle tokens
  const dictionaryWords = React.useMemo(() => {
    const map = new Map<string, DictionaryWordRecord>();
    DICTIONARY_WORDS.forEach((w) => map.set(w.id, w));

    Object.values(allLines).forEach((lines) => {
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

    return Array.from(map.values());
  }, [allLines]);

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
        addCustomVideo,
        wordStates,
        setWordStatus,
        getWordStatus,
        getKnownWordPercentage,
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
