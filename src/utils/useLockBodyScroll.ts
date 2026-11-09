import { useEffect } from 'react';

// Locks page scrolling while a modal or bottom sheet is open, so dragging on it
// does not scroll the page behind. Restores the previous overflow value on close.
export function useLockBodyScroll(isOpen: boolean): void {
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
}
