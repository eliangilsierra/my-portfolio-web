import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  className?: string;
}

/**
 * Fade-and-rise entrance on load, in CSS (see `.reveal` in styles/motion.css). It plays before
 * hydration, is visible in prerendered HTML and honours `prefers-reduced-motion`. Use it for the
 * first viewport; content further down uses `ScrollReveal`.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const style = delay > 0 ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined;

  return (
    <div className={cn('reveal', className)} style={style}>
      {children}
    </div>
  );
}
