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
  /** Scrolling down further than this (px) tucks the header away until the visitor scrolls up. */
  hideAfter: 320,
} as const;

/**
 * Every page is a numbered sheet of the same drawing set. The numbers follow the navigation order,
 * so the header, the page titles and the footer index agree.
 */
export const SHEETS = {
  home: '00',
  projects: '01',
  pills: '02',
  about: '03',
  contact: '04',
} as const;

export const CONTACT = {
  mockLatencyMs: 800,
  nameMinLength: 2,
  nameMaxLength: 100,
  emailMaxLength: 255,
  messageMinLength: 10,
  messageMaxLength: 1000,
} as const;
