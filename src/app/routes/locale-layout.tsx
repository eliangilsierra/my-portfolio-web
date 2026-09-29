import { Outlet, isRouteErrorResponse, useParams, useRouteError } from 'react-router';
import { NotFoundPage } from '@/features/not-found';
import { LanguagePicker } from '@/features/landing';
import { ErrorFallback } from '@/components/ErrorFallback';
import { isLocale } from '@/domain/locale';
import { LocaleShell } from '../LocaleShell';
import { localeFromParams } from '../seo';

/**
 * Every page lives under `/:lang`. That segment is the single source of truth for the language:
 * it selects the dictionary and the content, and it is what search engines see.
 */
export default function LocaleLayout() {
  const { lang } = useParams();

  // `/whatever/...` also matches `:lang`. Without a supported language there is nothing to show
  // but a page that speaks all of them.
  if (!isLocale(lang)) {
    return <LanguagePicker variant="not-found" />;
  }

  return (
    <LocaleShell locale={lang}>
      <Outlet />
    </LocaleShell>
  );
}

/** Errors inside a language keep the site frame (header, footer) and speak that language. */
export function ErrorBoundary() {
  const error = useRouteError();
  const locale = localeFromParams(useParams());

  return (
    <LocaleShell locale={locale}>
      {isRouteErrorResponse(error) && error.status === 404 ? <NotFoundPage /> : <ErrorFallback />}
    </LocaleShell>
  );
}
