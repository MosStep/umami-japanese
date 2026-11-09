import type { WordLearningStatus } from '../schema/databaseSchema';
import { STORAGE_KEYS } from '../config/storageKeys';

// One-time cleanup for users upgrading from 1.0.7 (or earlier) to 1.0.8.
// Removes the hand-seeded demo data that was shipped as "real" stats, and broken
// user-imported clips. Runs once (flag below); it is NOT idempotent for the stats step
// (subtracting the seed twice would be wrong), so the flag is the guard.
export const MIGRATION_108_FLAG = 'umami_migr_108_v1';

// Exact values seeded by AppContext in 1.0.7.
export const SEED_STATS = {
  streak_days: 7,
  total_immersion_minutes: 84,
  xp_viewing: 450,
  xp_reading: 380,
  xp_listening: 520,
  xp_shadowing: 290,
} as const;

export const SEED_WORD_STATES: Record<string, WordLearningStatus> = {
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

export const SEED_MINED_ID_PREFIX = 'mined-seed-';

const XP_KEYS = ['xp_viewing', 'xp_reading', 'xp_listening', 'xp_shadowing'] as const;

const MIN_CLIP_SECONDS = 15;

function parse<T>(raw: string | null): T | null {
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function runMigration108(storage: Storage = localStorage): void {
  try {
    if (storage.getItem(MIGRATION_108_FLAG) === '1') return;

    // 1. User-imported clips with no subtitle lines or <= 15 s long (the broken "Codeguass" imports).
    const videos = parse<any[]>(storage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS));
    const customLines = parse<Record<string, unknown[]>>(storage.getItem(STORAGE_KEYS.CUSTOM_LINES));
    const removedVideoIds = new Set<string>();
    if (Array.isArray(videos)) {
      const keptVideos = videos.filter((v) => {
        const lines = customLines?.[v?.id];
        const noLines = !Array.isArray(lines) || lines.length === 0;
        const tooShort = (Number(v?.duration) || 0) <= MIN_CLIP_SECONDS;
        if (noLines || tooShort) {
          removedVideoIds.add(v?.id);
          return false;
        }
        return true;
      });
      if (keptVideos.length !== videos.length) {
        storage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(keptVideos));
      }
    }
    if (customLines && removedVideoIds.size > 0) {
      const keptLines: Record<string, unknown[]> = {};
      for (const [id, lines] of Object.entries(customLines)) {
        if (!removedVideoIds.has(id)) keptLines[id] = lines;
      }
      storage.setItem(STORAGE_KEYS.CUSTOM_LINES, JSON.stringify(keptLines));
    }

    // 2. Mined sentences: drop seeded ones and any that belonged to removed clips.
    const mined = parse<any[]>(storage.getItem(STORAGE_KEYS.MINED_SENTENCES));
    if (Array.isArray(mined)) {
      const kept = mined.filter(
        (m) =>
          !(typeof m?.id === 'string' && m.id.startsWith(SEED_MINED_ID_PREFIX)) &&
          !removedVideoIds.has(m?.video_id)
      );
      if (kept.length !== mined.length) {
        storage.setItem(STORAGE_KEYS.MINED_SENTENCES, JSON.stringify(kept));
      }
    }

    // 3. Word states: remove only entries that still equal the seeded status.
    const wordStates = parse<Record<string, string>>(storage.getItem(STORAGE_KEYS.WORD_STATES));
    if (wordStates && typeof wordStates === 'object') {
      const next: Record<string, string> = {};
      for (const [id, status] of Object.entries(wordStates)) {
        if (SEED_WORD_STATES[id] === undefined || SEED_WORD_STATES[id] !== status) next[id] = status;
      }
      if (Object.keys(next).length !== Object.keys(wordStates).length) {
        storage.setItem(STORAGE_KEYS.WORD_STATES, JSON.stringify(next));
      }
    }

    // 4. Stats: streak and immersion restart at 0; XP loses exactly the seeded amount (floor 0).
    const stats = parse<Record<string, number>>(storage.getItem(STORAGE_KEYS.STATS));
    if (stats && typeof stats === 'object') {
      const next: Record<string, number> = { ...stats, streak_days: 0, total_immersion_minutes: 0 };
      for (const key of XP_KEYS) {
        const seed = SEED_STATS[key];
        next[key] = Math.max(0, (Number(stats[key]) || 0) - seed);
      }
      storage.setItem(STORAGE_KEYS.STATS, JSON.stringify(next));
    }

    storage.setItem(MIGRATION_108_FLAG, '1');
  } catch (err) {
    console.warn('Migration 1.0.8 failed:', err);
  }
}
