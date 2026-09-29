import { Moon, Sun } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { DURATION } from '@/config/motion';
import { useI18n } from '@/i18n/useI18n';
import { useTheme } from '@/theme/useTheme';

const REVEAL_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * The new theme spreads from the button as a growing circle (View Transitions API). Browsers
 * without the API, and visitors who prefer less motion, get an instant switch.
 */
function revealFrom(event: MouseEvent<HTMLButtonElement>, apply: () => void): void {
  const root = document.documentElement;
  const x = event.clientX || window.innerWidth;
  const y = event.clientY || 0;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.classList.add('theme-transition');
  const transition = document.startViewTransition(apply);
  void transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: DURATION.slow * 1000,
        easing: REVEAL_EASING,
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
  void transition.finished.finally(() => root.classList.remove('theme-transition'));
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const isDark = theme === 'dark';

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const apply = () => setTheme(isDark ? 'light' : 'dark');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lib.dom declares the API, older browsers lack it
    if (reduced || !document.startViewTransition) apply();
    else revealFrom(event, apply);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group"
      onClick={toggle}
      aria-label={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
    >
      {isDark ? (
        <Sun
          className="transition-transform duration-500 group-hover:rotate-90"
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="transition-transform duration-500 group-hover:-rotate-12"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
