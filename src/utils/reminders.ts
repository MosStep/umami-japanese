/**
 * Daily study reminder (local notifications, no server). The next 7 reminders are rescheduled every time the app
 * opens or goes to the background, so each one carries that day's due-word count. Today's reminder is skipped once
 * today already counts as a study day. Needs native build 115+ (plugin); does nothing elsewhere.
 */
import { Capacitor } from '@capacitor/core';
import { countDue, loadWordSrs } from './wordSrs';

const KEY = 'umami_reminder';
/** Fired after the reminder switch or time changes; App reschedules on it. */
export const REMINDERS_CHANGED_EVENT = 'umami-reminders-changed';
const ID_BASE = 7100;
const DAYS = 7;

export interface ReminderPrefs {
  on: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER: ReminderPrefs = { on: false, hour: 19, minute: 0 };

export const remindersSupported = (): boolean =>
  Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications');

export const loadReminderPrefs = (): ReminderPrefs => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_REMINDER, ...(JSON.parse(raw) as Partial<ReminderPrefs>) };
  } catch {}
  return DEFAULT_REMINDER;
};

export const saveReminderPrefs = (p: ReminderPrefs): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
};

/** Asks for the Android 13+ notification permission. Returns true when reminders can be shown. */
export const requestReminderPermission = async (): Promise<boolean> => {
  if (!remindersSupported()) return false;
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  let perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions();
  return perm.display === 'granted';
};

export interface ReminderContext {
  wordIds: string[];
  streak: number;
  studiedToday: boolean;
}

const bodyFor = (due: number, fresh: number, streak: number, first: boolean): string => {
  if (due > 0) return `มี ${due} คำรอทบทวน ใช้เวลาแค่ 3 นาที`;
  if (first && streak > 0) return `รักษาวันต่อเนื่อง ${streak} วันไว้นะ ดูคลิปหรือทบทวนคำสัก 3 นาที`;
  if (fresh > 0) return `มีคำใหม่ ${fresh} คำรอให้เรียน วันละนิดก็ติดหู`;
  return 'ดูคลิปญี่ปุ่นสักตอน วันละนิดก็ติดหู';
};

export const syncReminders = async (ctx: ReminderContext): Promise<void> => {
  if (!remindersSupported()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const pending = await LocalNotifications.getPending();
    const ours = pending.notifications.filter((n) => n.id >= ID_BASE && n.id < ID_BASE + DAYS);
    if (ours.length) await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });

    const prefs = loadReminderPrefs();
    if (!prefs.on) return;
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') return;

    const srs = loadWordSrs();
    const now = new Date();
    const notifications = [];
    for (let i = 0; i < DAYS; i++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, prefs.hour, prefs.minute);
      if (at.getTime() <= now.getTime() + 60_000) continue;
      if (i === 0 && ctx.studiedToday) continue;
      const { due, fresh } = countDue(ctx.wordIds, srs, at.getTime());
      notifications.push({
        id: ID_BASE + i,
        title: '🦊 ถึงเวลาเรียนญี่ปุ่นแล้ว',
        body: bodyFor(due, fresh, ctx.streak, i <= 1),
        schedule: { at, allowWhileIdle: true },
        smallIcon: 'ic_stat_umami',
        iconColor: '#A855F7',
        extra: { tab: 'dojo' },
      });
    }
    if (notifications.length) await LocalNotifications.schedule({ notifications });
  } catch (err) {
    console.warn('Reminder scheduling failed:', err);
  }
};

/** Opens the practice tab when a reminder is tapped. Returns a cleanup function. */
export const onReminderTap = (open: (tab: 'dojo') => void): (() => void) => {
  if (!remindersSupported()) return () => {};
  let remove: (() => void) | null = null;
  let cancelled = false;
  void import('@capacitor/local-notifications').then(({ LocalNotifications }) =>
    LocalNotifications.addListener('localNotificationActionPerformed', (e) => {
      if (e.notification?.extra?.tab === 'dojo') open('dojo');
    }).then((h) => {
      if (cancelled) void h.remove();
      else remove = () => void h.remove();
    }),
  );
  return () => {
    cancelled = true;
    remove?.();
  };
};
