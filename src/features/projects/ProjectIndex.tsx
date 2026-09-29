import { ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap, useGSAP } from '@/components/motion/gsap';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useFinePointer, usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { assetUrl } from '@/config/env';
import { DURATION, EASE } from '@/config/motion';
import type { Project } from '@/domain/project';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { cn } from '@/lib/utils';

type Mover = gsap.QuickToFunc;

interface ProjectIndexProps {
  projects: Project[];
  /** Heading level of each project title: 2 under a page title, 3 under a section heading. */
  headingLevel?: 2 | 3;
}

/**
 * Projects as an editorial index: one large row per project. With a mouse, the cover of the row
 * under the pointer (or with keyboard focus) floats beside it; on touch screens every row shows its
 * cover inline instead.
 */
export function ProjectIndex({ projects, headingLevel = 3 }: ProjectIndexProps) {
  const Heading = `h${headingLevel}` as const;
  const { t } = useI18n();
  const routes = useRoutes();
  const finePointer = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const scope = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const move = useRef<{ x: Mover; y: Mover } | null>(null);

  useGSAP(
    () => {
      const container = scope.current;
      const floating = preview.current;
      if (!container || !floating) return;

      const settings = { duration: reduced ? 0 : DURATION.slow, ease: EASE.out };
      gsap.set(floating, { xPercent: -50, yPercent: -50 });
      move.current = {
        x: gsap.quickTo(floating, 'x', settings),
        y: gsap.quickTo(floating, 'y', settings),
      };

      const follow = (event: PointerEvent) => {
        const box = container.getBoundingClientRect();
        move.current?.x(event.clientX - box.left);
        move.current?.y(event.clientY - box.top);
      };
      container.addEventListener('pointermove', follow);
      return () => {
        container.removeEventListener('pointermove', follow);
        move.current = null;
      };
    },
    { scope, dependencies: [finePointer, reduced], revertOnUpdate: true },
  );

  // Keyboard focus parks the preview on the right of the focused row.
  const showFor = (slug: string, row: HTMLElement) => {
    setActive(slug);
    const container = scope.current;
    if (!container || !move.current) return;
    move.current.x(container.clientWidth * 0.78);
    move.current.y(row.offsetTop + row.offsetHeight / 2);
  };

  return (
    <div ref={scope} className="relative" onPointerLeave={() => setActive(null)}>
      <ScrollReveal items="[data-index-row]">
        <ol className="border-t border-border-strong">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              data-index-row=""
              className="group relative border-b border-border"
              onPointerEnter={() => setActive(project.slug)}
              onFocus={(event) => showFor(project.slug, event.currentTarget)}
              onBlur={() => setActive(null)}
            >
              <div className="grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7 transition-[padding] duration-500 ease-(--ease-out-expo) md:py-10 pointer-fine:md:group-hover:pl-4">
                <span
                  aria-hidden="true"
                  className="col-span-2 annotation text-muted-foreground md:col-span-1"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Heading className="col-span-10 text-[clamp(1.75rem,4.2vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] transition-colors duration-300 group-hover:text-brand md:col-span-6">
                  <Link
                    to={routes.project(project.slug)}
                    viewTransition
                    className="stretched-link focus-ring"
                  >
                    <span style={{ viewTransitionName: `title-${project.slug}` }}>
                      {project.title}
                    </span>
                  </Link>
                </Heading>
                <p className="col-span-6 col-start-3 annotation text-muted-foreground md:col-span-2 md:col-start-auto">
                  {t.projectTypes[project.type]}
                </p>
                <p className="col-span-4 annotation text-muted-foreground md:col-span-2">
                  {project.tech.slice(0, 2).join(' / ')}
                </p>
                <p className="col-span-12 flex items-center justify-between annotation md:col-span-1 md:justify-end md:gap-2">
                  <span className="sr-only">{t.projects.year}:</span>
                  {project.year}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:hidden md:group-hover:inline"
                  />
                </p>
              </div>

              {project.coverImage && (
                <div className="mb-8 aspect-[16/9] overflow-hidden border border-border bg-card pointer-fine:md:hidden">
                  <img
                    src={assetUrl(project.coverImage)}
                    alt=""
                    loading="lazy"
                    width={800}
                    height={450}
                    className="size-full object-cover"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </ScrollReveal>

      {finePointer && (
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 hidden w-[min(24rem,30vw)] md:block"
        >
          <div
            className={cn(
              'relative aspect-[16/10] overflow-hidden border border-border-strong bg-card transition-[clip-path] duration-700 ease-(--ease-out-expo)',
              active ? '[clip-path:inset(0)]' : '[clip-path:inset(50%_50%_50%_50%)]',
            )}
          >
            {projects.map((project) =>
              project.coverImage ? (
                <img
                  key={project.slug}
                  src={assetUrl(project.coverImage)}
                  alt=""
                  width={800}
                  height={450}
                  className={cn(
                    'absolute inset-0 size-full scale-110 object-cover transition-[opacity,scale] duration-700 ease-(--ease-out-expo)',
                    active === project.slug && 'scale-100 opacity-100',
                    active !== project.slug && 'opacity-0',
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  );
}
