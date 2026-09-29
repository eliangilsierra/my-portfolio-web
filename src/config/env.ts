/** Base path the app is served from ("/" locally, "/<repo>/" on GitHub Pages). */
const baseUrl = import.meta.env.BASE_URL;

/** Resolves a path from `public/` against the deployment base path. */
export function assetUrl(path: string): string {
  return `${baseUrl}${path.replace(/^\//, '')}`;
}

/**
 * Public address of the deployed site, without a trailing slash and including the base path
 * (for example `https://user.github.io/repo`). Needed for canonical, hreflang and social tags;
 * when it is not set those tags are simply omitted.
 */
export const SITE_URL: string | undefined = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '');
