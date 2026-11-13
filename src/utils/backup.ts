/**
 * Backup / restore of the learner's progress (everything is in localStorage on this phone).
 * Export: one JSON file shared through the Android share sheet (Drive, LINE Keep, …) or downloaded on the web.
 * Restore: the same file picked with a file input; the app reloads so every state initializer re-reads storage.
 */
import { Capacitor } from '@capacitor/core';
import { localDayKey } from './streak';

const BACKUP_APP = 'umami';
const BACKUP_VERSION = 1;
export const LAST_BACKUP_KEY = 'umami_last_backup';

/** Keys never written to a backup: the private AI key and update/catalog caches. */
const isBackupKey = (key: string): boolean =>
  key.startsWith('umami_') &&
  key !== 'umami_api_key_v1' &&
  !key.startsWith('umami_live_') &&
  !key.startsWith('umami_ota_');

export interface BackupFile {
  app: typeof BACKUP_APP;
  v: number;
  created: string;
  data: Record<string, string>;
}

export const collectBackup = (): BackupFile => {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isBackupKey(key)) data[key] = localStorage.getItem(key) ?? '';
  }
  return { app: BACKUP_APP, v: BACKUP_VERSION, created: new Date().toISOString(), data };
};

export const lastBackupDay = (): string | null => {
  try {
    return localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    return null;
  }
};

/** Writes the backup and opens the share sheet (native) or downloads it (web). */
export const exportBackup = async (): Promise<void> => {
  const json = JSON.stringify(collectBackup());
  const name = `umami-backup-${localDayKey(new Date())}.json`;
  if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Share') && Capacitor.isPluginAvailable('Filesystem')) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const { uri } = await Filesystem.writeFile({ path: name, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: 'สำรองข้อมูลうまみ', text: 'ไฟล์สำรองความคืบหน้าうまみ', files: [uri], dialogTitle: 'บันทึกไฟล์สำรองไว้ที่…' });
  } else {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  try {
    localStorage.setItem(LAST_BACKUP_KEY, localDayKey(new Date()));
  } catch {}
};

/** Parses a backup file's text. Throws a Thai message when it is not a うまみ backup. */
export const parseBackup = (text: string): BackupFile => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('ไฟล์นี้ไม่ใช่ไฟล์สำรองของうまみ');
  }
  const b = parsed as Partial<BackupFile>;
  if (!b || b.app !== BACKUP_APP || typeof b.data !== 'object' || b.data === null) {
    throw new Error('ไฟล์นี้ไม่ใช่ไฟล์สำรองของうまみ');
  }
  if ((b.v ?? 0) > BACKUP_VERSION) throw new Error('ไฟล์สำรองมาจากแอปเวอร์ชันใหม่กว่า กรุณาอัปเดตแอปก่อน');
  return b as BackupFile;
};

/** Short summary for the restore confirmation. */
export const describeBackup = (b: BackupFile): string => {
  const count = (key: string, pick: (v: unknown) => number): number => {
    try {
      return pick(JSON.parse(b.data[key] ?? 'null'));
    } catch {
      return 0;
    }
  };
  const words = count('umami_word_states_v1', (v) => (v && typeof v === 'object' ? Object.keys(v).length : 0));
  const sentences = count('umami_mined_sentences_v1', (v) => (Array.isArray(v) ? v.length : 0));
  const streak = count('umami_user_stats_v1', (v) => (v as { streak_days?: number } | null)?.streak_days ?? 0);
  const day = b.created.slice(0, 10);
  return `ไฟล์วันที่ ${day}: คำศัพท์ ${words} คำ, ประโยค ${sentences} ประโยค, ต่อเนื่อง ${streak} วัน`;
};

/** Replaces this phone's progress with the backup, then reloads the app. */
export const restoreBackup = (b: BackupFile): void => {
  const remove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isBackupKey(key) && !(key in b.data)) remove.push(key);
  }
  for (const key of remove) localStorage.removeItem(key);
  for (const [key, value] of Object.entries(b.data)) {
    if (isBackupKey(key) && typeof value === 'string') localStorage.setItem(key, value);
  }
  localStorage.setItem(LAST_BACKUP_KEY, localDayKey(new Date()));
  window.location.reload();
};
