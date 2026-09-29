import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SITE } from '@/config/site';
import { dictionaries } from './dictionaries';
import { I18nContext, type I18nContextValue } from './I18nContext';
import { detectInitialLocale, type Locale } from './locale';

interface I18nProviderProps {
  children: ReactNode;
  /** Forces a locale (used by tests); otherwise detected from storage and the browser. */
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    () => initialLocale ?? detectInitialLocale(SITE.localeStorageKey),
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(SITE.localeStorageKey, next);
    } catch {
      // Persisting the preference is best effort.
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
