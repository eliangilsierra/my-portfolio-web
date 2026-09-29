import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { PATHS, localizedPath } from '@/config/routes';
import { SITE } from '@/config/site';
import { LOCALES } from '@/domain/locale';
import { dictionaries } from '@/i18n/dictionaries';
import { saveLocalePreference } from '@/i18n/preference';

type Variant = 'welcome' | 'not-found';

interface LanguagePickerProps {
  variant: Variant;
}

/**
 * A page that speaks every supported language at once, for the moments when the visitor's language
 * is not known yet: the site root and addresses that do not start with a language.
 * It is plain HTML links, so it works before (or without) JavaScript.
 */
export function LanguagePicker({ variant }: LanguagePickerProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-8 text-center">
        <h1 className="gradient-text font-heading text-5xl font-bold">
          {variant === 'welcome' ? SITE.brandName : dictionaries.en.notFound.code}
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {LOCALES.map((locale) => {
            const t = dictionaries[locale];
            const copy =
              variant === 'welcome'
                ? {
                    title: t.landing.welcome,
                    description: t.landing.chooseLanguage,
                    action: t.landing.continueIn,
                  }
                : {
                    title: t.notFound.title,
                    description: t.notFound.description,
                    action: t.notFound.backHome,
                  };

            return (
              <section key={locale} lang={locale} className="space-y-4 rounded-2xl p-6 glass">
                <h2 className="font-heading text-xl font-semibold">{copy.title}</h2>
                <p className="text-sm text-muted-foreground">{copy.description}</p>
                <Button asChild>
                  <Link
                    to={localizedPath(locale, PATHS.home)}
                    hrefLang={locale}
                    onClick={() => {
                      saveLocalePreference(locale);
                    }}
                  >
                    {copy.action}
                  </Link>
                </Button>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
