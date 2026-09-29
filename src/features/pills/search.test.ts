import { createJsonContentRepository } from '@/content/json-source';
import { filterPills } from './search';

const pills = createJsonContentRepository('es').getPills();

describe('filterPills', () => {
  it('returns all pills for a blank query', () => {
    expect(filterPills(pills, '   ')).toEqual(pills);
  });

  it('matches tags and ignores accents', () => {
    expect(filterPills(pills, 'docker').map((p) => p.slug)).toContain('docker-multistage-java');
    expect(filterPills(pills, 'cache de dependencias').length).toBeGreaterThan(0);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterPills(pills, 'zzzz-no-match')).toEqual([]);
  });
});
