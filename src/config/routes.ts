/** Single source of truth for URL paths. */
export const ROUTES = {
  home: '/',
  projects: '/projects',
  project: (slug: string) => `/projects/${slug}`,
  pills: '/pills',
  pill: (slug: string) => `/pills/${slug}`,
  about: '/about',
  contact: '/contact',
} as const;

/** Route patterns for `<Route path>` declarations. */
export const ROUTE_PATTERNS = {
  projectDetail: '/projects/:slug',
  pillDetail: '/pills/:slug',
} as const;
