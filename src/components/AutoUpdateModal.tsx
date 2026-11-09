import React, { useState, useEffect } from 'react';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
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
  Zap,
  Package,
  ArrowRight,
} from 'lucide-react';

import { APP_VERSION_NAME, APP_BUILD, APP_RELEASE_DATE } from '../config/version';
import {
  applyNow,
  downloadOta,
  fetchManifest,
  getApkUrl,
  getUpdateKind,
  type Manifest,
  type UpdateKind,
} from '../utils/otaUpdater';

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
    '⚡ อัปเดตเว็บในแอปจริงผ่าน OTA Bundle ไม่ต้องติดตั้ง APK ใหม่และไม่ต้องเปิดหน้าจอติดตั้งของ Android',
    '🎬 ปรับปรุงการซิงค์ซับไตเติลกับวิดีโอ',
    '⚔️ เพิ่มอนิเมะลิขสิทธิ์แท้จากช่องทางอย่างเป็นทางการ พร้อมซับไทย',
    '📚 ขยายคลังคำศัพท์ (Words Vault) ครอบคลุม N5, N4, N3',
    '🥋 ซิงค์สถานะการทบทวน SRS Flashcards ใน The Dojo',
  ],
};

const GITHUB_REPO = 'MosStep/umami-japanese';

type Status =
  | 'checking'
  | 'has_update'
  | 'up_to_date'
  | 'ota_downloading'
  | 'ota_applying'
  | 'downloading'
  | 'error';

export const AutoUpdateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<Status>('checking');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [updateKind, setUpdateKind] = useState<UpdateKind>('none');
  const [progress, setProgress] = useState<number>(0);
  const [isNativeApp, setIsNativeApp] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Must run before the early `return null` below, so it is called on every render.
  useLockBodyScroll(isOpen);

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
      const m = await fetchManifest();
      const kind = getUpdateKind(m);
      setManifest(m);
      setUpdateKind(kind);
      setStatus(kind === 'none' ? 'up_to_date' : 'has_update');
    } catch (err: any) {
      console.warn('Update check failed:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการตรวจสอบอัปเดต');
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkForUpdates();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Primary: real web-bundle OTA update (download with progress, then swap the bundle and reload)
  const handleStartOta = async () => {
    if (!manifest) return;
    setStatus('ota_downloading');
    setProgress(0);
    setErrorMessage('');

    try {
      const bundle = await downloadOta(manifest, (pct) => setProgress(Math.round(pct)));
      setProgress(100);
      setStatus('ota_applying');
      await applyNow(bundle);
    } catch (err: any) {
      console.error('OTA update failed:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'ดาวน์โหลดอัปเดตในแอปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // 2. Fallback: full APK install (only when the native shell changed)
  const handleStartApkUpdate = () => {
    const apkUrl = manifest ? getApkUrl(manifest) : '';
    if (!apkUrl) {
      setErrorMessage('ไม่พบไฟล์ APK ใน Release บน GitHub');
      return;
    }

    setStatus('downloading');

    if (isNativeApp && (window as any).AndroidAutoUpdater?.installApkFromUrl) {
      if (!canInstall && (window as any).AndroidAutoUpdater?.openUnknownAppSourcesPermission) {
        (window as any).AndroidAutoUpdater.openUnknownAppSourcesPermission();
        return;
      }
      (window as any).AndroidAutoUpdater.installApkFromUrl(apkUrl);
      setTimeout(() => {
        onClose();
      }, 1500);
      return;
    }

    // Browser fallback
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

  const latestVersion = manifest?.version ?? '';
  const releaseNotes = manifest?.release_notes ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem_+_var(--safe-area-inset-top,0px))] bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-rose-950/90 border-b border-indigo-500/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                <Github className="w-3.5 h-3.5" />
                <span>In-App OTA Updater</span>
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
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Unknown App Sources Alert for APK Fallback */}
          {isNativeApp && !canInstall && status === 'downloading' && (
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
                กรุณาแตะ "กดเปิดสิทธิ์" เพื่อเปิดตัวเลือก <strong>อนุญาตจากแหล่งที่มานี้</strong> สำหรับการลงไฟล์ APK
              </p>
            </div>
          )}

          {/* Status: Checking */}
          {status === 'checking' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <div>
                <p className="text-sm font-bold text-white">กำลังตรวจสอบเวอร์ชันล่าสุด...</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{GITHUB_REPO}</p>
              </div>
            </div>
          )}

          {/* Status: Has update available */}
          {status === 'has_update' && manifest && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    พบเวอร์ชันใหม่พร้อมใช้งาน!
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300">v{latestVersion}</span>
                </div>
                {manifest.announcement && (
                  <p className="text-sm font-bold text-white">{manifest.announcement}</p>
                )}
              </div>

              {/* Release Notes */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  บันทึกการเปลี่ยนแปลง (Release Notes):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 max-h-36 overflow-y-auto">
                  {releaseNotes.length > 0 ? (
                    releaseNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))
                  ) : (
                    <li>ไม่มีรายละเอียดการเปลี่ยนแปลง</li>
                  )}
                </ul>
              </div>

              {/* UPDATE OPTIONS */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>เลือกรูปแบบการอัปเดต:</span>
                </div>

                {updateKind === 'ota' && (
                  <button
                    onClick={handleStartOta}
                    className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 active:scale-[0.99] text-white shadow-xl shadow-emerald-950/50 transition-all border border-emerald-400/40 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-amber-200 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">⚡ อัปเดตในแอปทันที (ไม่ต้องติดตั้งใหม่)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white font-extrabold">
                              แนะนำ
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-100 mt-1">
                            ดาวน์โหลดเฉพาะส่วนเว็บของแอป แล้วรีเฟรชใช้งานได้ทันที ไม่เปิดหน้าจอติดตั้ง APK
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 opacity-80 group-hover:translate-x-1 transition-transform mt-1" />
                    </div>
                  </button>
                )}

                {updateKind === 'apk' && (
                  <p className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200">
                    ℹ️ อัปเดตนี้มีการเปลี่ยนส่วนเครื่อง (native) ต้องติดตั้ง APK ครั้งเดียว
                  </p>
                )}

                {updateKind === 'apk' && (
                  <button
                    onClick={handleStartApkUpdate}
                    className="w-full text-left p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-300 transition-all active:scale-[0.99] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-200">📦 ติดตั้งไฟล์ APK ใหม่</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            สำหรับอัปเดตส่วนเครื่อง (Native) ของแอปบน Android
                          </p>
                        </div>
                      </div>
                      <DownloadCloud className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status: Web bundle downloading, real progress */}
          {status === 'ota_downloading' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <DownloadCloud className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">กำลังดาวน์โหลดอัปเดต...</h3>
                <p className="text-xs text-slate-400 mt-1">ไม่ต้องลง APK ระบบกำลังดาวน์โหลดส่วนเว็บของแอป</p>
              </div>
              <div className="w-full max-w-xs space-y-1.5">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-300">{progress}%</p>
              </div>
            </div>
          )}

          {/* Status: Applying (webview reloads) */}
          {status === 'ota_applying' && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ดาวน์โหลดอัปเดตเสร็จแล้ว!</h3>
                <p className="text-xs text-emerald-300 mt-1">
                  กำลังรีเฟรชแอปเป็น <strong>v{latestVersion}</strong>...
                </p>
              </div>
            </div>
          )}

          {/* Status: Downloading Native APK */}
          {status === 'downloading' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
              <DownloadCloud className="w-8 h-8 text-indigo-400 animate-bounce" />
              <div>
                <p className="text-sm font-bold text-white">กำลังดาวน์โหลดไฟล์ APK จาก GitHub...</p>
                <p className="text-xs text-slate-400 mt-1">
                  ระบบ Download Manager กำลังโหลดไฟล์ และจะเปิดหน้าจอติดตั้งของ Android ให้ทันที
                </p>
              </div>
            </div>
          )}

          {/* Status: Up to date */}
          {status === 'up_to_date' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">
                    แอปของคุณเป็นเวอร์ชันล่าสุดแล้ว (v{CURRENT_APP_VERSION.version})
                  </p>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">
                    ✅ ข้อมูลและเนื้อหาทั้งหมดเป็นปัจจุบันเรียบร้อยแล้ว
                  </p>
                </div>
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

              {/* Actions when up to date */}
              <div className="flex gap-2">
                <button
                  onClick={checkForUpdates}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ตรวจหาอัปเดต</span>
                </button>
                <a
                  href={`https://github.com/${GITHUB_REPO}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>GitHub</span>
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
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
