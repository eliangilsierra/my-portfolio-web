import type { RouteConfigEntry } from '@react-router/dev/routes';
import { matchRoutes, type RouteObject } from 'react-router';
import { getPrerenderPaths } from '../../scripts/prerender-paths';
import routeConfig from './routes';

function toMatchable(entries: readonly RouteConfigEntry[]): RouteObject[] {
  return entries.map((entry) => {
    const common = { id: entry.id, path: entry.path };
    return entry.index
      ? { ...common, index: true }
      : { ...common, children: entry.children ? toMatchable(entry.children) : undefined };
  });
}

describe('route table', () => {
  const routes = toMatchable(routeConfig);

  it('matches every path that is prerendered, so no page is built without a route', () => {
    const unmatched = getPrerenderPaths().filter((path) => !matchRoutes(routes, path));

    expect(unmatched).toEqual([]);
  });

  it('prerenders each page once', () => {
    const paths = getPrerenderPaths();

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('covers the language chooser, both languages and every page and content slug', () => {
    const paths = getPrerenderPaths();

    expect(paths).toContain('/');
    for (const locale of ['es', 'en']) {
      expect(paths).toEqual(
        expect.arrayContaining([
          `/${locale}`,
          `/${locale}/projects`,
          `/${locale}/projects/sivia-visual-inspection`,
          `/${locale}/pills`,
          `/${locale}/pills/flyway-idempotent-inserts`,
          `/${locale}/about`,
          `/${locale}/contact`,
        ]),
      );
    }
  });

  it('does not prerender paths without a language prefix, except the root', () => {
    const stray = getPrerenderPaths().filter(
      (path) => path !== '/' && !path.startsWith('/es') && !path.startsWith('/en'),
    );

    expect(stray).toEqual([]);
  });
});
