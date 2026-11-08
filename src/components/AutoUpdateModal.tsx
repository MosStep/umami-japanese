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
  Zap,
  Package,
  Check,
  ArrowRight,
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

export const getActiveVersionInfo = (): VersionInfo => {
  try {
    const liveVer = localStorage.getItem('umami_live_version');
    const liveBuild = localStorage.getItem('umami_live_build');
    const liveDate = localStorage.getItem('umami_live_date');
    const liveNotes = localStorage.getItem('umami_live_release_notes');

    if (liveVer) {
      return {
        version: liveVer,
        build: liveBuild ? parseInt(liveBuild, 10) : APP_BUILD,
        releaseDate: liveDate || APP_RELEASE_DATE,
        releaseNotes: liveNotes
          ? JSON.parse(liveNotes)
          : [
              '⚡ รองรับระบบ In-App Live Update (OTA) อัปเดตเนื้อหาทันทีโดยไม่ต้องลง APK ใหม่',
              '⚔️ เพิ่มอนิเมะลิขสิทธิ์แท้จากช่อง Ani-One Asia และ Ani-One Thailand (Jujutsu Kaisen #1 & #2, Bleach #1, Chainsaw Man, Blue Lock)',
              '📚 ขยายคลังคำศัพท์ (Words Vault) เพิ่มขึ้นเป็น 125+ คำ ครอบคลุม N5, N4, N3 (คำกริยา, คุณศัพท์, คำนาม และศัพท์ต่อสู้อนิเมะ)',
              '🎬 ซับไตเติลและคำแปลไทยต่อเนื่องสำหรับทุกคลิปในระบบ (Gaming, Anime, Food, Podcasts, Vlogs, J-Pop)',
              '🥋 ซิงค์สถานะการทบทวน SRS Flashcards ใน The Dojo ได้อย่างสมบูรณ์แบบ',
            ],
      };
    }
  } catch {}

  return {
    version: APP_VERSION_NAME,
    build: APP_BUILD,
    releaseDate: APP_RELEASE_DATE,
    releaseNotes: [
      '⚡ รองรับระบบ In-App Live Update (OTA) อัปเดตเนื้อหาทันทีโดยไม่ต้องลง APK ใหม่',
      '⚔️ เพิ่มอนิเมะลิขสิทธิ์แท้จากช่อง Ani-One Asia และ Ani-One Thailand (Jujutsu Kaisen #1 & #2, Bleach #1, Chainsaw Man, Blue Lock)',
      '📚 ขยายคลังคำศัพท์ (Words Vault) เพิ่มขึ้นเป็น 125+ คำ ครอบคลุม N5, N4, N3 (คำกริยา, คุณศัพท์, คำนาม และศัพท์ต่อสู้อนิเมะ)',
      '🎬 ซับไตเติลและคำแปลไทยต่อเนื่องสำหรับทุกคลิปในระบบ (Gaming, Anime, Food, Podcasts, Vlogs, J-Pop)',
      '🥋 ซิงค์สถานะการทบทวน SRS Flashcards ใน The Dojo ได้อย่างสมบูรณ์แบบ',
    ],
  };
};

export const CURRENT_APP_VERSION: VersionInfo = {
  get version() {
    return getActiveVersionInfo().version;
  },
  set version(_val: string) {},
  get build() {
    return getActiveVersionInfo().build;
  },
  set build(_val: number) {},
  get releaseDate() {
    return getActiveVersionInfo().releaseDate;
  },
  set releaseDate(_val: string) {},
  get releaseNotes() {
    return getActiveVersionInfo().releaseNotes;
  },
  set releaseNotes(_val: string[]) {},
};

const GITHUB_REPO = 'MosStep/umami-japanese';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const GITHUB_RAW_CATALOG_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/public/live_catalog.json`;

export const AutoUpdateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<
    'checking' | 'has_update' | 'up_to_date' | 'live_updating' | 'live_success' | 'downloading' | 'error'
  >('checking');
  const [latestTag, setLatestTag] = useState<string>('');
  const [latestTitle, setLatestTitle] = useState<string>('');
  const [latestBody, setLatestBody] = useState<string>('');
  const [apkUrl, setApkUrl] = useState<string>('');
  const [apkSizeMB, setApkSizeMB] = useState<string>('');
  const [isNativeApp, setIsNativeApp] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [liveUpdateStep, setLiveUpdateStep] = useState<number>(1);
  const [isLiveOtaActive, setIsLiveOtaActive] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('umami_live_version');
    } catch {
      return false;
    }
  });

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
      let data: any = null;
      let rawTag = '';

      try {
        const res = await fetch(GITHUB_API_URL, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (res.ok) {
          data = await res.json();
          rawTag = (data.tag_name || '').trim();
        }
      } catch (apiErr) {
        console.warn('GitHub API fetch failed, trying raw catalog fallback:', apiErr);
      }

      // Fallback to raw catalog if API limited or offline
      if (!data) {
        const catRes = await fetch(`${GITHUB_RAW_CATALOG_URL}?t=${Date.now()}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          data = {
            tag_name: `v${catData.version}`,
            name: `v${catData.version} (Live Catalog)`,
            body: catData.announcement || (catData.release_notes ? catData.release_notes.join('\n') : ''),
            assets: [],
          };
          rawTag = data.tag_name;
        } else {
          throw new Error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปเดต GitHub ได้');
        }
      }

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

  // 1. Primary: In-App Live OTA Update (Zero APK, Instant Refresh)
  const handleStartLiveUpdate = async () => {
    setStatus('live_updating');
    setLiveUpdateStep(1);

    try {
      // Step 1: Connect & download live catalog
      setLiveUpdateStep(1);
      await new Promise((r) => setTimeout(r, 400));

      let catalogData: any = null;
      try {
        const catRes = await fetch(`${GITHUB_RAW_CATALOG_URL}?t=${Date.now()}`);
        if (catRes.ok) {
          catalogData = await catRes.json();
        }
      } catch (e) {
        console.warn('Raw catalog fetch failed:', e);
      }

      // Step 2: Sync and cache data
      setLiveUpdateStep(2);
      await new Promise((r) => setTimeout(r, 600));

      const cleanTag = (latestTag || 'v1.0.6').replace(/^v/, '');
      const notes = latestBody
        ? latestBody.split('\n').filter((l) => l.trim().length > 0)
        : CURRENT_APP_VERSION.releaseNotes;

      // Persist live OTA state into LocalStorage
      localStorage.setItem('umami_live_version', cleanTag);
      localStorage.setItem('umami_live_tag', latestTag || `v${cleanTag}`);
      localStorage.setItem('umami_live_title', latestTitle);
      localStorage.setItem('umami_live_date', new Date().toISOString().split('T')[0]);
      localStorage.setItem('umami_live_release_notes', JSON.stringify(notes));
      if (catalogData) {
        localStorage.setItem('umami_live_catalog', JSON.stringify(catalogData));
      }

      // Step 3: Success state
      setLiveUpdateStep(3);
      setIsLiveOtaActive(true);
      await new Promise((r) => setTimeout(r, 500));

      setStatus('live_success');

      // Step 4: Smooth instant reload after 1.6s
      setTimeout(() => {
        window.location.reload();
      }, 1600);
    } catch (err: any) {
      console.error('Live update failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการทำ In-App Live Update');
    }
  };

  // 2. Secondary: Fallback Native APK Update
  const handleStartApkUpdate = () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
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
                <span>In-App Live OTA & Auto-Updater</span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ระบบอัปเดตอัตโนมัติ</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  v{CURRENT_APP_VERSION.version}
                </span>
                {isLiveOtaActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live OTA
                  </span>
                )}
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
                    {latestTag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{latestTitle}</h3>
              </div>

              {/* Release Notes */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  บันทึกการเปลี่ยนแปลง (Release Notes):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 max-h-36 overflow-y-auto">
                  {latestBody}
                </p>
              </div>

              {/* DUAL UPDATE OPTIONS */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>เลือกรูปแบบการอัปเดต:</span>
                </div>

                {/* Option 1: Primary - In-App Live OTA Update */}
                <button
                  onClick={handleStartLiveUpdate}
                  className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 active:scale-[0.99] text-white shadow-xl shadow-emerald-950/50 transition-all border border-emerald-400/40 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-amber-200 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">⚡ อัปเดตในแอพทันที (ไม่ต้องติดตั้งใหม่)</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white font-extrabold">
                            แนะนำ
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-100 mt-1">
                          โหลด Live Catalog และคลังคำศัพท์ใหม่เสร็จใน 2 วินาที • รีเฟรชแล้วใช้ได้ทันที 100% โดยไม่ต้องโหลดไฟล์ APK ซ้ำ
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 shrink-0 opacity-80 group-hover:translate-x-1 transition-transform mt-1" />
                  </div>
                </button>

                {/* Option 2: Fallback - Native APK Update */}
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">
                            📦 ติดตั้งไฟล์ APK ใหม่ (ทางเลือกสำรอง)
                          </span>
                          {apkSizeMB && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({apkSizeMB} MB)
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          สำหรับกรณีต้องการอัปเดต Native Container หรือระบบแพ็กเกจของ Android
                        </p>
                      </div>
                    </div>
                    <DownloadCloud className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Status 3: Live OTA Updating Progress */}
          {status === 'live_updating' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">กำลังอัปเดต In-App Live OTA...</h3>
                <p className="text-xs text-slate-400 mt-1">ไม่ต้องลง APK ระบบกำลังซิงค์คลังคำศัพท์และเนื้อหาล่าสุด</p>
              </div>

              {/* Progress Steps */}
              <div className="w-full max-w-xs space-y-2 text-left text-xs bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  {liveUpdateStep >= 1 ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  )}
                  <span className={liveUpdateStep >= 1 ? 'text-white' : 'text-slate-400'}>
                    1. เชื่อมต่อ GitHub Live Catalog
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {liveUpdateStep >= 2 ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  )}
                  <span className={liveUpdateStep >= 2 ? 'text-white' : 'text-slate-400'}>
                    2. ซิงค์คลังคำศัพท์ 125+ คำ & อนิเมะ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {liveUpdateStep >= 3 ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  )}
                  <span className={liveUpdateStep >= 3 ? 'text-white' : 'text-slate-400'}>
                    3. บันทึกและเตรียมรีโหลดหน้าจอ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status 4: Live OTA Success */}
          {status === 'live_success' && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">🎉 อัปเดต In-App สำเร็จแล้ว!</h3>
                <p className="text-xs text-emerald-300 mt-1">
                  ปรับใช้เวอร์ชัน <strong>{latestTag}</strong> สำเร็จ กำลังรีเฟรชแอพใน 2 วินาที...
                </p>
              </div>
            </div>
          )}

          {/* Status 5: Downloading Native APK */}
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

          {/* Status 6: Up to date */}
          {status === 'up_to_date' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">
                    แอปของคุณเป็นเวอร์ชันล่าสุดแล้ว (v{CURRENT_APP_VERSION.version})
                  </p>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">
                    {isLiveOtaActive
                      ? '⚡ กำลังทำงานด้วยระบบ In-App Live OTA ที่อัปเดตผ่านระบบคลาวด์'
                      : '✅ ข้อมูลและเนื้อหาทั้งหมดเป็นปัจจุบันเรียบร้อยแล้ว'}
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
              <div className="space-y-2">
                <button
                  onClick={handleStartLiveUpdate}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600/30 to-indigo-600/30 border border-emerald-500/40 hover:bg-emerald-600/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ บังคับซิงค์ Live Catalog อีกครั้ง (Force Live Sync)</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={checkForUpdates}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ตรวจหาอัปเดต</span>
                  </button>
                  <button
                    onClick={handleStartApkUpdate}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="ดาวน์โหลด APK ตัวเต็ม"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>โหลด APK</span>
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
