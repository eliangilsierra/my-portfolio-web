import { useEffect, type ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ContentProvider } from '@/content/ContentProvider';
import type { Locale } from '@/domain/locale';
import { I18nProvider } from '@/i18n/I18nProvider';

interface LocaleShellProps {
  locale: Locale;
  children: ReactNode;
}

/** Everything that depends on the language: dictionary, content and the page frame. */
export function LocaleShell({ locale, children }: LocaleShellProps) {
  // Prerendered pages already carry the right <html lang>. This covers the pages that were not
  // prerendered: they start from the generic fallback document and learn their language here.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nProvider locale={locale}>
      <ContentProvider>
        <Layout>{children}</Layout>
      </ContentProvider>
    </I18nProvider>
  );
}
