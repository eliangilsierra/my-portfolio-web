import { redirect, type MetaFunction } from 'react-router';
import { PATHS, localizedPath } from '@/config/routes';
import { SITE } from '@/config/site';
import { LanguagePicker } from '@/features/landing';
import { dictionaries } from '@/i18n/dictionaries';
import { detectPreferredLocale } from '@/i18n/preference';
import { SITE_URL } from '@/config/env';
import { DEFAULT_LOCALE, LOCALES } from '@/domain/locale';

export const meta: MetaFunction = () => {
  const description = dictionaries[DEFAULT_LOCALE].meta.home.description;

  return [
    { title: SITE.brandName },
    { name: 'description', content: description },
    ...(SITE_URL
      ? [
          { tagName: 'link', rel: 'canonical', href: `${SITE_URL}/` },
          ...LOCALES.map((locale) => ({
            tagName: 'link',
            rel: 'alternate',
            hrefLang: locale,
            href: `${SITE_URL}${localizedPath(locale, PATHS.home)}/`,
          })),
          {
            tagName: 'link',
            rel: 'alternate',
            hrefLang: 'x-default',
            href: `${SITE_URL}/`,
          },
        ]
      : []),
  ];
};

/**
 * In the browser, send the visitor to their language. There is no server to do this, so it happens
 * here, after the static page has been delivered.
 */
export function clientLoader() {
  return redirect(localizedPath(detectPreferredLocale(), PATHS.home));
}

// Rendered into the static HTML (and shown until the redirect happens): a page that works with no JS.
export function HydrateFallback() {
  return <LanguagePicker variant="welcome" />;
}

export default function RootRedirect() {
  return <LanguagePicker variant="welcome" />;
}
