import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import soraLatin from '@fontsource-variable/sora/files/sora-latin-wght-normal.woff2?url';
import { useEffect, type ReactNode } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
  useRouteError,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';
import { ErrorFallback } from '@/components/ErrorFallback';
import { SITE } from '@/config/site';
import { I18nProvider } from '@/i18n/I18nProvider';
import { logger } from '@/lib/logger';
import { createThemeInitScript } from '@/theme/theme';
import { RootProviders } from './RootProviders';
import { FAVICON_HREF, localeFromParams } from './seo';
import '@/index.css';

const THEME_INIT_SCRIPT = createThemeInitScript(SITE.themeStorageKey);

export const links: LinksFunction = () => [
  { rel: 'icon', href: FAVICON_HREF },
  // Fonts used above the fold; everything else loads on demand.
  { rel: 'preload', href: interLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: soraLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
];

// Fallback for the pages that do not define their own metadata (leaf routes always win).
export const meta: MetaFunction = () => [{ title: SITE.brandName }];

/* v8 ignore start -- the document shell needs the framework's server context; it is exercised by the
   e2e tests in a real browser and checked on the built HTML by scripts/verify-build.mjs */
/** The HTML document. It is also used to render error and loading states. */
export function Layout({ children }: { children: ReactNode }) {
  const locale = localeFromParams(useParams());

  return (
    // The theme script changes <html> before React hydrates it, so its attributes may differ.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        {/* Applies the saved or system theme before first paint to avoid a light flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/* v8 ignore stop */

export default function Root() {
  return (
    <RootProviders>
      <Outlet />
    </RootProviders>
  );
}

/** Shown in the static fallback page while the app loads for an address that was not prerendered. */
export function HydrateFallback() {
  return (
    <div role="status" aria-busy="true" className="min-h-screen">
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const locale = localeFromParams(useParams());

  useEffect(() => {
    logger.error('Unhandled route error', error);
  }, [error]);

  return (
    <I18nProvider locale={locale}>
      <ErrorFallback />
    </I18nProvider>
  );
}
