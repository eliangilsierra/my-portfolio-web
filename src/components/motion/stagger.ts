import { MOTION } from '@/config/constants';

/** Reveal delay (s) for the nth item of a grid, capped so long lists do not feel sluggish. */
export function staggerDelay(index: number): number {
  return Math.min(index, MOTION.maxStaggerIndex) * MOTION.staggerStep;
}
