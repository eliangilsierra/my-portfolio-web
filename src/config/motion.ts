/**
 * The motion system: one rhythm for CSS and GSAP. The CSS mirror lives in src/styles/motion.css.
 * Durations are in seconds (GSAP's unit). Nothing animates longer than `epic`, and nothing bounces.
 */
export const DURATION = {
  /** State flips: pressed, toggled. */
  instant: 0.12,
  /** Hovers and focus. */
  fast: 0.2,
  /** Most UI transitions: menus, reveals of small elements. */
  base: 0.42,
  /** Section reveals, images, line reveals. */
  slow: 0.8,
  /** Signature moments: headline entrances, schematic drawing. */
  epic: 1.2,
} as const;

export const EASE = {
  /** Decelerating, confident arrival. Matches `--ease-out-expo` in CSS. */
  out: 'expo.out',
  /** Symmetric moves between two states. Matches `--ease-in-out-cubic`. */
  inOut: 'power3.inOut',
  /** Strokes being drawn. */
  draw: 'power2.inOut',
  /** Scroll-scrubbed motion follows the scroll exactly. */
  linear: 'none',
} as const;

export const STAGGER = {
  /** Between characters of a split headline. */
  char: 0.028,
  /** Between lines of a split paragraph or headline. */
  line: 0.08,
  /** Between items of a list or grid. */
  item: 0.08,
  /** Items beyond this index reveal without extra delay, so long lists never feel slow. */
  maxItems: 6,
} as const;

/** Distances, in pixels unless stated otherwise. */
export const DISTANCE = {
  /** Vertical travel of a revealed block. */
  rise: 32,
  /** How far a magnetic element follows the pointer, as a fraction of the pointer offset. */
  magnetStrength: 0.35,
  /** Depth of the hero parallax layers, in pixels at the viewport edge. */
  parallax: 18,
} as const;

/** Where scroll-triggered reveals start: when the element's top crosses 85% of the viewport. */
export const SCROLL_REVEAL_START = 'top 85%';

/** Media queries that gate motion. */
export const MEDIA = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  finePointer: '(hover: hover) and (pointer: fine)',
  desktop: '(min-width: 1024px)',
} as const;
