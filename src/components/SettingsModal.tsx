import React, { useState } from 'react';
import { useApp, AIProvider } from '../context/AppContext';
import { APP_VERSION, APP_BUILD } from '../config/version';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import {
  X,
  Key,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  Layers,
} from 'lucide-react';

interface Props {
  onOpenUpdate?: () => void;
}

export const SettingsModal: React.FC<Props> = ({ onOpenUpdate }) => {
  const {
    showSettingsModal,
    setShowSettingsModal,
    apiKey,
    setApiKey,
    aiModel,
    setAiModel,
    aiProvider,
    setAiProvider,
  } = useApp();

  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState<string>(aiModel);
  const [providerChoice, setProviderChoice] = useState<AIProvider>(aiProvider);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Called before the early return below so the hook order stays stable.
  useLockBodyScroll(showSettingsModal);

  if (!showSettingsModal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey);
    setAiModel(selectedModel);
    setAiProvider(providerChoice);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettingsModal(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem_+_var(--sat))] bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">ตั้งค่า</h2>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            aria-label="ปิด"
            className="min-h-11 min-w-11 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-5">
          {/* App Version & Auto-Update Section */}
          {onOpenUpdate && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-300 block">
                  เวอร์ชันแอป
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {APP_VERSION} (Build {APP_BUILD})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  onOpenUpdate();
                }}
                className="min-h-11 px-3 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ตรวจอัปเดต</span>
              </button>
            </div>
          )}

          {/* AI for the roleplay chat: rarely changed, so folded away */}
          <details className="group rounded-xl border border-slate-800 bg-slate-950/50">
            <summary className="min-h-11 px-3.5 flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                AI สำหรับฝึกคุย (ขั้นสูง)
              </span>
              <span className="text-xs text-slate-500 group-open:hidden">แตะเพื่อเปิด</span>
            </summary>
            <div className="p-3.5 pt-1 space-y-5">
          {/* Engine Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ผู้ให้บริการ AI
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProviderChoice('tenixe');
                  setSelectedModel('claude-haiku-5-5');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  providerChoice === 'tenixe'
                    ? 'bg-rose-500/15 border-rose-500/50 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-400">Tenixe API</span>
                  {providerChoice === 'tenixe' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Claude Haiku 5.5 (default)
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProviderChoice('kob-ai');
                  setSelectedModel('minimax-m3.1-flash');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  providerChoice === 'kob-ai'
                    ? 'bg-indigo-500/15 border-indigo-500/50 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-400">Kob AI</span>
                  {providerChoice === 'kob-ai' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  0.075 credit Flat
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProviderChoice('local')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  providerChoice === 'local'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400">Local Offline</span>
                  {providerChoice === 'local' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  100% Free / No Key
                </p>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {providerChoice === 'tenixe'
                ? 'Tenixe API Key (Bearer txc_...)'
                : 'Kob AI API Key'}
            </label>
            <input
              type="password"
              placeholder="วางคีย์ API ที่นี่"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              โมเดล
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {providerChoice === 'tenixe' ? (
                <>
                  <option value="claude-haiku-5-5">claude-haiku-5-5 (แนะนำ / เร็ว)</option>
                  <option value="deepseek-v4-flash">deepseek-v4-flash (คิดนาน / ตอบยาว)</option>
                  <option value="nemotron-3-ultra">nemotron-3-ultra (ช้า)</option>
                </>
              ) : (
                <>
                  <option value="minimax-m3.1-flash">minimax-m3.1-flash (0.075 credit Flat)</option>
                  <option value="nemotron-3-ultra">nemotron-3-ultra (0.125 credit Flat)</option>
                  <option value="deepseek-v4.1-flash">deepseek-v4.1-flash (0.20 credit Flat)</option>
                </>
              )}
            </select>
          </div>

            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>บันทึกแล้ว</span>
                </>
              ) : (
                <span>บันทึก</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
