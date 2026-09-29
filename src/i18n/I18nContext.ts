import { createContext } from 'react';
import type { Locale } from '@/domain/locale';
import type { Dictionary } from './dictionaries';

export interface I18nContextValue {
  /** The active locale. It comes from the URL, which is the single source of truth. */
  locale: Locale;
  /** Translated UI strings for the active locale. */
  t: Dictionary;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
