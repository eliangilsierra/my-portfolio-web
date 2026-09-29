import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { gsap, useGSAP } from '@/components/motion/gsap';
import { Button } from '@/components/ui/button';
import { HEADER } from '@/config/constants';
import { SITE } from '@/config/site';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { cn } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { MobileMenu } from './MobileMenu';
import { NAV_ITEMS, sheetNumber } from './nav-items';
import { ThemeToggle } from './ThemeToggle';

/**
 * Tucks the header away while the visitor reads downwards and brings it back as soon as they
 * scroll up. State lives in data attributes, so scrolling never re-renders React.
 */
function watchScroll(element: HTMLElement): () => void {
  let lastY = window.scrollY;
  let frame = 0;
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    element.dataset.scrolled = String(y > HEADER.scrolledThreshold);
    element.dataset.hidden = String(y > HEADER.hideAfter && y > lastY);
    lastY = y;
  };
  const onScroll = () => {
    frame ||= requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
  };
}

export function Header() {
  const { t, locale } = useI18n();
  const routes = useRoutes();
  const { pathname } = useLocation();
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  // The menu is open only for the path it was opened on, so navigating closes it without an effect.
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const isMenuOpen = menuOpenPath === pathname;

  useEffect(() => (header.current ? watchScroll(header.current) : undefined), []);

  // Reading progress: a signal line under the header that follows the scroll position. Its end
  // ('max') is recomputed when MotionProvider refreshes ScrollTrigger after each navigation.
  useGSAP(() => {
    if (!progress.current) return;
    gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } },
    );
  });

  return (
    <header
      ref={header}
      data-scrolled="false"
      data-hidden="false"
      style={{ viewTransitionName: 'site-header' }}
      className="group/header sticky top-0 z-30 w-full border-b border-transparent transition-[transform,background-color,border-color] duration-500 ease-(--ease-out-expo) data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/85 data-[scrolled=true]:backdrop-blur-md"
    >
      <nav aria-label={t.a11y.mainNavigation} className="sheet">
        <div className="flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            to={routes.home}
            viewTransition
            className="group flex items-center gap-3 rounded-sm focus-ring"
          >
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center border border-border-strong transition-colors group-hover:bg-foreground"
            >
              <span className="size-2 bg-brand transition-transform duration-500 group-hover:rotate-45" />
            </span>
            <span className="font-heading text-[0.95rem] font-semibold tracking-tight">
              {SITE.brandName}
            </span>
            <span aria-hidden="true" className="hidden annotation text-muted-foreground sm:inline">
              /{locale}
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((key) => (
              <li key={key}>
                <NavLink
                  to={routes[key]}
                  viewTransition
                  className={({ isActive }) =>
                    cn(
                      'group relative flex h-11 items-center gap-2 px-3 text-sm font-medium focus-ring transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'annotation transition-colors',
                          isActive ? 'text-brand' : 'group-hover:text-brand',
                        )}
                      >
                        {sheetNumber(key)}
                      </span>
                      {t.nav[key]}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-3 bottom-2 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-out-expo)',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />

            <Button
              ref={menuButton}
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpenPath(isMenuOpen ? null : pathname)}
              aria-label={t.a11y.toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <MobileMenu
            onClose={() => {
              setMenuOpenPath(null);
              menuButton.current?.focus();
            }}
          />
        )}
      </nav>

      <span
        ref={progress}
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 signal-line w-full origin-left scale-x-0 opacity-0 transition-opacity group-data-[scrolled=true]/header:opacity-100"
      />
    </header>
  );
}
