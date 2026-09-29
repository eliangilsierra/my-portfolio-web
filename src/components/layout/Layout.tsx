import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

const MAIN_CONTENT_ID = 'main-content';

export function Layout({ children }: LayoutProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus-ring focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg"
      >
        {t.a11y.skipToContent}
      </a>
      <Header />
      <main id={MAIN_CONTENT_ID} className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
