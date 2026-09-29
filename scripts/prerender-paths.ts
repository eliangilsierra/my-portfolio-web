// Written to run both under Node directly and under the React Router config loader,
// so relative imports carry explicit extensions.
import pills from '../src/content/data/pills.json' with { type: 'json' };
import projects from '../src/content/data/projects.json' with { type: 'json' };
import { PATHS, localizedPath } from '../src/config/routes.ts';
import { LOCALES } from '../src/domain/locale.ts';

/**
 * Every URL that is rendered to static HTML at build time:
 * the language chooser at `/`, plus each page in each language.
 */
export function getPrerenderPaths(): string[] {
  const perLocale = [
    PATHS.home,
    PATHS.projects,
    ...projects.map((project) => PATHS.project(project.slug)),
    PATHS.pills,
    ...pills.map((pill) => PATHS.pill(pill.slug)),
    PATHS.about,
    PATHS.contact,
  ];

  return [
    '/',
    ...LOCALES.flatMap((locale) => perLocale.map((path) => localizedPath(locale, path))),
  ];
}
