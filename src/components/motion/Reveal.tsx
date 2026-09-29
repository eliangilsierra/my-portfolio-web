import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Animate when scrolled into view (once) instead of on mount. */
  inView?: boolean;
  className?: string;
}

const HIDDEN = { opacity: 0, y: 20 };
const VISIBLE = { opacity: 1, y: 0 };

/** Fade-and-rise entrance. Honors `prefers-reduced-motion` through the app-level `MotionConfig`. */
export function Reveal({ children, delay = 0, inView = false, className }: RevealProps) {
  const trigger = inView
    ? { whileInView: VISIBLE, viewport: { once: true } }
    : { animate: VISIBLE };

  return (
    <motion.div
      initial={HIDDEN}
      {...trigger}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
