import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { SITE } from '@/config/site';
import { ContentProvider } from '@/content/ContentProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locale';

interface AppProvidersProps {
  children: ReactNode;
  /** Forces a locale instead of detecting it (used by tests). */
  initialLocale?: Locale;
}

export function AppProviders({ children, initialLocale }: AppProvidersProps) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey={SITE.themeStorageKey}
        disableTransitionOnChange
      >
        <MotionConfig reducedMotion="user">
          <ContentProvider>{children}</ContentProvider>
        </MotionConfig>
      </ThemeProvider>
    </I18nProvider>
  );
}
