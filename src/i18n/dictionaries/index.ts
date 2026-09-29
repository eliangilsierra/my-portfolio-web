import type { Locale } from '../locale';
import { en, type Dictionary } from './en';
import { es } from './es';

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, es };
