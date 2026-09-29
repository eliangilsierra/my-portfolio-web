import { createJsonContentRepository, rawContent } from './json-source';
import { LOCALES } from '@/domain/locale';

describe.each(LOCALES)('content repository (%s)', (locale) => {
  const repository = createJsonContentRepository(locale);

  it('exposes every project and pill with translated text', () => {
    expect(repository.getProjects()).toHaveLength(rawContent.projects.length);
    expect(repository.getPills()).toHaveLength(rawContent.pills.length);
    for (const project of repository.getProjects()) {
      expect(project.title).not.toBe('');
      expect(project.gallery).toHaveLength(
        rawContent.projects.find((raw) => raw.slug === project.slug)!.gallery.length,
      );
    }
  });

  it('orders projects by year and pills by date, newest first', () => {
    const years = repository.getProjects().map((project) => project.year);
    const dates = repository.getPills().map((pill) => pill.date);

    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('limits featured projects and only returns featured ones', () => {
    const featured = repository.getFeaturedProjects(2);

    expect(featured).toHaveLength(2);
    expect(featured.every((project) => project.featured)).toBe(true);
  });

  it('finds items by slug and returns undefined for unknown slugs', () => {
    const [first] = repository.getPills();

    expect(repository.getPillBySlug(first!.slug)).toBe(first);
    expect(repository.getPillBySlug('missing')).toBeUndefined();
    expect(repository.getProjectBySlug('missing')).toBeUndefined();
  });

  it('resolves neighbouring pills', () => {
    const pills = repository.getPills();

    expect(repository.getAdjacentPills(pills[0]!.slug)).toEqual({
      newer: undefined,
      older: pills[1],
    });
    expect(repository.getAdjacentPills(pills.at(-1)!.slug).older).toBeUndefined();
    expect(repository.getAdjacentPills('missing')).toEqual({});
  });
});

describe('content repository localisation', () => {
  it('returns different text per locale but identical structural data', () => {
    const en = createJsonContentRepository('en');
    const es = createJsonContentRepository('es');

    expect(en.getAbout().bio).not.toBe(es.getAbout().bio);
    expect(en.getProjects().map((p) => [p.slug, p.year, p.type])).toEqual(
      es.getProjects().map((p) => [p.slug, p.year, p.type]),
    );
  });
});
