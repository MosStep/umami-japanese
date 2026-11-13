/**
 * Per-clip progress kept on this phone: clips watched to the end (drives the rewatch mode, the feed ✓ and the
 * weekly recap) and the user's subtitle error reports (exported in the backup file and from Settings).
 */
import { localDayKey } from './streak';

const DONE_KEY = 'umami_clips_done';
const REPORTS_KEY = 'umami_sub_reports';

export interface ClipDone {
  /** Times watched to the end. */
  n: number;
  /** Local days it was finished (newest last, max 30). */
  days: string[];
  /** Best end-of-clip quiz score (0-5). */
  best?: number;
}

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const loadClipsDone = (): Record<string, ClipDone> => read(DONE_KEY, {});

export const clipDone = (youtubeId: string): ClipDone | undefined => loadClipsDone()[youtubeId];

export const markClipDone = (youtubeId: string): ClipDone => {
  const all = loadClipsDone();
  const prev = all[youtubeId] ?? { n: 0, days: [] };
  const next: ClipDone = { ...prev, n: prev.n + 1, days: [...prev.days, localDayKey(new Date())].slice(-30) };
  all[youtubeId] = next;
  write(DONE_KEY, all);
  return next;
};

export const saveQuizScore = (youtubeId: string, score: number) => {
  const all = loadClipsDone();
  const prev = all[youtubeId] ?? { n: 0, days: [] };
  all[youtubeId] = { ...prev, best: Math.max(prev.best ?? 0, score) };
  write(DONE_KEY, all);
};

/** Clip finishes on the given local days. */
export const finishesOnDays = (days: Set<string>): number => {
  let n = 0;
  for (const c of Object.values(loadClipsDone())) for (const d of c.days) if (days.has(d)) n++;
  return n;
};

export type SubReportKind = 'ja' | 'th' | 'time';
export const SUB_REPORT_LABEL: Record<SubReportKind, string> = {
  ja: 'ญี่ปุ่นผิด / ได้ยินผิด',
  th: 'คำแปลไทยผิด',
  time: 'ซับไม่ตรงเวลา',
};

export interface SubReport {
  yt: string;
  ms: number;
  ja: string;
  th: string;
  kind: SubReportKind;
  at: string;
}

export const loadSubReports = (): SubReport[] => read(REPORTS_KEY, []);

export const addSubReport = (r: Omit<SubReport, 'at'>) => {
  const list = loadSubReports().filter((x) => !(x.yt === r.yt && x.ms === r.ms && x.kind === r.kind));
  list.push({ ...r, at: new Date().toISOString() });
  write(REPORTS_KEY, list.slice(-500));
};

export const hasSubReport = (yt: string, ms: number): boolean => loadSubReports().some((x) => x.yt === yt && x.ms === ms);

export const clearSubReports = () => write(REPORTS_KEY, []);
