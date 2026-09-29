import { useEffect } from 'react';
import { SITE } from '@/config/site';

interface DocumentMeta {
  title: string;
  description?: string;
}

/** Keeps the tab title and meta description in sync with the current page (SPA routes share one HTML file). */
export function useDocumentMeta({ title, description }: DocumentMeta): void {
  useEffect(() => {
    document.title = `${title} · ${SITE.brandName}`;

    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
