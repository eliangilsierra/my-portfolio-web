import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef, type CSSProperties, type RefObject } from 'react';
import { Link } from 'react-router';
import { gsap, useGSAP } from '@/components/motion/gsap';
import { SplitHeadline } from '@/components/motion/SplitHeadline';
import { useMagnetic } from '@/components/motion/useMagnetic';
import { usePointerMotion } from '@/components/motion/useMediaQuery';
import { Button } from '@/components/ui/button';
import { SHEETS } from '@/config/constants';
import { DISTANCE, DURATION, EASE } from '@/config/motion';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { BlueprintField } from './hero/BlueprintField';
import { HeroSchematic } from './hero/HeroSchematic';

const delay = (name: string, seconds: number) => ({ [name]: `${seconds}s` }) as CSSProperties;

/**
 * Layers marked with `data-depth` drift against the pointer, deeper layers further. Pointer
 * positions go straight to GSAP quickTo setters: no React state, no re-renders.
 */
function usePointerParallax(scope: RefObject<HTMLElement | null>) {
  const enabled = usePointerMotion();

  useGSAP(
    () => {
      const section = scope.current;
      if (!section || !enabled) return;

      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', section).map((layer) => ({
        depth: Number(layer.dataset.depth),
        x: gsap.quickTo(layer, 'x', { duration: DURATION.epic, ease: EASE.out }),
        y: gsap.quickTo(layer, 'y', { duration: DURATION.epic, ease: EASE.out }),
      }));

      const move = (event: PointerEvent) => {
        const offsetX = event.clientX / window.innerWidth - 0.5;
        const offsetY = event.clientY / window.innerHeight - 0.5;
        for (const layer of layers) {
          layer.x(-offsetX * layer.depth * DISTANCE.parallax);
          layer.y(-offsetY * layer.depth * DISTANCE.parallax);
        }
      };

      section.addEventListener('pointermove', move);
      return () => section.removeEventListener('pointermove', move);
    },
    { scope, dependencies: [enabled], revertOnUpdate: true },
  );
}

/** Sheet 00: the name set huge over a living drawing of the system the author builds. */
export function Hero() {
  const { t } = useI18n();
  const routes = useRoutes();
  const { name, tagline, bio, skills } = useAbout();
  const specs = tagline
    .split('•')
    .map((spec) => spec.trim())
    .filter(Boolean);

  const scope = useRef<HTMLElement>(null);
  const primary = useMagnetic<HTMLAnchorElement>();
  const secondary = useMagnetic<HTMLAnchorElement>();
  usePointerParallax(scope);

  return (
    <section
      ref={scope}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <BlueprintField />

      <div className="relative sheet flex min-h-[calc(100svh-4rem)] flex-col pt-6 pb-8 md:min-h-[calc(100svh-5rem)] md:pt-10 md:pb-12">
        <div className="reveal flex flex-wrap items-center justify-between gap-4 annotation text-muted-foreground">
          <p>
            <span className="text-brand">
              {t.sheet.label} {SHEETS.home}
            </span>
            <span aria-hidden="true"> — </span>
            {t.nav.home}
          </p>
          <p className="flex items-center gap-2.5 text-foreground">
            <span aria-hidden="true" className="relative inline-flex size-2">
              <span className="blink absolute inset-0 bg-success" />
              <span className="size-2 bg-success/60" />
            </span>
            {t.home.availability}
          </p>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:py-8">
          <ul
            className="reveal space-y-3 self-end lg:col-span-4"
            style={delay('--reveal-delay', 0.6)}
          >
            {specs.map((spec, index) => (
              <li key={spec} className="flex items-baseline gap-4 border-b border-border pb-2">
                <span aria-hidden="true" className="annotation text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-sm">{spec}</span>
              </li>
            ))}
          </ul>

          <div data-depth="1.4" className="hidden md:block lg:col-span-7 lg:col-start-6">
            <HeroSchematic skills={skills} className="h-auto max-h-[44vh] w-full" />
          </div>
        </div>

        <h1 id="hero-title">
          <span className="sr-only">
            {t.home.greeting} {name}
          </span>
          <span
            aria-hidden="true"
            className="reveal mb-2 block font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase md:mb-4 md:text-base"
            style={delay('--reveal-delay', 0.15)}
          >
            {t.home.greeting}
          </span>
          <span data-depth="0.5" className="block text-display font-bold">
            <SplitHeadline text={name} delay={250} visualOnly />
          </span>
        </h1>
        <span
          aria-hidden="true"
          className="grow-on-load mt-4 block signal-line w-full md:mt-6"
          style={delay('--grow-delay', 0.9)}
        />

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
          <p
            className="reveal max-w-2xl text-lead text-foreground/85 lg:col-span-7"
            style={delay('--reveal-delay', 0.8)}
          >
            {bio}
          </p>
          <div
            className="reveal flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end"
            style={delay('--reveal-delay', 1)}
          >
            <Button asChild size="lg">
              <Link ref={primary} to={routes.projects} viewTransition>
                {t.home.viewProjects}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link ref={secondary} to={routes.contact} viewTransition>
                {t.home.contactMe}
              </Link>
            </Button>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="fade-on-load mt-10 hidden items-center gap-2 annotation text-muted-foreground md:flex"
          style={delay('--fade-delay', 1.6)}
        >
          <ArrowDown className="size-3.5" />
          {t.sheet.scroll}
        </p>
      </div>
    </section>
  );
}
