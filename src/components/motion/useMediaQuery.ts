import { useSyncExternalStore } from 'react';
import { MEDIA } from '@/config/motion';

/**
 * Subscribes to a media query. `serverValue` is what prerendering and hydration assume; the real
 * value takes over right after hydration, so markup never depends on the visitor's device.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True when the visitor asked for less motion. Prerendering assumes reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(MEDIA.reducedMotion, true);
}

/** True for a mouse or trackpad (hover-capable, precise pointer). Touch screens get false. */
export function useFinePointer(): boolean {
  return useMediaQuery(MEDIA.finePointer, false);
}

/** Motion that follows the pointer: needs a fine pointer and no request for reduced motion. */
export function usePointerMotion(): boolean {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}
