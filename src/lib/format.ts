import { INTL_LOCALE, type Locale } from '@/i18n/locale';

/** Formats an ISO `YYYY-MM-DD` date. Parsed as UTC so the day never shifts with the viewer's timezone. */
export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
