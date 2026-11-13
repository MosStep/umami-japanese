import React, { useRef, useState } from 'react';
import { Bell, Download, Upload } from 'lucide-react';
import { BackupFile, describeBackup, exportBackup, lastBackupDay, parseBackup, restoreBackup } from '../utils/backup';
import {
  REMINDERS_CHANGED_EVENT,
  loadReminderPrefs,
  remindersSupported,
  requestReminderPermission,
  saveReminderPrefs,
} from '../utils/reminders';

const pad = (n: number) => String(n).padStart(2, '0');

/** Settings sections: progress backup / restore and the daily study reminder. */
export const BackupReminderSettings: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [lastDay, setLastDay] = useState(lastBackupDay);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<BackupFile | null>(null);

  const [prefs, setPrefs] = useState(loadReminderPrefs);
  const supported = remindersSupported();

  const handleExport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await exportBackup();
      setLastDay(lastBackupDay());
      setMessage('สร้างไฟล์สำรองแล้ว เก็บไว้ใน Drive หรือ LINE Keep ได้เลย');
    } catch (err) {
      // Closing the share sheet without choosing an app also lands here.
      const text = String((err as Error)?.message ?? err);
      if (!/cancel/i.test(text)) setMessage('สำรองไม่สำเร็จ: ' + text);
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPending(parseBackup(await file.text()));
      setMessage(null);
    } catch (err) {
      setPending(null);
      setMessage((err as Error).message);
    }
  };

  const updatePrefs = async (next: typeof prefs) => {
    if (next.on && !prefs.on) {
      const ok = await requestReminderPermission();
      if (!ok) {
        setMessage('ยังไม่ได้อนุญาตการแจ้งเตือน เปิดได้ที่ ตั้งค่าเครื่อง → แอป → うまみ → การแจ้งเตือน');
        return;
      }
    }
    setPrefs(next);
    saveReminderPrefs(next);
    window.dispatchEvent(new Event(REMINDERS_CHANGED_EVENT));
  };

  return (
    <div className="space-y-3">
      {/* Backup / restore */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">สำรองข้อมูล</p>
          <p className="text-xs text-slate-400">
            ความคืบหน้าเก็บอยู่ในเครื่องนี้เท่านั้น สำรองไว้กันหายตอนเปลี่ยนเครื่องหรือล้างแอป
            {' · '}
            {lastDay ? `ล่าสุด ${lastDay}` : 'ยังไม่เคยสำรอง'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handleExport}
            className="min-h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            ส่งออกไฟล์
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="min-h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            กู้คืนจากไฟล์
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFile} />
        </div>
        {pending && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2">
            <p className="text-xs text-amber-200">{describeBackup(pending)}</p>
            <p className="text-xs text-slate-300">ข้อมูลในเครื่องตอนนี้จะถูกแทนที่ด้วยไฟล์นี้ แล้วแอปจะเปิดใหม่</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => restoreBackup(pending)}
                className="min-h-10 px-4 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold"
              >
                กู้คืนเลย
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="min-h-10 px-4 rounded-xl text-sm text-slate-300 hover:bg-slate-800"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
        {message && <p className="text-xs text-slate-300" role="status">{message}</p>}
      </div>

      {/* Daily reminder */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-300" />
              เตือนทบทวนทุกวัน
            </p>
            <p className="text-xs text-slate-400">
              {supported ? 'บอกจำนวนคำที่รอทบทวน วันไหนเรียนแล้วจะไม่เตือน' : 'ต้องติดตั้งแอปเวอร์ชันใหม่ (APK) ก่อน'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.on}
            aria-label="เตือนทบทวนทุกวัน"
            disabled={!supported}
            onClick={() => void updatePrefs({ ...prefs, on: !prefs.on })}
            className={`shrink-0 w-12 h-7 rounded-full transition-colors disabled:opacity-40 ${prefs.on ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${prefs.on ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        {supported && prefs.on && (
          <label className="flex items-center justify-between text-sm text-slate-300">
            เวลาเตือน
            <input
              type="time"
              value={`${pad(prefs.hour)}:${pad(prefs.minute)}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number);
                if (Number.isFinite(h) && Number.isFinite(m)) void updatePrefs({ ...prefs, hour: h, minute: m });
              }}
              className="min-h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
            />
          </label>
        )}
      </div>
    </div>
  );
};
