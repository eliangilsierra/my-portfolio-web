import { detectPreferredLocale, saveLocalePreference } from './preference';

const KEY = 'locale';

function browserLanguages(languages: string[], language = languages[0] ?? 'en-US') {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(language);
}

describe('detectPreferredLocale', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prefers a saved locale over the browser language', () => {
    window.localStorage.setItem(KEY, 'es');
    browserLanguages(['en-US']);

    expect(detectPreferredLocale()).toBe('es');
  });

  it('ignores a saved value that is not a supported locale', () => {
    window.localStorage.setItem(KEY, 'klingon');
    browserLanguages(['es-MX']);

    expect(detectPreferredLocale()).toBe('es');
  });

  it('uses the first supported browser language, whatever the region', () => {
    browserLanguages(['fr-FR', 'es-AR', 'en-GB']);

    expect(detectPreferredLocale()).toBe('es');
  });

  it('falls back to the default when no browser language is supported', () => {
    browserLanguages(['fr-FR', 'de']);

    expect(detectPreferredLocale()).toBe('en');
  });

  it('uses navigator.language when the languages list is empty', () => {
    browserLanguages([], 'es-ES');

    expect(detectPreferredLocale()).toBe('es');
  });

  it('survives storage being unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    browserLanguages(['es']);

    expect(detectPreferredLocale()).toBe('es');
  });
});

describe('saveLocalePreference', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores the choice for the next visit', () => {
    saveLocalePreference('es');

    expect(window.localStorage.getItem(KEY)).toBe('es');
  });

  it('does not throw when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => {
      saveLocalePreference('es');
    }).not.toThrow();
  });
});
