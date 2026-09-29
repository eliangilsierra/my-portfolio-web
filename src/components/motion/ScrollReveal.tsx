import { useRef, type ReactNode } from 'react';
import { DISTANCE, DURATION, EASE, SCROLL_REVEAL_START, STAGGER } from '@/config/motion';
import { whenBelowFold } from './below-fold';
import { gsap, useGSAP } from './gsap';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Starting states. Opacity (not visibility) keeps hidden content focusable: tabbing to it
 * scrolls it into view, which plays the reveal.
 */
const FROM = {
  rise: { opacity: 0, y: DISTANCE.rise },
  fade: { opacity: 0 },
  clip: { clipPath: 'inset(0% 0% 100% 0%)' },
  draw: { scaleX: 0, transformOrigin: 'left center' },
} as const satisfies Record<string, gsap.TweenVars>;

export type RevealVariant = keyof typeof FROM;

interface ScrollRevealProps {
  children?: ReactNode;
  variant?: RevealVariant;
  /** CSS selector of descendants to reveal one after another, instead of the wrapper itself. */
  items?: string;
  className?: string;
}

/** Reveals content as it scrolls into view (GSAP ScrollTrigger). Without JavaScript it is simply visible. */
export function ScrollReveal({ children, variant = 'rise', items, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const element = ref.current;
      if (!element || reduced || !contextSafe) return;

      return whenBelowFold(
        element,
        contextSafe(() => {
          const targets = items ? element.querySelectorAll(items) : element;
          gsap.from(targets, {
            ...FROM[variant],
            duration: DURATION.slow,
            ease: variant === 'clip' ? EASE.inOut : EASE.out,
            stagger: (index: number) => Math.min(index, STAGGER.maxItems) * STAGGER.item,
            clearProps: 'transform,opacity,clipPath',
            scrollTrigger: { trigger: element, start: SCROLL_REVEAL_START, once: true },
          });
        }),
      );
    },
    { scope: ref, dependencies: [reduced, variant, items] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
