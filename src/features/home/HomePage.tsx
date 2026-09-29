import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { CapabilityMap } from '@/components/blueprint/CapabilityMap';
import { SectionHeading } from '@/components/blueprint/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { HOME } from '@/config/constants';
import { usePills, useProjects } from '@/content/hooks';
import { PillCard } from '@/features/pills';
import { ProjectIndex } from '@/features/projects';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { ClosingCta } from './ClosingCta';
import { Hero } from './Hero';

function ViewAllLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      viewTransition
      className="group inline-flex items-center gap-2 annotation focus-ring hover:text-brand"
    >
      <span className="draw-underline">{children}</span>
      <ArrowRight
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}

const HomePage = () => {
  const { t } = useI18n();
  const routes = useRoutes();
  const featuredProjects = useProjects().getFeaturedProjects(HOME.featuredProjectsCount);
  const latestPills = usePills().getLatestPills(HOME.latestPillsCount);

  return (
    <>
      <Hero />

      <section aria-labelledby="work-title" className="sheet pt-24 md:pt-40">
        <SectionHeading
          index="01"
          label={t.home.featured.badge}
          title={t.home.featured.title}
          description={t.home.featured.description}
          id="work-title"
          aside={<ViewAllLink to={routes.projects}>{t.home.featured.viewAll}</ViewAllLink>}
        />
        <ProjectIndex projects={featuredProjects} />
      </section>

      <section aria-labelledby="capabilities-title" className="sheet pt-24 md:pt-40">
        <SectionHeading
          index="02"
          label={t.home.capabilities.badge}
          title={t.home.capabilities.title}
          description={t.home.capabilities.description}
          id="capabilities-title"
        />
        <CapabilityMap />
      </section>

      <section aria-labelledby="notes-title" className="sheet pt-24 md:pt-40">
        <SectionHeading
          index="03"
          label={t.home.latest.badge}
          title={t.home.latest.title}
          description={t.home.latest.description}
          id="notes-title"
          aside={<ViewAllLink to={routes.pills}>{t.home.latest.viewAll}</ViewAllLink>}
        />
        <ScrollReveal items="article" className="border-t border-border-strong">
          {latestPills.map((pill) => (
            <PillCard key={pill.slug} pill={pill} />
          ))}
        </ScrollReveal>
      </section>

      <ClosingCta />
    </>
  );
};

export { HomePage };
