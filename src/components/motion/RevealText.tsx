import { useRef, type ReactNode } from 'react';
import { DURATION, EASE, SCROLL_REVEAL_START, STAGGER } from '@/config/motion';
import { whenBelowFold } from './below-fold';
import { gsap, ScrollTrigger, SplitText, useGSAP } from './gsap';
import { usePrefersReducedMotion } from './useMediaQuery';

type TextTag = 'h2' | 'h3' | 'p';

interface RevealTextProps {
  as?: TextTag;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Text that rises line by line out of a mask as it scrolls into view (GSAP SplitText). Until then
 * it is only clipped, which costs no layout; the lines are split just before they animate and the
 * split is undone afterwards, so resizing later never meets stale lines. Splitting is by line only,
 * so screen readers still read whole words; without JavaScript or with reduced motion the text is
 * never split.
 */
export function RevealText({ as: Tag = 'p', children, className, id }: RevealTextProps) {
  // One ref that fits every allowed tag.
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const element = ref.current;
      if (!element || reduced || !contextSafe) return;

      const riseLines = contextSafe(() => {
        SplitText.create(element, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
          onSplit: (split) => {
            gsap.set(element, { clipPath: 'none' });
            gsap.from(split.lines, {
              yPercent: 105,
              duration: DURATION.epic,
              ease: EASE.out,
              stagger: STAGGER.line,
              onComplete: () => split.revert(),
            });
          },
        });
      });

      return whenBelowFold(
        element,
        contextSafe(() => {
          gsap.set(element, { clipPath: 'inset(0% 0% 100% 0%)' });
          ScrollTrigger.create({
            trigger: element,
            start: SCROLL_REVEAL_START,
            once: true,
            onEnter: riseLines,
          });
        }),
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
