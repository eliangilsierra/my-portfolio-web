import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HEADER } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { SITE } from '@/config/site';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { key: 'home', path: ROUTES.home },
  { key: 'projects', path: ROUTES.projects },
  { key: 'pills', path: ROUTES.pills },
  { key: 'about', path: ROUTES.about },
  { key: 'contact', path: ROUTES.contact },
] as const;

function navLinkClassName(isActive: boolean, layout: 'desktop' | 'mobile'): string {
  return cn(
    'rounded-lg px-4 py-2 text-sm font-medium transition-all focus-ring',
    layout === 'mobile' && 'block',
    isActive
      ? 'bg-brand/10 text-brand'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
  );
}

export function Header() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > HEADER.scrolledThreshold);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'glass shadow-lg' : 'bg-background/80 backdrop-blur-sm',
      )}
    >
      <nav aria-label={t.a11y.mainNavigation} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to={ROUTES.home}
            className="group flex items-center space-x-2 rounded-lg focus-ring"
          >
            <Code2
              className="h-6 w-6 text-brand transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="gradient-text font-heading text-lg font-bold">{SITE.brandName}</span>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            {NAV_ITEMS.map(({ key, path }) => (
              <NavLink
                key={key}
                to={path}
                end={path === ROUTES.home}
                className={({ isActive }) => navLinkClassName(isActive, 'desktop')}
              >
                {t.nav[key]}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <LanguageToggle />
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="focus-ring md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={t.a11y.toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-1 py-4">
                {NAV_ITEMS.map(({ key, path }) => (
                  <NavLink
                    key={key}
                    to={path}
                    end={path === ROUTES.home}
                    className={({ isActive }) => navLinkClassName(isActive, 'mobile')}
                  >
                    {t.nav[key]}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
