import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { VideoFeed } from './components/VideoFeed';
import { ImmersionPlayer } from './components/ImmersionPlayer';
import { WordsDirectory } from './components/WordsDirectory';
import { TheDojo } from './components/TheDojo';
import { GamificationProfile } from './components/GamificationProfile';
import { SettingsModal } from './components/SettingsModal';
import { AutoUpdateModal, CURRENT_APP_VERSION } from './components/AutoUpdateModal';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Automatic GitHub Release Check on App Launch
  useEffect(() => {
    const checkGitHubUpdateOnStart = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/MosStep/umami-japanese/releases/latest');
        if (res.ok) {
          const data = await res.json();
          const latestTag = (data.tag_name || '').replace(/^v/, '').trim();
          const currentVer = CURRENT_APP_VERSION.version.replace(/^v/, '').trim();

          const lParts = latestTag.split('.').map((n: string) => parseInt(n, 10) || 0);
          const cParts = currentVer.split('.').map((n: string) => parseInt(n, 10) || 0);
          let isNewer = false;
          for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
            const l = lParts[i] || 0;
            const c = cParts[i] || 0;
            if (l > c) {
              isNewer = true;
              break;
            }
            if (l < c) {
              break;
            }
          }
          if (isNewer) {
            // New version available on GitHub! Prompt user automatically.
            setShowUpdateModal(true);
          }
        }
      } catch {
        // Silent fail on offline or network issue
      }
    };

    checkGitHubUpdateOnStart();
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
