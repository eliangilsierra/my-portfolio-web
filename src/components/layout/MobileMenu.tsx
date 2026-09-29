import { X } from 'lucide-react';
import { useEffect, useRef, type SyntheticEvent } from 'react';
import { Link, matchPath, useLocation } from 'react-router';
import { gsap, useGSAP } from '@/components/motion/gsap';
import { useScrollLock } from '@/components/motion/smooth-scroll';
import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { Button } from '@/components/ui/button';
import { DURATION, EASE, STAGGER } from '@/config/motion';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { cn } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { NAV_ITEMS, sheetNumber } from './nav-items';
import { ThemeToggle } from './ThemeToggle';

const MENU_ITEMS = ['home', ...NAV_ITEMS] as const;

interface MobileMenuProps {
  /** Called once the menu has finished closing. */
  onClose: () => void;
}

/**
 * Full-screen navigation for small screens, built on a modal <dialog>: the page behind is inert,
 * focus stays inside, and Escape closes it. It unfolds from the top and its links rise in; closing
 * plays the same timeline backwards.
 */
export function MobileMenu({ onClose }: MobileMenuProps) {
  const { t } = useI18n();
  const routes = useRoutes();
  const { pathname } = useLocation();
  const dialog = useRef<HTMLDialogElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const reduced = usePrefersReducedMotion();
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    // jsdom (tests) has no modal dialogs; there the menu is simply shown.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see above
    if (element.showModal) element.showModal();
    else element.setAttribute('open', '');
    element.querySelector<HTMLElement>('a')?.focus();
    lock();

    return unlock;
  }, [lock, unlock]);

  useGSAP(
    () => {
      if (reduced || !dialog.current) return;
      timeline.current = gsap
        .timeline()
        .from(dialog.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: DURATION.base,
          ease: EASE.inOut,
        })
        .from(
          '[data-menu-item]',
          { yPercent: 110, duration: DURATION.slow, stagger: STAGGER.item / 2 },
          '-=0.1',
        );
    },
    { scope: dialog, dependencies: [reduced] },
  );

  // Leave modal mode before handing control back, so the (no longer inert) page can take focus.
  const finish = () => {
    const element = dialog.current;
    // jsdom (tests) implements no dialog methods.
    if (element?.close) element.close();
    onClose();
  };

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const played = timeline.current;
    if (!played) {
      finish();
      return;
    }
    played.eventCallback('onReverseComplete', finish);
    played.timeScale(1.8).reverse();
  };

  // Escape fires `cancel`: close through the same path as the button so the exit animation plays.
  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    close();
  };

  return (
    <dialog
      ref={dialog}
      id="mobile-menu"
      aria-label={t.a11y.mainNavigation}
      onCancel={onCancel}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-background p-0 text-foreground backdrop:bg-transparent open:flex md:hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />

      <div className="sheet flex h-16 items-center justify-between">
        <p className="annotation text-muted-foreground">{t.sheet.label}</p>
        <Button variant="ghost" size="icon" onClick={close} aria-label={t.a11y.closeMenu}>
          <X aria-hidden="true" />
        </Button>
      </div>

      <ul className="sheet flex flex-1 flex-col justify-center gap-2">
        {MENU_ITEMS.map((key) => {
          // The home page is only active on itself; compared without the trailing slash that
          // static hosting adds (NavLink's `end` treats "/es/" and "/es" as different pages).
          const isActive =
            key === 'home'
              ? pathname.replace(/\/+$/, '') === routes.home
              : matchPath({ path: routes[key], end: false }, pathname) !== null;
          return (
            <li key={key} className="overflow-hidden border-b border-border">
              <Link
                to={routes[key]}
                viewTransition
                data-menu-item=""
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-baseline gap-4 py-3 font-heading text-[clamp(2.25rem,11vw,3.5rem)] leading-none font-semibold tracking-tight focus-ring',
                  isActive ? 'text-brand' : 'text-foreground',
                )}
              >
                <span aria-hidden="true" className="annotation text-muted-foreground">
                  {sheetNumber(key)}
                </span>
                {t.nav[key]}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="sheet flex items-center justify-between border-t border-border py-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </dialog>
  );
}
