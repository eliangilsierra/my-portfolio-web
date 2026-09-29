import { useMemo, type ReactNode } from 'react';
import type { Locale } from '@/domain/locale';
import { dictionaries } from './dictionaries';
import { I18nContext, type I18nContextValue } from './I18nContext';

interface I18nProviderProps {
  children: ReactNode;
  locale: Locale;
}

/** Provides the dictionary for a locale. The locale itself is decided by the URL, not by state. */
export function I18nProvider({ children, locale }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => ({ locale, t: dictionaries[locale] }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
