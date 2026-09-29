import { Code2, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { HEADER } from '@/config/constants';
import { SITE } from '@/config/site';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { cn } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

/** Keys are shared by the dictionary (`t.nav`) and the route table (`useRoutes`). */
const NAV_ITEMS = ['home', 'projects', 'pills', 'about', 'contact'] as const;

function navLinkClassName(isActive: boolean, layout: 'desktop' | 'mobile'): string {
  return cn(
    'rounded-lg px-4 py-2 text-sm font-medium focus-ring transition-all',
    layout === 'mobile' && 'block',
    isActive
      ? 'bg-brand/10 text-brand'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
  );
}

export function Header() {
  const { t } = useI18n();
  const routes = useRoutes();
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  // The menu is open only for the path it was opened on, so navigating closes it without an effect.
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const isMenuOpen = menuOpenPath === pathname;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > HEADER.scrolledThreshold);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'shadow-lg glass' : 'bg-background/80 backdrop-blur-xs',
      )}
    >
      <nav aria-label={t.a11y.mainNavigation} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to={routes.home}
            className="group flex items-center space-x-2 rounded-lg focus-ring"
          >
            <Code2
              className="h-6 w-6 text-brand transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="gradient-text font-heading text-lg font-bold">{SITE.brandName}</span>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            {NAV_ITEMS.map((key) => (
              <NavLink
                key={key}
                to={routes[key]}
                end={key === 'home'}
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
              onClick={() => setMenuOpenPath(isMenuOpen ? null : pathname)}
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

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="reveal space-y-1 py-4 [--reveal-duration:0.2s] md:hidden"
          >
            {NAV_ITEMS.map((key) => (
              <NavLink
                key={key}
                to={routes[key]}
                end={key === 'home'}
                className={({ isActive }) => navLinkClassName(isActive, 'mobile')}
              >
                {t.nav[key]}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
