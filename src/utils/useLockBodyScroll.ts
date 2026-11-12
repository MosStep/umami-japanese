import { useEffect } from 'react';

// Counter-based: several overlays can be open at once (e.g. a confirm dialog over a sheet).
// The page scroll is restored only when the last lock is released.
let lockCount = 0;
let savedOverflow = '';
// The app scrolls inside <main id="app-scroll"> (see App.tsx), not the body.
const scroller = (): HTMLElement => document.getElementById('app-scroll') ?? document.body;

export function useLockBodyScroll(isOpen: boolean): void {
  useEffect(() => {
    if (!isOpen) return;
    if (lockCount === 0) savedOverflow = scroller().style.overflow;
    lockCount += 1;
    scroller().style.overflow = 'hidden';
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) scroller().style.overflow = savedOverflow;
    };
  }, [isOpen]);
}
