export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 tags used for `Intl` formatting. */
export const INTL_LOCALE: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Resolves the initial locale: saved preference, then browser language, then the default. */
export function detectInitialLocale(storageKey: string): Locale {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall through to detection.
  }

  const preferred = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  const match = preferred.map((tag) => tag.slice(0, 2).toLowerCase()).find(isLocale);
  return match ?? DEFAULT_LOCALE;
}
