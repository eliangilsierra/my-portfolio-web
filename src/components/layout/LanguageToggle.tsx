import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOCALES, LOCALE_NAMES } from '@/i18n/locale';
import { useI18n } from '@/i18n/useI18n';

/** Switches to the next supported locale; with two locales this is a simple toggle. */
export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length] ?? locale;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      className="focus-ring gap-2 font-mono text-xs uppercase"
      aria-label={`${t.a11y.changeLanguage}: ${LOCALE_NAMES[next]}`}
      lang={next}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {next}
    </Button>
  );
}
