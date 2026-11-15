/**
 * Spaced repetition for the word flashcards (kept in localStorage, per device), scheduled with FSRS (ts-fsrs):
 * each word has its own memory stability and difficulty, and the next review comes when recall is predicted to drop
 * to 90%. In a session, "again" brings the card back after a few cards; "easy" also marks the word known.
 * Daily limits keep the pile small: NEW_PER_DAY new words and MAX_REVIEWS_PER_DAY reviews.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card } from 'ts-fsrs';
import { localDayKey } from './streak';

export interface WordSrsRecord {
  /** When the word is due again (ms since epoch). */
  due: number;
  /** Days until the next review as scheduled (0 = still in today's steps); also drives the card stage. */
  ivl: number;
  /** FSRS memory state (absent on records written before 1.0.29; migrated on the next grade). */
  s?: number;
  d?: number;
  reps?: number;
  lapses?: number;
  /** Last review (ms). */
  last?: number;
  /** Local day the word was first reviewed (daily new-word limit). */
  first?: string;
}

export type WordSrsMap = Record<string, WordSrsRecord>;
export type WordGrade = 'again' | 'good' | 'easy';

const KEY = 'umami_word_srs';
const DAY = 24 * 60 * 60 * 1000;
/** New words introduced per day (all sessions together). */
export const NEW_PER_DAY = 10;
/** Kept for older callers: the per-session new-word count is today's remaining allowance. */
export const NEW_PER_SESSION = NEW_PER_DAY;
/** Reviews shown per day at most (oldest due first); the rest wait for tomorrow. */
export const MAX_REVIEWS_PER_DAY = 120;
/** An "again" card comes back after this many other cards. */
export const AGAIN_GAP = 3;
/** Forgotten this many times: a "leech", shown with a hint. */
export const LEECH_LAPSES = 6;

const scheduler = fsrs(
  generatorParameters({ request_retention: 0.9, maximum_interval: 365, enable_short_term: false, enable_fuzz: true }),
);

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

/** FSRS card for a stored record (old {due, ivl} records become review cards with stability ≈ their interval). */
const toCard = (rec: WordSrsRecord | undefined, now: Date): Card => {
  if (!rec) return createEmptyCard(now);
  if (rec.s !== undefined && rec.d !== undefined) {
    const last = rec.last ?? rec.due - rec.ivl * DAY;
    return {
      due: new Date(rec.due),
      stability: rec.s,
      difficulty: rec.d,
      elapsed_days: Math.max(0, Math.round((now.getTime() - last) / DAY)),
      scheduled_days: rec.ivl,
      reps: rec.reps ?? 1,
      lapses: rec.lapses ?? 0,
      learning_steps: 0,
      state: State.Review,
      last_review: new Date(last),
    };
  }
  const ivl = Math.max(rec.ivl, 0.5);
  const last = rec.due - rec.ivl * DAY;
  return {
    due: new Date(rec.due),
    stability: ivl,
    difficulty: 5,
    elapsed_days: Math.max(0, Math.round((now.getTime() - last) / DAY)),
    scheduled_days: rec.ivl,
    reps: 1,
    lapses: 0,
    learning_steps: 0,
    state: rec.ivl >= 1 ? State.Review : State.Learning,
    last_review: new Date(last),
  };
};

const RATING: Record<WordGrade, Rating.Again | Rating.Good | Rating.Easy> = {
  again: Rating.Again,
  good: Rating.Good,
  easy: Rating.Easy,
};

export const gradeWord = (rec: WordSrsRecord | undefined, grade: WordGrade, now = Date.now()): WordSrsRecord => {
  const at = new Date(now);
  const { card } = scheduler.next(toCard(rec, at), at, RATING[grade]);
  return {
    // "again" is repeated inside the session; it is due again right away until then.
    due: grade === 'again' ? now : card.due.getTime(),
    ivl: grade === 'again' ? 0 : card.scheduled_days,
    s: card.stability,
    d: card.difficulty,
    reps: card.reps,
    lapses: card.lapses,
    last: now,
    first: rec?.first ?? localDayKey(at),
  };
};

/** Words first reviewed today (counts against NEW_PER_DAY). */
export const newToday = (srs: WordSrsMap, now = Date.now()): number => {
  const today = localDayKey(new Date(now));
  let n = 0;
  for (const r of Object.values(srs)) if (r.first === today) n++;
  return n;
};

export const isLeech = (rec: WordSrsRecord | undefined): boolean => (rec?.lapses ?? 0) >= LEECH_LAPSES;

/**
 * Today's review queue: due words (oldest first, at most MAX_REVIEWS_PER_DAY), then the new words still allowed
 * today, in list order. Words already marked known are not introduced as new cards.
 */
export const buildReviewQueue = (
  wordIds: string[],
  srs: WordSrsMap,
  newCount = Math.max(0, NEW_PER_DAY - newToday(srs)),
  now = Date.now(),
  isKnown: (id: string) => boolean = () => false,
): string[] => {
  const due = wordIds
    .filter((id) => srs[id] && srs[id].due <= now)
    .sort((a, b) => srs[a].due - srs[b].due)
    .slice(0, MAX_REVIEWS_PER_DAY);
  const fresh = wordIds.filter((id) => !srs[id] && !isKnown(id)).slice(0, newCount);
  return [...due, ...fresh];
};

/** Words due by `at` (already reviewed at least once) and new words still allowed, for the feed card and reminders. */
export const countDue = (
  wordIds: string[],
  srs: WordSrsMap,
  at = Date.now(),
  isKnown: (id: string) => boolean = () => false,
): { due: number; fresh: number } => {
  let due = 0;
  let fresh = 0;
  for (const id of wordIds) {
    const r = srs[id];
    if (!r) {
      if (!isKnown(id)) fresh++;
    } else if (r.due <= at) due++;
  }
  return { due: Math.min(due, MAX_REVIEWS_PER_DAY), fresh: Math.min(fresh, Math.max(0, NEW_PER_DAY - newToday(srs, at))) };
};
