// Relative import with an extension: this module is also loaded by the build scripts under Node.
import type { Locale } from '../domain/locale.ts';

/** Locale-relative paths. `localizedPath` turns them into URLs by prefixing the locale. */
export const PATHS = {
  home: '/',
  projects: '/projects',
  project: (slug: string) => `/projects/${slug}`,
  pills: '/pills',
  pill: (slug: string) => `/pills/${slug}`,
  about: '/about',
  contact: '/contact',
} as const;

/** `/projects` in Spanish is `/es/projects`; the home page is just `/es`. */
export function localizedPath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Points the current URL at the same page in another language (unknown paths go to that home). */
export function switchLocale(pathname: string, from: Locale, to: Locale): string {
  const prefix = `/${from}`;
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return `/${to}${pathname.slice(prefix.length)}`;
  }
  return `/${to}`;
}
