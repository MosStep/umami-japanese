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
