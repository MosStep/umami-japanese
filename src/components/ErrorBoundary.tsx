import React from 'react';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

// Top-level render guard. It deliberately does NOT call notifyAppReady: a bundle that crashed
// must stay unconfirmed so the updater rolls it back on the next launch.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Render error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4 p-6 pt-[calc(1.5rem_+_var(--sat))] pb-[calc(1.5rem_+_var(--sab))]">
        <p className="text-base font-bold text-center">เกิดข้อผิดพลาด — แตะเพื่อโหลดใหม่</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-11 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold active:opacity-70"
        >
          โหลดใหม่
        </button>
      </div>
    );
  }
}
