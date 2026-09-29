import { Flip } from 'gsap/Flip';
import { useRef } from 'react';
import { DURATION, EASE } from '@/config/motion';
import { gsap, useGSAP } from './gsap';
import { usePrefersReducedMotion } from './useMediaQuery';

// Only the projects list re-orders, so Flip ships in its chunk rather than the first load.
gsap.registerPlugin(Flip);

const ITEM_SELECTOR = '[data-flip-id]';

/**
 * Animates a list between two layouts (GSAP Flip). Call `capture()` right before the change that
 * re-orders or filters the list; once React has rendered the new list, items glide to their new
 * places and newcomers fade in. Items are matched by their `data-flip-id`.
 */
export function useFlip<T extends HTMLElement>(layoutKey: unknown) {
  const scope = useRef<T>(null);
  const snapshot = useRef<Flip.FlipState | null>(null);
  const reduced = usePrefersReducedMotion();

  const capture = () => {
    if (reduced || !scope.current) return;
    snapshot.current = Flip.getState(scope.current.querySelectorAll(ITEM_SELECTOR));
  };

  useGSAP(
    () => {
      const state = snapshot.current;
      const container = scope.current;
      if (!state || !container) return;
      snapshot.current = null;

      Flip.from(state, {
        targets: container.querySelectorAll(ITEM_SELECTOR),
        duration: DURATION.base,
        ease: EASE.inOut,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.out },
          ),
      });
    },
    { scope, dependencies: [layoutKey] },
  );

  return { scope, capture };
}
