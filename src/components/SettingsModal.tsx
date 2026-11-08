import React, { useState } from 'react';
import { useApp, AIProvider } from '../context/AppContext';
import { APP_VERSION, APP_BUILD } from '../config/version';
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

  const tenixePresetKeys = [
    { label: 'Key 1 (Unlimited Nemotron / Monthly)', key: 'txc_345f1910dae8f6d2c6932c85bb6e45cc' },
    { label: 'Key 2 (Daily Plan)', key: 'txc_a9b58666d7af0a1ef12675757074c61b' },
    { label: 'Key 3 (Daily Plan / Image quota)', key: 'txc_9fec4ca9adfabf57f99a27fc0161e95a' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Intelligence Engine Setup
            </h2>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-5">
          {/* Engine Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProviderChoice('tenixe');
                  setSelectedModel('nemotron-3-ultra');
                  if (!inputKey) setInputKey('txc_345f1910dae8f6d2c6932c85bb6e45cc');
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
                  Unlimited Nemotron-3
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

          {/* Preset Keys Shortcut for Tenixe */}
          {providerChoice === 'tenixe' && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 block font-medium">
                Quick Preset Keys:
              </span>
              <div className="space-y-1">
                {tenixePresetKeys.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputKey(p.key)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      inputKey === p.key
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {p.key.slice(0, 10)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {providerChoice === 'tenixe'
                ? 'Tenixe API Key (Bearer txc_...)'
                : 'Kob AI API Key'}
            </label>
            <input
              type="password"
              placeholder="Paste your API Key here..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Selected Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {providerChoice === 'tenixe' ? (
                <>
                  <option value="nemotron-3-ultra">nemotron-3-ultra (Unlimited / Best Value)</option>
                  <option value="deepseek-v4-flash">deepseek-v4-flash</option>
                  <option value="claude-haiku-5-5">claude-haiku-5-5</option>
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

          {/* App Version & Auto-Update Section */}
          {onOpenUpdate && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-300 block">
                  うまみ App Version
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
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Updates</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
