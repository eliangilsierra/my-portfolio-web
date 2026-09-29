import type { MetaDescriptor } from 'react-router';
import { SITE_URL, assetUrl } from '@/config/env';
import { PATHS, localizedPath } from '@/config/routes';
import { SITE } from '@/config/site';
import { DEFAULT_LOCALE, INTL_LOCALE, LOCALES, isLocale, type Locale } from '@/domain/locale';

/** The language a route is being rendered in, from its `:lang` URL segment. */
export function localeFromParams(params: { lang?: string }): Locale {
  return isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
}

/** Absolute URL of a site path. Pages are published as directories, hence the trailing slash. */
function absoluteUrl(path: string): string | undefined {
  if (!SITE_URL) return undefined;
  return `${SITE_URL}${path}${path.endsWith('/') ? '' : '/'}`;
}

const OG_IMAGE_PATH = 'og-image.png';

interface PageMetaOptions {
  locale: Locale;
  /** Locale-relative path, e.g. `PATHS.projects`. */
  path: string;
  title: string;
  description: string;
  /** Keep the page out of search results (used for not-found pages). */
  noIndex?: boolean;
}

/** Title, description, canonical, hreflang alternates and Open Graph/Twitter tags for a page. */
export function pageMeta({
  locale,
  path,
  title,
  description,
  noIndex = false,
}: PageMetaOptions): MetaDescriptor[] {
  const fullTitle = `${title} · ${SITE.brandName}`;
  const image = SITE_URL ? `${SITE_URL}/${OG_IMAGE_PATH}` : undefined;
  const canonical = absoluteUrl(localizedPath(locale, path));

  const tags: MetaDescriptor[] = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.brandName },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: INTL_LOCALE[locale].replace('-', '_') },
    ...LOCALES.filter((other) => other !== locale).map((other) => ({
      property: 'og:locale:alternate',
      content: INTL_LOCALE[other].replace('-', '_'),
    })),
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ];

  if (noIndex) tags.push({ name: 'robots', content: 'noindex' });

  if (canonical) {
    tags.push(
      { tagName: 'link', rel: 'canonical', href: canonical },
      { property: 'og:url', content: canonical },
    );

    // Each language points at all the others (and at itself), plus a default for everyone else.
    for (const alternate of LOCALES) {
      tags.push({
        tagName: 'link',
        rel: 'alternate',
        hrefLang: alternate,
        href: absoluteUrl(localizedPath(alternate, path)),
      });
    }
    tags.push({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: absoluteUrl(localizedPath(DEFAULT_LOCALE, path)),
    });
  }

  if (image) {
    tags.push({ property: 'og:image', content: image }, { name: 'twitter:image', content: image });
  }

  return tags;
}

/** schema.org description of the person the portfolio is about. */
export function personStructuredData(
  person: { name: string; links: { github: string; linkedin: string } },
  locale: Locale,
): MetaDescriptor {
  const url = absoluteUrl(localizedPath(locale, PATHS.home));

  return {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      ...(url ? { url } : {}),
      sameAs: [person.links.github, person.links.linkedin],
    },
  };
}

/** Where the favicon lives, honoring the deployment base path. */
export const FAVICON_HREF = assetUrl('favicon.ico');
