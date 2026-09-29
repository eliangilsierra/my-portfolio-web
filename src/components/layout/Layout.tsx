import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
}

export const MAIN_CONTENT_ID = 'main-content';

export function Layout({ children }: LayoutProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg focus-ring"
      >
        {t.a11y.skipToContent}
      </a>
      <ScrollToTop />
      <Header />
      <main id={MAIN_CONTENT_ID} className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
