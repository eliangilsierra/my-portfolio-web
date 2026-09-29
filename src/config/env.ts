const baseUrl = import.meta.env.BASE_URL;

/** Base path the app is served from ("/" locally, "/<repo>/" on GitHub Pages). */
export const BASE_URL = baseUrl;

/** React Router expects no trailing slash, except for the root. */
export const ROUTER_BASENAME = baseUrl === '/' ? '/' : baseUrl.replace(/\/$/, '');

/** Resolves a path from `public/` against the deployment base path. */
export function assetUrl(path: string): string {
  return `${baseUrl}${path.replace(/^\//, '')}`;
}

/** Opt in to React Router v7 behaviour now so the eventual upgrade is a version bump. */
export const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;
