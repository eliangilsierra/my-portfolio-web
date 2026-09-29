import { useRef } from 'react';
import { whenBelowFold } from '@/components/motion/below-fold';
import { gsap, useGSAP } from '@/components/motion/gsap';
import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { useAbout } from '@/content/hooks';
import type { SkillGroups } from '@/domain/about';
import { useI18n } from '@/i18n/useI18n';

/** Request path order: the layer closest to the visitor first, delivery last. */
const LAYERS: { key: keyof SkillGroups; code: string }[] = [
  { key: 'frontend', code: 'FE' },
  { key: 'backend', code: 'BE' },
  { key: 'dataAi', code: 'DA' },
  { key: 'devops', code: 'OPS' },
];

interface CapabilityMapProps {
  /** Heading level of each layer title. */
  headingLevel?: 3 | 4;
}

/**
 * The skills as a system diagram: four layers hanging off one bus, each listing its tools.
 * It is assembled as the visitor scrolls (bus, then nodes, then layers, then tools), scrubbed to
 * the scroll position. No levels or scores: only the tools, as the content lists them.
 */
export function CapabilityMap({ headingLevel = 3 }: CapabilityMapProps) {
  const Heading = `h${headingLevel}` as const;
  const { skills } = useAbout();
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const element = scope.current;
      if (!element || reduced || !contextSafe) return;

      return whenBelowFold(
        element,
        contextSafe(() => {
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: element, start: 'top 85%', end: 'top 30%', scrub: 0.6 },
            })
            .from('[data-cap-bus]', { scaleX: 0, transformOrigin: 'left center' })
            .from('[data-cap-node]', { scale: 0, stagger: 0.12 }, '<0.2')
            .from('[data-cap-group]', { opacity: 0, y: 28, stagger: 0.12 }, '<')
            .from('[data-cap-skill]', { opacity: 0, x: -14, stagger: 0.025 }, '<0.2');
        }),
      );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope} className="relative">
      <div aria-hidden="true" className="relative mb-2 hidden h-6 md:block">
        <span data-cap-bus="" className="absolute inset-x-0 top-1/2 h-px bg-border-strong" />
        <div className="absolute inset-0 grid grid-cols-4 gap-8">
          {LAYERS.map(({ key }) => (
            <span key={key} className="relative">
              <span
                data-cap-node=""
                className="absolute top-1/2 left-0 size-3 -translate-y-1/2 border border-border-strong bg-background"
              />
            </span>
          ))}
        </div>
      </div>

      <ul className="grid gap-12 md:grid-cols-4 md:gap-8">
        {LAYERS.map(({ key, code }, layerIndex) => (
          <li key={key} data-cap-group="">
            <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-5 md:border-t-0 md:pt-6">
              <Heading className="text-2xl font-semibold tracking-tight">
                {t.about.skillGroups[key]}
              </Heading>
              <span aria-hidden="true" className="annotation text-brand">
                {String(layerIndex + 1).padStart(2, '0')}
              </span>
            </div>
            <ul className="mt-5 border-t border-border">
              {skills[key].map((skill, skillIndex) => (
                <li
                  key={skill}
                  data-cap-skill=""
                  className="flex items-baseline justify-between gap-4 border-b border-border py-2.5"
                >
                  <span className="font-mono text-sm">{skill}</span>
                  <span aria-hidden="true" className="annotation text-muted-foreground">
                    {code}.{String(skillIndex + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
