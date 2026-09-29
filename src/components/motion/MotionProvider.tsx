import Lenis from 'lenis';
import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { gsap, ScrollTrigger } from './gsap';
import { SmoothScrollContext } from './smooth-scroll';
import { usePointerMotion } from './useMediaQuery';

// Lenis' default easing: exponential ease-out over its duration.
const LENIS_EASING = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

/**
 * Runs the scroll engine for the whole site: Lenis smooths wheel scrolling on desktop and drives
 * ScrollTrigger from GSAP's ticker, so scroll-linked animations and the scroll position never
 * drift apart. Touch devices and reduced motion keep native scrolling untouched.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const smooth = usePointerMotion();
  const lenis = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!smooth) return;

    const instance = new Lenis({
      autoRaf: false,
      anchors: true,
      easing: LENIS_EASING,
      duration: 1.1,
    });
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.current = instance;

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis.current = null;
    };
  }, [smooth]);

  // A new page has a new layout: recompute every trigger once it has painted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <SmoothScrollContext value={lenis}>{children}</SmoothScrollContext>;
}
