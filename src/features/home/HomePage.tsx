import { ArrowRight, Code2, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { SectionBadge } from '@/components/content/SectionBadge';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { HOME } from '@/config/constants';
import { useAbout, usePills, useProjects } from '@/content/hooks';
import { PillCard } from '@/features/pills';
import { ProjectCard } from '@/features/projects';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';

const HomePage = () => {
  const { t } = useI18n();
  const routes = useRoutes();
  const { name, tagline, bio } = useAbout();
  const featuredProjects = useProjects().getFeaturedProjects(HOME.featuredProjectsCount);
  const latestPills = usePills().getLatestPills(HOME.latestPillsCount);

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ background: 'var(--gradient-radial)' }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <Reveal className="mx-auto max-w-4xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium glass">
              <Sparkles className="h-4 w-4 text-accent-text" aria-hidden="true" />
              <span>{t.home.availability}</span>
            </div>

            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {t.home.greeting} <span className="gradient-text">{name}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl text-muted-foreground sm:text-2xl">{tagline}</p>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/80">{bio}</p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link to={routes.projects}>
                  {t.home.viewProjects}
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="group">
                <Link to={routes.contact}>
                  {t.home.contactMe}
                  <Code2
                    className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal inView className="mb-12 text-center">
            <SectionBadge icon={Rocket} className="mb-4">
              {t.home.featured.badge}
            </SectionBadge>
            <h2 className="font-heading text-4xl font-bold">{t.home.featured.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t.home.featured.description}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>

          <Reveal inView delay={0.3} className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to={routes.projects}>
                {t.home.featured.viewAll}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal inView className="mb-12 text-center">
            <SectionBadge icon={Sparkles} tone="accent" className="mb-4">
              {t.home.latest.badge}
            </SectionBadge>
            <h2 className="font-heading text-4xl font-bold">{t.home.latest.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t.home.latest.description}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPills.map((pill, index) => (
              <PillCard key={pill.slug} pill={pill} index={index} />
            ))}
          </div>

          <Reveal inView delay={0.3} className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to={routes.pills}>
                {t.home.latest.viewAll}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export { HomePage };
