import { Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { switchLocale } from '@/config/routes';
import { LOCALES, LOCALE_NAMES } from '@/domain/locale';
import { saveLocalePreference } from '@/i18n/preference';
import { useI18n } from '@/i18n/useI18n';

/**
 * Links to the same page in the next language. It is a real link (the language is part of the URL),
 * so it works without JavaScript, can be opened in a new tab and is crawlable.
 */
export function LanguageToggle() {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();
  const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length] ?? locale;

  return (
    <Link
      to={{ pathname: switchLocale(pathname, locale, next), search, hash }}
      hrefLang={next}
      lang={next}
      onClick={() => {
        saveLocalePreference(next);
      }}
      aria-label={`${t.a11y.changeLanguage}: ${LOCALE_NAMES[next]}`}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 font-mono text-xs font-medium uppercase focus-ring transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Languages className="size-4" aria-hidden="true" />
      {next}
    </Link>
  );
}
