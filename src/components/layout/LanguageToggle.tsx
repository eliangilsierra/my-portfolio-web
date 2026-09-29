import { Link, useLocation } from 'react-router';
import { switchLocale } from '@/config/routes';
import { LOCALES, LOCALE_NAMES } from '@/domain/locale';
import { saveLocalePreference } from '@/i18n/preference';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/lib/utils';

/**
 * Links to the same page in the next language. It is a real link (the language is part of the URL),
 * so it works without JavaScript, can be opened in a new tab and is crawlable.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();
  const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length] ?? locale;

  return (
    <Link
      to={{ pathname: switchLocale(pathname, locale, next), search, hash }}
      hrefLang={next}
      lang={next}
      viewTransition
      onClick={() => {
        saveLocalePreference(next);
      }}
      aria-label={`${t.a11y.changeLanguage}: ${LOCALE_NAMES[next]}`}
      className={cn(
        'group inline-flex h-11 items-center gap-1.5 rounded-sm px-3 annotation focus-ring transition-colors hover:bg-secondary',
        className,
      )}
    >
      <span className="text-foreground">{locale}</span>
      <span aria-hidden="true" className="text-muted-foreground">
        /
      </span>
      <span className="text-muted-foreground transition-colors group-hover:text-brand">{next}</span>
    </Link>
  );
}
