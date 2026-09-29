import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the load animation starts. */
  delay?: number;
  /** Animate as the element scrolls into view instead of on load. */
  inView?: boolean;
  className?: string;
}

/**
 * Fade-and-rise entrance implemented in CSS (see `.reveal` in index.css), so it costs no
 * JavaScript, is visible in prerendered HTML and honors `prefers-reduced-motion`.
 */
export function Reveal({ children, delay = 0, inView = false, className }: RevealProps) {
  const style = delay > 0 ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined;

  return (
    <div className={cn(inView ? 'reveal-in-view' : 'reveal', className)} style={style}>
      {children}
    </div>
  );
}
