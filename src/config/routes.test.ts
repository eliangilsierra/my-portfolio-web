import { PATHS, localizedPath, switchLocale } from './routes';

describe('localizedPath', () => {
  it('prefixes paths with the locale and keeps the home page clean', () => {
    expect(localizedPath('es', PATHS.home)).toBe('/es');
    expect(localizedPath('en', PATHS.projects)).toBe('/en/projects');
    expect(localizedPath('es', PATHS.project('my-project'))).toBe('/es/projects/my-project');
    expect(localizedPath('en', PATHS.pill('a-pill'))).toBe('/en/pills/a-pill');
  });
});

describe('switchLocale', () => {
  it('swaps the leading locale segment and keeps the rest', () => {
    expect(switchLocale('/es/projects/sivia', 'es', 'en')).toBe('/en/projects/sivia');
    expect(switchLocale('/en', 'en', 'es')).toBe('/es');
    expect(switchLocale('/es/', 'es', 'en')).toBe('/en/');
  });

  it('does not treat a longer first segment as the locale', () => {
    expect(switchLocale('/espanol/x', 'es', 'en')).toBe('/en');
  });

  it('falls back to the other locale home for unrelated paths', () => {
    expect(switchLocale('/whatever', 'es', 'en')).toBe('/en');
  });
});
