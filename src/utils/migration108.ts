import type { WordLearningStatus } from '../schema/databaseSchema';
import { STORAGE_KEYS } from '../config/storageKeys';
import { MOCK_VIDEOS } from '../data/mockVideos';

// One-time cleanup for users upgrading from 1.0.7 (or earlier) to 1.0.8.
// Removes the hand-seeded demo data shipped as "real" stats, plus broken user-imported clips.
//
// Crash safety: every step is independent and guarded by its own marker. Each step computes its
// new values from storage first, writes them, and sets its marker last. A step that is interrupted
// before its marker is set simply runs again on the next launch, and running again is safe:
// - clips, mined and words steps only remove things; a second pass finds nothing new to remove.
// - the XP step is NOT a removal, so it must never run twice. Its marker (`migr_108_xp`) lives
//   inside the stats object, so the stats write and the marker are one setItem call: a retry
//   can never see subtracted stats without the marker, or the marker without the subtraction.
export const MIGRATION_108_FLAG = 'umami_migr_108_v1'; // umbrella: set when every step finished
export const MARKER_CLIPS = 'umami_migr_108_clips';
export const MARKER_MINED = 'umami_migr_108_mined';
export const MARKER_WORDS = 'umami_migr_108_words';
export const STATS_MARKER_FIELD = 'migr_108_xp';

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

// Returns undefined when the key is absent, null when the JSON is corrupt.
function readJson<T>(storage: Storage, key: string): T | null | undefined {
  const raw = storage.getItem(key);
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Step 1: user-imported clips with no subtitle lines, or <= 15 s long. Also drops their custom lines.
function migrateClips(storage: Storage): void {
  if (storage.getItem(MARKER_CLIPS) === '1') return;
  const videos = readJson<any[]>(storage, STORAGE_KEYS.CUSTOM_VIDEOS);
  const lines = readJson<Record<string, unknown[]>>(storage, STORAGE_KEYS.CUSTOM_LINES);
  // Corrupt lines store: without it every clip would look like it has no lines, so nothing here is trusted.
  if (lines === null) {
    storage.setItem(MARKER_CLIPS, '1');
    return;
  }
  if (Array.isArray(videos)) {
    const kept = videos.filter((v) => {
      const hasLines = Array.isArray(lines?.[v?.id]) && (lines![v.id] as unknown[]).length > 0;
      const tooShort = (Number(v?.duration) || 0) <= MIN_CLIP_SECONDS;
      return hasLines && !tooShort;
    });
    if (kept.length !== videos.length) {
      storage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(kept));
    }
    if (lines && typeof lines === 'object') {
      const keptIds = new Set(kept.map((v) => v?.id));
      const nextLines: Record<string, unknown[]> = {};
      for (const [id, value] of Object.entries(lines)) {
        if (keptIds.has(id)) nextLines[id] = value as unknown[];
      }
      if (Object.keys(nextLines).length !== Object.keys(lines).length) {
        storage.setItem(STORAGE_KEYS.CUSTOM_LINES, JSON.stringify(nextLines));
      }
    }
  }
  storage.setItem(MARKER_CLIPS, '1');
}

// Step 2: mined sentences. Drops seeded ones and orphans (their clip no longer exists).
// Orphan rule checks the current clip list, so it also works on a retry after step 1.
function migrateMined(storage: Storage): void {
  if (storage.getItem(MARKER_MINED) === '1') return;
  const mined = readJson<any[]>(storage, STORAGE_KEYS.MINED_SENTENCES);
  if (Array.isArray(mined)) {
    const customRaw = readJson<any[]>(storage, STORAGE_KEYS.CUSTOM_VIDEOS);
    // If the custom clip list is corrupt, do not treat custom clips as missing.
    const knownIds = new Set<string>(MOCK_VIDEOS.map((v) => v.id));
    const customCorrupt = customRaw === null;
    if (Array.isArray(customRaw)) customRaw.forEach((v) => knownIds.add(v?.id));
    const kept = mined.filter((m) => {
      if (typeof m?.id === 'string' && m.id.startsWith(SEED_MINED_ID_PREFIX)) return false;
      if (!customCorrupt && !knownIds.has(m?.video_id)) return false;
      return true;
    });
    if (kept.length !== mined.length) {
      storage.setItem(STORAGE_KEYS.MINED_SENTENCES, JSON.stringify(kept));
    }
  }
  storage.setItem(MARKER_MINED, '1');
}

// Step 3: word states. Remove only entries that still equal the seeded status.
function migrateWords(storage: Storage): void {
  if (storage.getItem(MARKER_WORDS) === '1') return;
  const words = readJson<Record<string, string>>(storage, STORAGE_KEYS.WORD_STATES);
  if (words && typeof words === 'object') {
    const next: Record<string, string> = {};
    for (const [id, status] of Object.entries(words)) {
      if (SEED_WORD_STATES[id] === undefined || SEED_WORD_STATES[id] !== status) next[id] = status;
    }
    if (Object.keys(next).length !== Object.keys(words).length) {
      storage.setItem(STORAGE_KEYS.WORD_STATES, JSON.stringify(next));
    }
  }
  storage.setItem(MARKER_WORDS, '1');
}

// Step 4: stats. Streak and immersion restart at 0; XP loses exactly the seeded amount (floor 0).
// Single write, marker inside the same object (see the header comment). If the stats key is
// absent (fresh install) the zeroed object is written with the marker, so the first real stats
// written by the app are never touched later.
function migrateStats(storage: Storage): void {
  const raw = readJson<Record<string, any>>(storage, STORAGE_KEYS.STATS);
  if (raw && raw[STATS_MARKER_FIELD] === true) return;
  const base: Record<string, any> = raw && typeof raw === 'object' ? raw : {};
  const next: Record<string, any> = {
    ...base,
    streak_days: 0,
    total_immersion_minutes: 0,
    [STATS_MARKER_FIELD]: true,
  };
  for (const key of XP_KEYS) {
    next[key] = Math.max(0, (Number(base[key]) || 0) - SEED_STATS[key]);
  }
  storage.setItem(STORAGE_KEYS.STATS, JSON.stringify(next));
}

export function runMigration108(storage: Storage = localStorage): void {
  let finished = false;
  try {
    finished = storage.getItem(MIGRATION_108_FLAG) === '1';
  } catch (err) {
    console.warn('Migration 1.0.8: could not read umbrella flag', err);
  }
  if (finished) return;
  // Steps run in order and the chain stops at the first failure: a later step (mined) reads the
  // result of an earlier one (clips), so it must not run before that one has finished. Steps that
  // did not run are retried on the next launch because their markers were not set.
  const steps: Array<[string, (s: Storage) => void]> = [
    ['clips', migrateClips],
    ['mined', migrateMined],
    ['words', migrateWords],
    ['stats', migrateStats],
  ];
  let allDone = true;
  for (const [name, step] of steps) {
    try {
      step(storage);
    } catch (err) {
      allDone = false;
      console.warn(`Migration 1.0.8 step "${name}" failed, will retry on next launch:`, err);
      break;
    }
  }
  try {
    if (allDone) storage.setItem(MIGRATION_108_FLAG, '1');
  } catch {}
}
