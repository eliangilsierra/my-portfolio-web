import { createJsonContentRepository } from '@/content/json-source';
import { filterProjects } from './search';

const projects = createJsonContentRepository('en').getProjects();

describe('filterProjects', () => {
  it('returns everything for an empty query and the "all" type', () => {
    expect(filterProjects(projects, '', 'all')).toEqual(projects);
  });

  it('filters by type', () => {
    const result = filterProjects(projects, '', 'ml');

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((project) => project.type === 'ml')).toBe(true);
  });

  it('matches title, excerpt and technologies case-insensitively', () => {
    expect(filterProjects(projects, 'pytorch').map((p) => p.slug)).toContain(
      'crop-disease-classifier',
    );
    expect(filterProjects(projects, 'STORYBOOK').map((p) => p.slug)).toContain(
      'atlas-ui-component-library',
    );
  });

  it('combines query and type', () => {
    expect(filterProjects(projects, 'pytorch', 'frontend')).toEqual([]);
  });
});
