/**
 * Small spaced-repetition schedule for the word flashcards (kept in localStorage, per device).
 * again → back in this session after a few cards; good → 1, 2, 4, 8… days; easy → 4+ days and marked known.
 */
export interface WordSrsRecord {
  /** When the word is due again (ms since epoch). */
  due: number;
  /** Current interval in days (0 = still in today's learning steps). */
  ivl: number;
}

export type WordSrsMap = Record<string, WordSrsRecord>;
export type WordGrade = 'again' | 'good' | 'easy';

const KEY = 'umami_word_srs';
const DAY = 24 * 60 * 60 * 1000;
/** New words introduced per review session. */
export const NEW_PER_SESSION = 10;
/** An "again" card comes back after this many other cards. */
export const AGAIN_GAP = 3;

export const loadWordSrs = (): WordSrsMap => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WordSrsMap) : {};
  } catch {
    return {};
  }
};

export const saveWordSrs = (map: WordSrsMap): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable: the schedule only lasts for this session */
  }
};

export const gradeWord = (rec: WordSrsRecord | undefined, grade: WordGrade, now = Date.now()): WordSrsRecord => {
  const ivl = rec?.ivl ?? 0;
  if (grade === 'again') return { due: now, ivl: 0 };
  if (grade === 'good') {
    const next = ivl < 1 ? 1 : ivl * 2;
    return { due: now + next * DAY, ivl: next };
  }
  const next = Math.max(4, ivl * 3);
  return { due: now + next * DAY, ivl: next };
};

/**
 * Today's review queue: due words (oldest first), then up to `newCount` words never reviewed, in list order.
 */
export const buildReviewQueue = (
  wordIds: string[],
  srs: WordSrsMap,
  newCount = NEW_PER_SESSION,
  now = Date.now(),
): string[] => {
  const due = wordIds.filter((id) => srs[id] && srs[id].due <= now).sort((a, b) => srs[a].due - srs[b].due);
  const fresh = wordIds.filter((id) => !srs[id]).slice(0, newCount);
  return [...due, ...fresh];
};
