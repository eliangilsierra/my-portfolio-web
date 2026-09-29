import type Lenis from 'lenis';
import { createContext, useContext, useMemo, type RefObject } from 'react';

/** Holds the smooth scroller while one is running (desktop pointer, motion allowed). */
export const SmoothScrollContext = createContext<RefObject<Lenis | null>>({ current: null });

/**
 * Pauses and resumes scrolling (for example while a full-screen menu is open). Works with the
 * smooth scroller when it runs and with native scrolling otherwise.
 */
export function useScrollLock(): { lock: () => void; unlock: () => void } {
  const lenis = useContext(SmoothScrollContext);

  return useMemo(
    () => ({
      lock: () => {
        lenis.current?.stop();
        document.documentElement.style.overflow = 'hidden';
      },
      unlock: () => {
        lenis.current?.start();
        document.documentElement.style.removeProperty('overflow');
      },
    }),
    [lenis],
  );
}
