import { useRef } from 'react';
import { DISTANCE, DURATION, EASE } from '@/config/motion';
import { gsap, useGSAP } from './gsap';
import { usePointerMotion } from './useMediaQuery';

/**
 * Makes an element lean towards the pointer while it hovers, then settle back. Only with a fine
 * pointer and when motion is allowed; the element is otherwise untouched.
 */
export function useMagnetic<T extends HTMLElement>(strength: number = DISTANCE.magnetStrength) {
  const ref = useRef<T>(null);
  const enabled = usePointerMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !enabled) return;

      const settings = { duration: DURATION.slow, ease: EASE.out };
      const toX = gsap.quickTo(element, 'x', settings);
      const toY = gsap.quickTo(element, 'y', settings);

      const follow = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        toX((event.clientX - (box.left + box.width / 2)) * strength);
        toY((event.clientY - (box.top + box.height / 2)) * strength);
      };
      const settle = () => {
        toX(0);
        toY(0);
      };

      element.addEventListener('pointermove', follow);
      element.addEventListener('pointerleave', settle);
      return () => {
        element.removeEventListener('pointermove', follow);
        element.removeEventListener('pointerleave', settle);
      };
    },
    { dependencies: [enabled, strength], revertOnUpdate: true },
  );

  return ref;
}
