import { MOTION } from '@/config/constants';

/** Reveal delay (s) for the nth item of a grid, capped so long lists do not feel sluggish. */
export function staggerDelay(index: number): number {
  // Rounded so the value serialises cleanly into CSS (0.3, not 0.30000000000000004).
  return Math.round(Math.min(index, MOTION.maxStaggerIndex) * MOTION.staggerStep * 100) / 100;
}
