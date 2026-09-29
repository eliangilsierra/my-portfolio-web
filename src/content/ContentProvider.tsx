import { useMemo, type ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { ContentContext } from './ContentContext';
import { createJsonContentRepository } from './json-source';
import type { ContentRepository } from './repository';

interface ContentProviderProps {
  children: ReactNode;
  /** Overrides the JSON-backed repository (used by tests). */
  repository?: ContentRepository;
}

/** Exposes portfolio content resolved for the active locale. */
export function ContentProvider({ children, repository }: ContentProviderProps) {
  const { locale } = useI18n();
  const value = useMemo(
    () => repository ?? createJsonContentRepository(locale),
    [repository, locale],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
