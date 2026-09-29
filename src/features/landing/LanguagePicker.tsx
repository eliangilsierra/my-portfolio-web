import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { CropMarks } from '@/components/blueprint/CropMarks';
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
    <main className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />
      <div className="sheet">
        <h1
          className={
            variant === 'welcome'
              ? 'reveal mb-12 text-headline font-semibold md:mb-20'
              : 'reveal mb-12 font-heading text-[clamp(6rem,24vw,18rem)] leading-[0.8] font-bold tracking-[-0.06em] outline-text md:mb-20'
          }
        >
          {variant === 'welcome' ? SITE.brandName : dictionaries.en.notFound.code}
        </h1>

        <div className="grid border border-border-strong md:grid-cols-2 [&>*+*]:border-t md:[&>*+*]:border-t-0 md:[&>*+*]:border-l">
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
              <section
                key={locale}
                lang={locale}
                className="relative flex flex-col gap-6 border-border bg-background/80 p-6 md:p-10"
              >
                <p aria-hidden="true" className="annotation text-brand">
                  {locale}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">{copy.title}</h2>
                <p className="text-muted-foreground">{copy.description}</p>
                <Link
                  to={localizedPath(locale, PATHS.home)}
                  hrefLang={locale}
                  onClick={() => {
                    saveLocalePreference(locale);
                  }}
                  className="group mt-auto inline-flex h-12 items-center justify-between gap-4 border-t border-border pt-4 annotation focus-ring hover:text-brand"
                >
                  {copy.action}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </section>
            );
          })}
        </div>
      </div>
      <CropMarks className="m-3" />
    </main>
  );
}
