import { createContext } from 'react';
import type { Dictionary } from './dictionaries';
import type { Locale } from './locale';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translated UI strings for the active locale. */
  t: Dictionary;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
