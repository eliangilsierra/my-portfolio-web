import type { MetaDescriptor, MetaFunction } from 'react-router';
import { meta as aboutMeta } from './routes/about';
import { meta as contactMeta } from './routes/contact';
import { meta as homeMeta } from './routes/home';
import { meta as notFoundMeta } from './routes/not-found';
import { meta as pillDetailMeta } from './routes/pill-detail';
import { meta as pillsMeta } from './routes/pills';
import { meta as projectDetailMeta } from './routes/project-detail';
import { meta as projectsMeta } from './routes/projects';
import { clientLoader, meta as rootRedirectMeta } from './routes/root-redirect';
import { meta as rootMeta } from './root';

/** Route `meta` functions only read `params`; the framework supplies the rest at build time. */
function metaOf(fn: MetaFunction, params: Record<string, string>): MetaDescriptor[] {
  return fn({ params } as unknown as Parameters<MetaFunction>[0]) ?? [];
}

const has = (tags: MetaDescriptor[], expected: Record<string, unknown>) =>
  tags.some((tag) =>
    Object.entries(expected).every(
      ([key, value]) => (tag as Record<string, unknown>)[key] === value,
    ),
  );

describe('route metadata', () => {
  it.each([
    ['home', homeMeta, {}, 'Desarrollador full-stack · My Portfolio'],
    ['projects', projectsMeta, {}, 'Proyectos · My Portfolio'],
    ['pills', pillsMeta, {}, 'Píldoras · My Portfolio'],
    ['about', aboutMeta, {}, 'Sobre mí · My Portfolio'],
    ['contact', contactMeta, {}, 'Contacto · My Portfolio'],
  ] as const)('%s speaks the language of the URL', (_name, meta, extra, title) => {
    const tags = metaOf(meta, { lang: 'es', ...extra });

    expect(has(tags, { title })).toBe(true);
    expect(tags.some((tag) => 'name' in tag && tag.name === 'description')).toBe(true);
    expect(has(tags, { property: 'og:locale', content: 'es_ES' })).toBe(true);
  });

  it('falls back to English when the URL has no supported language', () => {
    const tags = metaOf(projectsMeta, { lang: 'fr' });

    expect(has(tags, { title: 'Projects · My Portfolio' })).toBe(true);
  });

  it('describes the person on the home page for search engines', () => {
    const tags = metaOf(homeMeta, { lang: 'en' });
    const structured = tags.find((tag) => 'script:ld+json' in tag) as Record<string, unknown>;

    expect(structured['script:ld+json']).toMatchObject({ '@type': 'Person', name: 'Your Name' });
  });

  describe('detail pages', () => {
    it('use the project or pill as title and description', () => {
      const project = metaOf(projectDetailMeta, { lang: 'es', slug: 'sivia-visual-inspection' });
      const pill = metaOf(pillDetailMeta, { lang: 'en', slug: 'flyway-idempotent-inserts' });

      expect(has(project, { title: 'SIVIA — Inspección Visual con IA · My Portfolio' })).toBe(true);
      expect(has(pill, { title: 'Flyway: patterns for idempotent inserts · My Portfolio' })).toBe(
        true,
      );
      expect(has(project, { name: 'robots' })).toBe(false);
    });

    it.each([
      ['project', projectDetailMeta],
      ['pill', pillDetailMeta],
    ] as const)('keep an unknown %s out of search results', (_kind, meta) => {
      const tags = metaOf(meta, { lang: 'en', slug: 'does-not-exist' });

      expect(has(tags, { title: 'Page not found · My Portfolio' })).toBe(true);
      expect(has(tags, { name: 'robots', content: 'noindex' })).toBe(true);
    });
  });

  it('keeps not-found pages out of search results', () => {
    expect(has(metaOf(notFoundMeta, { lang: 'es' }), { name: 'robots', content: 'noindex' })).toBe(
      true,
    );
  });

  it('provides a generic title for pages that define none', () => {
    expect(has(metaOf(rootMeta, {}), { title: 'My Portfolio' })).toBe(true);
  });
});

describe('site root', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has a title and description of its own', () => {
    const tags = metaOf(rootRedirectMeta, {});

    expect(has(tags, { title: 'My Portfolio' })).toBe(true);
    expect(tags.some((tag) => 'name' in tag && tag.name === 'description')).toBe(true);
  });

  it.each([
    [['es-MX', 'en'], '/es'],
    [['en-US'], '/en'],
    [['fr-FR'], '/en'],
  ])('redirects a browser preferring %j to %s', (languages, destination) => {
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);

    const response = clientLoader();

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(destination);
  });
});
