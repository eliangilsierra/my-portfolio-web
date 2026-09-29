import { DEFAULT_LOCALE, isLocale, type Locale } from '@/domain/locale';
import { SITE } from '@/config/site';

/** Remembers the visitor's language so the site root can send them to it next time. */
export function saveLocalePreference(locale: Locale): void {
  try {
    window.localStorage.setItem(SITE.localeStorageKey, locale);
  } catch {
    // Persisting the preference is best effort.
  }
}

/** Saved preference, then the browser languages, then the default. Browser-only. */
export function detectPreferredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(SITE.localeStorageKey);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall through to detection.
  }

  const languages = window.navigator.languages.length
    ? window.navigator.languages
    : [window.navigator.language];
  const match = languages.map((tag) => tag.slice(0, 2).toLowerCase()).find(isLocale);
  return match ?? DEFAULT_LOCALE;
}
