import { STAGGER } from '@/config/motion';

/** Reveal delay (s) for the nth item of a list, capped so long lists do not feel sluggish. */
export function staggerDelay(index: number): number {
  // Rounded so the value serialises cleanly into CSS (0.24, not 0.24000000000000002).
  return Math.round(Math.min(index, STAGGER.maxItems) * STAGGER.item * 100) / 100;
}
