import { index, route, type RouteConfig } from '@react-router/dev/routes';

/**
 * Route table. Paths are relative to the deployment base path.
 *
 *   /                      language chooser (redirects to the visitor's language in the browser)
 *   /:lang                 every page lives under its language: /es, /en/projects, ...
 *   /:lang/...             pages, and a not-found page for unknown addresses
 *
 * An address whose first segment is not a supported language still matches `:lang`; the layout
 * detects that and shows the bilingual not-found page.
 */
export default [
  index('routes/root-redirect.tsx'),
  route(':lang', 'routes/locale-layout.tsx', [
    index('routes/home.tsx'),
    route('projects', 'routes/projects.tsx'),
    route('projects/:slug', 'routes/project-detail.tsx'),
    route('pills', 'routes/pills.tsx'),
    route('pills/:slug', 'routes/pill-detail.tsx'),
    route('about', 'routes/about.tsx'),
    route('contact', 'routes/contact.tsx'),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
