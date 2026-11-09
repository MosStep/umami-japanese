import React, { useState, useEffect, useRef } from 'react';
import { X, Zap } from 'lucide-react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { VideoFeed } from './components/VideoFeed';
import { ImmersionPlayer } from './components/ImmersionPlayer';
import { WordsDirectory } from './components/WordsDirectory';
import { TheDojo } from './components/TheDojo';
import { GamificationProfile } from './components/GamificationProfile';
import { SettingsModal } from './components/SettingsModal';
import { AutoUpdateModal } from './components/AutoUpdateModal';
import type { BundleInfo } from '@capgo/capacitor-updater';
import {
  applyNow,
  applyOnNextLaunch,
  downloadOta,
  fetchManifest,
  getUpdateKind,
  initOta,
  isNative,
  shouldSkipBackgroundOta,
} from './utils/otaUpdater';

const OtaReadyToast: React.FC<{ version: string; onRestart: () => void; onDismiss: () => void }> = ({
  version,
  onRestart,
  onDismiss,
}) => (
  <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl shadow-indigo-950/50 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-amber-300" />
      </div>
      <p className="flex-1 text-xs font-bold text-slate-100">✨ อัปเดต v{version} พร้อมแล้ว</p>
      <button
        onClick={onRestart}
        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors"
      >
        รีสตาร์ทเลย
      </button>
      <button
        onClick={onDismiss}
        aria-label="ปิด"
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [otaReady, setOtaReady] = useState<{ bundle: BundleInfo | null; version: string } | null>(null);
  const launchCheckStarted = useRef(false);

  // Launch check: fetch manifest, then either prompt for APK or silently pre-download the web bundle.
  useEffect(() => {
    if (launchCheckStarted.current) return;
    launchCheckStarted.current = true;

    const checkForUpdateOnStart = async () => {
      try {
        const manifest = await fetchManifest();
        const kind = getUpdateKind(manifest);

        if (kind === 'none') return;
        // APK-only change, or web (no OTA swap available): let the user choose in the modal.
        if (kind === 'apk' || !isNative()) {
          setShowUpdateModal(true);
          return;
        }

        // OTA on native: download in background, activate on next launch, offer instant restart.
        await initOta(); // ensures failed-update state from the plugin is loaded first
        if (shouldSkipBackgroundOta(manifest)) return;

        const bundle = await downloadOta(manifest, () => {});
        if (!bundle) return;
        await applyOnNextLaunch(bundle);
        setOtaReady({ bundle, version: manifest.version });
      } catch {
        // Silent fail on offline or network issue
      }
    };

    checkForUpdateOnStart();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar onOpenUpdate={() => setShowUpdateModal(true)} />

      <main className="flex-1 pb-20 md:pb-16">
        {activeTab === 'feed' && <VideoFeed />}
        {activeTab === 'player' && <ImmersionPlayer />}
        {activeTab === 'words' && <WordsDirectory />}
        {activeTab === 'dojo' && <TheDojo />}
        {activeTab === 'profile' && <GamificationProfile />}
      </main>

      {/* Settings & Auto-Update Modals */}
      <SettingsModal onOpenUpdate={() => setShowUpdateModal(true)} />
      <AutoUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />

      {otaReady && (
        <OtaReadyToast
          version={otaReady.version}
          onRestart={() => {
            applyNow(otaReady.bundle).catch((err) => console.warn('Apply update failed:', err));
          }}
          onDismiss={() => setOtaReady(null)}
        />
      )}

      {/* Persistent Studio Footer Bar (Desktop Only) */}
      <footer className="hidden md:block border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            うまみ (Umami) — Japanese Video Immersion & The Dojo
          </p>
          <p className="flex items-center gap-1.5 text-slate-600">
            <span>Mobile Android APK & Web</span>
            <span>•</span>
            <span>Zero-Cost Local + Kob AI Ready</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
