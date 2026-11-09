// localStorage keys shared by AppContext and the one-time migrations (src/utils/migration108.ts).
export const STORAGE_KEYS = {
  WORD_STATES: 'umami_word_states_v1',
  MINED_SENTENCES: 'umami_mined_sentences_v1',
  STATS: 'umami_user_stats_v1',
  ALBUMS: 'umami_albums_v1',
  CUSTOM_VIDEOS: 'umami_custom_videos_v1',
  CUSTOM_LINES: 'umami_custom_lines_v1',
  API_KEY: 'umami_api_key_v1',
  AI_MODEL: 'umami_ai_model_v1',
  AI_PROVIDER: 'umami_ai_provider_v1',
  LAST_ACTIVE_DAY: 'umami_last_active_day_v1',
} as const;
