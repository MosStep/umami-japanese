import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  X,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Github,
} from 'lucide-react';

import { APP_VERSION_NAME, APP_BUILD, APP_RELEASE_DATE } from '../config/version';

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
  version: APP_VERSION_NAME,
  build: APP_BUILD,
  releaseDate: APP_RELEASE_DATE,
  releaseNotes: [
    '⚡ แก้ Crash เมื่อกดขุดประโยค (Mine) พร้อม Guard ป้องกันข้อผิดพลาด',
    '🎬 แก้ไข Default Video และโหลดซับไตเติลค้าง รีเซ็ตประโยคเริ่มใหม่อย่างราบรื่น',
    '⚔️ Dojo Mode A: ปรับปรุง Cloze Deletion ปิดคำศัพท์เป้าหมายตรงจุด พร้อมแปลไทยสมบูรณ์',
    '🎙️ Dojo Mode B: เลือกสลับประโยค Shadowing ได้อิสระ พร้อมระบบตรวจจับไมโครโฟนแม่นยำ',
    '✨ Furigana Mode: รองรับตัวเลือก "เฉพาะที่เรียน (learning_only)" อย่างถูกต้อง',
    '🔍 Contextual Dictionary: เชื่อมโยงหน้าต่างวิเคราะห์ไวยากรณ์และถาม AI เชิงลึก',
    '📁 อัลบั้มคลังคลิป: สร้างและจัดการอัลบั้มใน Video Feed ได้อย่างสะดวก',
    '📱 Safe Area & Mobile UX: รองรับจอขอบโค้งและปุ่มสัมผัสแตะง่ายยิ่งขึ้น',
  ],
};

const GITHUB_REPO = 'MosStep/umami-japanese';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export const AutoUpdateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'checking' | 'has_update' | 'up_to_date' | 'downloading' | 'error'>('checking');
  const [latestTag, setLatestTag] = useState<string>('');
  const [latestTitle, setLatestTitle] = useState<string>('');
  const [latestBody, setLatestBody] = useState<string>('');
  const [apkUrl, setApkUrl] = useState<string>('');
  const [apkSizeMB, setApkSizeMB] = useState<string>('');
  const [isNativeApp, setIsNativeApp] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AndroidAutoUpdater) {
      setIsNativeApp(true);
      if ((window as any).AndroidAutoUpdater.canInstallPackages) {
        setCanInstall((window as any).AndroidAutoUpdater.canInstallPackages());
      }
    }
  }, []);

  const checkForUpdates = async () => {
    setStatus('checking');
    setErrorMessage('');

    try {
      const res = await fetch(GITHUB_API_URL, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error(`ไม่สามารถเชื่อมต่อ GitHub ได้ (HTTP ${res.status})`);
      }

      const data = await res.json();
      const rawTag = (data.tag_name || '').trim();
      const cleanTag = rawTag.replace(/^v/, '');
      const currentClean = CURRENT_APP_VERSION.version.replace(/^v/, '');

      setLatestTag(rawTag || `v${cleanTag}`);
      setLatestTitle(data.name || rawTag);
      setLatestBody(data.body || 'ไม่มีรายละเอียดการเปลี่ยนแปลง');

      // Find APK asset
      const apkAsset = Array.isArray(data.assets)
        ? data.assets.find((asset: any) => asset.name?.endsWith('.apk'))
        : null;

      if (apkAsset) {
        setApkUrl(apkAsset.browser_download_url);
        if (apkAsset.size) {
          setApkSizeMB((apkAsset.size / (1024 * 1024)).toFixed(1));
        }
      } else {
        // Fallback default APK release asset name
        setApkUrl(`https://github.com/${GITHUB_REPO}/releases/download/${rawTag}/umami-app-debug.apk`);
      }

      // Version comparison: compare semantic versions
      const isNewer = isVersionNewer(cleanTag, currentClean);

      if (isNewer) {
        setStatus('has_update');
      } else {
        setStatus('up_to_date');
      }
    } catch (err: any) {
      console.warn('AutoUpdate check failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบอัปเดตจาก GitHub');
    }
  };

  // Semantic version comparison
  const isVersionNewer = (latest: string, current: string): boolean => {
    const lParts = latest.split('.').map((n) => parseInt(n, 10) || 0);
    const cParts = current.split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  useEffect(() => {
    if (isOpen) {
      checkForUpdates();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Perform automatic update
  const handleStartAutoUpdate = () => {
    if (!apkUrl) {
      setErrorMessage('ไม่พบไฟล์ APK ใน Release บน GitHub');
      return;
    }

    setStatus('downloading');

    if (isNativeApp && (window as any).AndroidAutoUpdater?.installApkFromUrl) {
      // Check install permission first
      if (!canInstall && (window as any).AndroidAutoUpdater?.openUnknownAppSourcesPermission) {
        (window as any).AndroidAutoUpdater.openUnknownAppSourcesPermission();
        return;
      }
      // Trigger native Android download & auto-install
      (window as any).AndroidAutoUpdater.installApkFromUrl(apkUrl);
      setTimeout(() => {
        onClose();
      }, 1500);
      return;
    }

    // Browser fallback: direct download from GitHub
    const a = document.createElement('a');
    a.href = apkUrl;
    a.download = 'umami-app-debug.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      setStatus('up_to_date');
    }, 2000);
  };

  const handleOpenPermissionSettings = () => {
    if ((window as any).AndroidAutoUpdater?.openUnknownAppSourcesPermission) {
      (window as any).AndroidAutoUpdater.openUnknownAppSourcesPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-rose-950/90 border-b border-indigo-500/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Auto-Updater</span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ระบบอัปเดตอัตโนมัติ</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  v{CURRENT_APP_VERSION.version}
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
          {/* Unknown App Sources Alert */}
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
                กรุณาแตะ "กดเปิดสิทธิ์" เพื่อเปิดตัวเลือก <strong>อนุญาตจากแหล่งที่มานี้</strong> เพื่อให้ระบบติดตั้งอัปเดตอัตโนมัติได้
              </p>
            </div>
          )}

          {/* Status 1: Checking */}
          {status === 'checking' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <div>
                <p className="text-sm font-bold text-white">กำลังตรวจสอบเวอร์ชันล่าสุดจาก GitHub...</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{GITHUB_REPO}</p>
              </div>
            </div>
          )}

          {/* Status 2: Has New Update Available! */}
          {status === 'has_update' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    พบเวอร์ชันใหม่พร้อมใช้งาน!
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {latestTag} {apkSizeMB && `(${apkSizeMB} MB)`}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{latestTitle}</h3>
              </div>

              {/* Release Notes */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  บันทึกการเปลี่ยนแปลง (Release Notes):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {latestBody}
                </p>
              </div>

              {/* One-Tap Auto Update Button */}
              <button
                onClick={handleStartAutoUpdate}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-600 hover:opacity-95 active:scale-98 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all"
              >
                <DownloadCloud className="w-5 h-5" />
                <span>ดาวน์โหลดและอัปเดตอัตโนมัติทันที</span>
              </button>
            </div>
          )}

          {/* Status 3: Downloading / Installing */}
          {status === 'downloading' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
              <DownloadCloud className="w-8 h-8 text-indigo-400 animate-bounce" />
              <div>
                <p className="text-sm font-bold text-white">กำลังดาวน์โหลดอัปเดตจาก GitHub...</p>
                <p className="text-xs text-slate-400 mt-1">
                  ระบบ Download Manager กำลังโหลดไฟล์ และจะเปิดหน้าจอติดตั้งให้ทันที
                </p>
              </div>
            </div>
          )}

          {/* Status 4: Up to date */}
          {status === 'up_to_date' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  แอปของคุณเป็นเวอร์ชันล่าสุดแล้ว (<strong>v{CURRENT_APP_VERSION.version}</strong>) ไม่มีอัปเดตค้างอยู่
                </span>
              </div>

              {/* Current Version Features */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  ฟีเจอร์ในเวอร์ชันปัจจุบัน:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {CURRENT_APP_VERSION.releaseNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={checkForUpdates}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ตรวจหาอัปเดตอีกครั้ง</span>
                </button>
                <a
                  href={`https://github.com/${GITHUB_REPO}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>ดูบน GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-bold">เกิดข้อผิดพลาด</p>
                  <p className="text-[11px] text-rose-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={checkForUpdates}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ลองใหม่อีกครั้ง</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {GITHUB_REPO}
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
