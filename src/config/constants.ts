/** Presentation limits and timings shared across the app. Keep magic numbers out of components. */

export const HOME = {
  featuredProjectsCount: 3,
  latestPillsCount: 3,
} as const;

export const PROJECT_CARD = {
  visibleTechBadges: 4,
} as const;

export const HEADER = {
  /** Vertical scroll (px) after which the header switches to its elevated style. */
  scrolledThreshold: 20,
} as const;

export const MOTION = {
  /** Delay (s) between consecutive cards in a grid. */
  staggerStep: 0.1,
  /** Cards beyond this index reveal without additional delay so long lists do not feel slow. */
  maxStaggerIndex: 6,
} as const;

export const CONTACT = {
  successMessageDurationMs: 5000,
  mockLatencyMs: 800,
  nameMinLength: 2,
  nameMaxLength: 100,
  emailMaxLength: 255,
  messageMinLength: 10,
  messageMaxLength: 1000,
} as const;
