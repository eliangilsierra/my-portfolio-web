/** Languages the site is published in. The order is the order shown to visitors. */
export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** The language used when nothing better is known (unsupported browser language, unknown URL). */
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 tags used for `Intl` formatting and Open Graph locales. */
export const INTL_LOCALE: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
};

/** Each language's name in that language, for language switchers. */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
