import type { MetaDescriptor } from 'react-router';
import type * as SeoModule from './seo';
import { PATHS } from '@/config/routes';

type Loaded = typeof SeoModule;

/** SITE_URL is read when the module loads, so each scenario loads a fresh copy. */
async function loadSeo(siteUrl?: string): Promise<Loaded> {
  vi.resetModules();
  vi.unstubAllEnvs();
  if (siteUrl) vi.stubEnv('VITE_SITE_URL', siteUrl);
  return import('./seo');
}

function find(tags: MetaDescriptor[], match: Record<string, string>) {
  return tags.find((tag) =>
    Object.entries(match).every(([key, value]) => (tag as Record<string, unknown>)[key] === value),
  );
}

function all(tags: MetaDescriptor[], match: Record<string, string>) {
  return tags.filter((tag) =>
    Object.entries(match).every(([key, value]) => (tag as Record<string, unknown>)[key] === value),
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('localeFromParams', () => {
  it('reads a supported language and defaults otherwise', async () => {
    const { localeFromParams } = await loadSeo();

    expect(localeFromParams({ lang: 'es' })).toBe('es');
    expect(localeFromParams({ lang: 'en' })).toBe('en');
    expect(localeFromParams({ lang: 'fr' })).toBe('en');
    expect(localeFromParams({})).toBe('en');
  });
});

describe('pageMeta without a site URL', () => {
  it('still provides title, description and social basics', async () => {
    const { pageMeta } = await loadSeo();

    const tags = pageMeta({
      locale: 'es',
      path: PATHS.projects,
      title: 'Proyectos',
      description: 'Trabajo seleccionado.',
    });

    expect(find(tags, { title: 'Proyectos · My Portfolio' })).toBeDefined();
    expect(find(tags, { name: 'description' })).toMatchObject({ content: 'Trabajo seleccionado.' });
    expect(find(tags, { property: 'og:locale' })).toMatchObject({ content: 'es_ES' });
    expect(find(tags, { property: 'og:locale:alternate' })).toMatchObject({ content: 'en_US' });
    expect(find(tags, { name: 'twitter:card' })).toMatchObject({ content: 'summary' });
  });

  it('omits every tag that needs an absolute URL', async () => {
    const { pageMeta } = await loadSeo();

    const tags = pageMeta({ locale: 'en', path: PATHS.home, title: 'Home', description: 'd' });

    expect(find(tags, { rel: 'canonical' })).toBeUndefined();
    expect(all(tags, { rel: 'alternate' })).toHaveLength(0);
    expect(find(tags, { property: 'og:url' })).toBeUndefined();
    expect(find(tags, { property: 'og:image' })).toBeUndefined();
  });

  it('can keep a page out of search results', async () => {
    const { pageMeta } = await loadSeo();

    const tags = pageMeta({
      locale: 'en',
      path: PATHS.home,
      title: 'Not found',
      description: 'd',
      noIndex: true,
    });

    expect(find(tags, { name: 'robots' })).toMatchObject({ content: 'noindex' });
  });
});

describe('pageMeta with a site URL', () => {
  it('adds canonical, hreflang alternates and social image using the base path', async () => {
    const { pageMeta } = await loadSeo('https://user.github.io/my-portfolio-web/');

    const tags = pageMeta({
      locale: 'es',
      path: PATHS.project('sivia'),
      title: 'SIVIA',
      description: 'd',
    });

    expect(find(tags, { rel: 'canonical' })).toMatchObject({
      href: 'https://user.github.io/my-portfolio-web/es/projects/sivia/',
    });
    expect(
      all(tags, { rel: 'alternate' }).map((tag) => (tag as { hrefLang: string }).hrefLang),
    ).toEqual(['es', 'en', 'x-default']);
    expect(find(tags, { rel: 'alternate', hrefLang: 'en' })).toMatchObject({
      href: 'https://user.github.io/my-portfolio-web/en/projects/sivia/',
    });
    expect(find(tags, { rel: 'alternate', hrefLang: 'x-default' })).toMatchObject({
      href: 'https://user.github.io/my-portfolio-web/en/projects/sivia/',
    });
    expect(find(tags, { property: 'og:url' })).toMatchObject({
      content: 'https://user.github.io/my-portfolio-web/es/projects/sivia/',
    });
    expect(find(tags, { property: 'og:image' })).toMatchObject({
      content: 'https://user.github.io/my-portfolio-web/og-image.png',
    });
    expect(find(tags, { name: 'twitter:card' })).toMatchObject({ content: 'summary_large_image' });
  });

  it('gives the home page a clean language URL', async () => {
    const { pageMeta } = await loadSeo('https://example.com');

    const tags = pageMeta({ locale: 'en', path: PATHS.home, title: 'Home', description: 'd' });

    expect(find(tags, { rel: 'canonical' })).toMatchObject({ href: 'https://example.com/en/' });
  });
});

describe('personStructuredData', () => {
  const person = {
    name: 'Ada Lovelace',
    links: { github: 'https://github.com/ada', linkedin: 'https://linkedin.com/in/ada' },
  };

  it('describes the person and links their profiles', async () => {
    const { personStructuredData } = await loadSeo('https://example.com/site');

    expect(personStructuredData(person, 'en')).toEqual({
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ada Lovelace',
        url: 'https://example.com/site/en/',
        sameAs: ['https://github.com/ada', 'https://linkedin.com/in/ada'],
      },
    });
  });

  it('leaves out the URL when the site address is unknown', async () => {
    const { personStructuredData } = await loadSeo();

    const descriptor = personStructuredData(person, 'en') as Record<string, unknown>;
    const data = descriptor['script:ld+json'] as Record<string, unknown>;

    expect(data).not.toHaveProperty('url');
  });
});
