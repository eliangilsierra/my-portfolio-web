import { useMemo } from 'react';
import { PATHS, localizedPath } from '@/config/routes';
import { useI18n } from './useI18n';

/** URLs for the active locale, ready to pass to `<Link to>`. */
export function useRoutes() {
  const { locale } = useI18n();

  return useMemo(
    () => ({
      home: localizedPath(locale, PATHS.home),
      projects: localizedPath(locale, PATHS.projects),
      project: (slug: string) => localizedPath(locale, PATHS.project(slug)),
      pills: localizedPath(locale, PATHS.pills),
      pill: (slug: string) => localizedPath(locale, PATHS.pill(slug)),
      about: localizedPath(locale, PATHS.about),
      contact: localizedPath(locale, PATHS.contact),
    }),
    [locale],
  );
}
