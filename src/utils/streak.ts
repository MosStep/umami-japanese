// Local calendar day as YYYY-MM-DD (not UTC, so the streak rolls over at local midnight).
export function localDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Next streak value given the previous streak, the last active local day (or null) and today.
// Same day: unchanged. Consecutive day: +1. Gap or first ever use: restart at 1.
export function nextStreak(prevStreak: number, lastDay: string | null, today: string, todayDate: Date): number {
  if (lastDay === today) return prevStreak;
  const yesterday = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (lastDay !== null && lastDay === localDayKey(yesterday)) return prevStreak + 1;
  return 1;
}

/** Daily watch goal in minutes (home banner and profile). */
export const DAILY_GOAL_MIN = 10;

// ---- Study streak (1.0.24): a day counts only when the learner actually studied ----

/** A day counts for the streak after this many watched minutes… */
export const STUDY_MIN_MINUTES = 3;
/** …or this many reviewed flashcards. */
export const STUDY_MIN_REVIEWS = 10;
/** One missed day per this many days is covered by a streak freeze. */
export const FREEZE_EVERY_DAYS = 7;

const parseDay = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Whole local days from `a` to `b` (both YYYY-MM-DD). */
export function dayDiff(a: string, b: string): number {
  return Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86400000);
}

export function shiftDay(key: string, days: number): string {
  const d = parseDay(key);
  return localDayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days));
}

export function isStudyDay(minutes: number | undefined, reviews: number | undefined): boolean {
  return (minutes ?? 0) >= STUDY_MIN_MINUTES || (reviews ?? 0) >= STUDY_MIN_REVIEWS;
}

/** A freeze is available when none was used in the last FREEZE_EVERY_DAYS days before `today`. */
export function freezeAvailable(freezeDays: string[] | undefined, today: string): boolean {
  return !(freezeDays ?? []).some((d) => {
    const diff = dayDiff(d, today);
    return diff >= 0 && diff < FREEZE_EVERY_DAYS;
  });
}

export interface StudyStreakState {
  streak: number;
  lastStudyDay?: string;
  freezeDays?: string[];
}

/** New streak state once `today` becomes a study day. One missed day is bridged by a freeze when available. */
export function advanceStudyStreak(s: StudyStreakState, today: string): StudyStreakState {
  if (s.lastStudyDay === today) return s;
  const gap = s.lastStudyDay ? dayDiff(s.lastStudyDay, today) : Infinity;
  if (gap === 1) return { ...s, streak: s.streak + 1, lastStudyDay: today };
  if (gap === 2 && s.streak > 0 && freezeAvailable(s.freezeDays, today)) {
    const frozen = shiftDay(today, -1);
    const freezeDays = [...(s.freezeDays ?? []), frozen].slice(-10);
    return { streak: s.streak + 1, lastStudyDay: today, freezeDays };
  }
  return { ...s, streak: 1, lastStudyDay: today };
}

/** Streak to show today: kept while today can still continue it (yesterday studied, or one missed day + freeze). */
export function currentStudyStreak(s: StudyStreakState, today: string): number {
  if (!s.lastStudyDay || s.streak <= 0) return 0;
  const gap = dayDiff(s.lastStudyDay, today);
  if (gap <= 1) return s.streak;
  if (gap === 2 && freezeAvailable(s.freezeDays, today)) return s.streak;
  return 0;
}
