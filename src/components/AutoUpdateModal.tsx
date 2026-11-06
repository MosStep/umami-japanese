import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  X,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  FolderDown,
  Settings as SettingsIcon,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface VersionInfo {
  version: string;
  build: number;
  releaseDate: string;
  releaseNotes: string[];
}

export const CURRENT_APP_VERSION: VersionInfo = {
  version: '1.0.1',
  build: 101,
  releaseDate: '2026-11-06',
  releaseNotes: [
    '✨ วิดีโอญี่ปุ่นจริง (Anime, Tokyo Vlog, Izakaya, NHK News) พร้อม IFrame PostMessage Sync',
    '🔊 สตรีมเสียง Native Audio ภาษาญี่ปุ่นแท้ 100% ไม่พึ่งพาระบบ TTS ภายในเครื่องที่เงียบ',
    '🎙️ The Dojo Shadowing พร้อมไมโครโฟนสด และกราฟคลื่นเสียง Waveform แบบไดนามิก',
    '🤖 เชื่อมต่อ Kob AI API (minimax-m3.1-flash) และ Tenixe AI บทสนทนาบทบาทสมมติ',
    '📱 ระบบ Auto-Update ตรวจจับเนทีฟแอนดรอยด์ ติดตั้งตรงจาก Downloads หรือออนไลน์',
  ],
};

const STORAGE_KEY_CUSTOM_APK_URL = 'umami_custom_apk_url';

export const AutoUpdateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isNativeApp, setIsNativeApp] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(true);
  const [customApkUrl, setCustomApkUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CUSTOM_APK_URL) || '';
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AndroidAutoUpdater) {
      setIsNativeApp(true);
      if ((window as any).AndroidAutoUpdater.canInstallPackages) {
        setCanInstall((window as any).AndroidAutoUpdater.canInstallPackages());
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveApkUrl = (url: string) => {
    setCustomApkUrl(url);
    localStorage.setItem(STORAGE_KEY_CUSTOM_APK_URL, url);
  };

  // 1. Install from local Download folder on phone
  const handleInstallLocal = () => {
    setErrorMessage('');
    if ((window as any).AndroidAutoUpdater?.installLocalApk) {
      (window as any).AndroidAutoUpdater.installLocalApk('umami-app-debug.apk');
    } else {
      setErrorMessage('ฟังก์ชันนี้ใช้งานได้เฉพาะบนแอป Android ที่ติดตั้งแล้วเท่านั้น');
    }
  };

  // 2. Open Android "Allow unknown apps" settings
  const handleOpenPermissionSettings = () => {
    if ((window as any).AndroidAutoUpdater?.openUnknownAppSourcesPermission) {
      (window as any).AndroidAutoUpdater.openUnknownAppSourcesPermission();
    }
  };

  // 3. Online Download & Install
  const handleStartOnlineDownload = () => {
    setErrorMessage('');
    const targetUrl = customApkUrl.trim();

    if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
      setErrorMessage(
        'กรุณาระบุ URL ของไฟล์ APK ที่ดาวน์โหลดได้จริง (เช่น Google Drive Direct Link, GitHub Release หรือเซิร์ฟเวอร์ของคุณ) หรือกดปุ่ม "ติดตั้งจากไฟล์ในเครื่อง"'
      );
      return;
    }

    if (isNativeApp && (window as any).AndroidAutoUpdater?.installApkFromUrl) {
      // Trigger native download manager
      (window as any).AndroidAutoUpdater.installApkFromUrl(targetUrl);
      onClose();
      return;
    }

    // Browser mode fallback
    setDownloadProgress(20);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true);
          const a = document.createElement('a');
          a.href = targetUrl;
          a.download = 'umami-app-update.apk';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-rose-500/40 shadow-2xl shadow-rose-950/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Top Banner */}
        <div className="p-5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border-b border-rose-500/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                Umami Auto-Update System
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>จัดการและอัปเดตแอป (v{CURRENT_APP_VERSION.version})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                  ล่าสุด
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status Alert Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              ขณะนี้คุณกำลังใช้งานเวอร์ชัน <strong>v{CURRENT_APP_VERSION.version}</strong> ซึ่งรองรับวิดีโอญี่ปุ่นจริง เสียงพูดคมชัด และไมโครโฟนเรียบร้อยแล้ว
            </span>
          </div>

          {/* Android Permissions Reminder */}
          {isNativeApp && !canInstall && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  สิทธิ์การติดตั้งแอป (Unknown Sources):
                </span>
                <button
                  onClick={handleOpenPermissionSettings}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px]"
                >
                  กดเปิดสิทธิ์
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                หากระบบแจ้งว่า "แอพมีปัญหา" มักเกิดจากการที่ Android บล็อกการติดตั้งไฟล์ภายนอก ให้กดปุ่มด้านบนเพื่อเปิดสิทธิ์ "อนุญาตจากแหล่งที่มานี้"
              </p>
            </div>
          )}

          {/* Option 1: Direct Local Install from Phone Storage */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-rose-400" />
                วิธีที่ 1: ติดตั้งจากไฟล์ในเครื่อง (แนะนำ)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              หากคุณมีไฟล์ <span className="text-rose-300 font-mono">umami-app-debug.apk</span> อยู่ในโฟลเดอร์ <strong>Downloads</strong> ของมือถือแล้ว สามารถกดให้ระบบเปิดตัวติดตั้งได้ทันที
            </p>
            <button
              onClick={handleInstallLocal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <FolderDown className="w-4 h-4" />
              <span>ติดตั้งจากไฟล์ umami-app-debug.apk ในเครื่อง</span>
            </button>
          </div>

          {/* Option 2: Online Download from URL */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-amber-400" />
              วิธีที่ 2: ดาวน์โหลดและอัปเดตออนไลน์ผ่าน URL
            </span>
            <p className="text-[11px] text-slate-400">
              ใส่ URL ตรงของไฟล์ APK (เช่น ลิงก์ตรงจาก Google Drive, GitHub Release หรือเซิร์ฟเวอร์ส่วนตัว):
            </p>
            <input
              type="text"
              placeholder="https://example.com/releases/umami-v1.0.2.apk"
              value={customApkUrl}
              onChange={(e) => handleSaveApkUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
            />
            <button
              onClick={handleStartOnlineDownload}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <DownloadCloud className="w-4 h-4 text-amber-400" />
              <span>ดาวน์โหลดและติดตั้งจาก URL ออนไลน์</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Release Notes */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block">
              สิ่งที่ปรับปรุงในเวอร์ชันปัจจุบัน:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {CURRENT_APP_VERSION.releaseNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            ปิดหน้าต่างนี้
          </button>
        </div>
      </div>
    </div>
  );
};
