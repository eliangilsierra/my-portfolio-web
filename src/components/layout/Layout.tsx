import type { ReactNode } from 'react';
import { MotionProvider } from '@/components/motion/MotionProvider';
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
    <MotionProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only focus-ring focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-3 focus:annotation focus:text-background"
        >
          {t.a11y.skipToContent}
        </a>
        <Header />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
