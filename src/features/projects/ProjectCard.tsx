import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { CropMarks } from '@/components/blueprint/CropMarks';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { PROJECT_CARD } from '@/config/constants';
import { assetUrl } from '@/config/env';
import type { Project } from '@/domain/project';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';

interface ProjectCardProps {
  project: Project;
  /** Position in the list, printed as the sheet reference (P-01, P-02…). */
  index?: number;
  /** Heading level of the card title: 2 under a page title, 3 under a section heading. */
  headingLevel?: 2 | 3;
}

/**
 * A project as a drawing sheet: reference strip, cover, title and stack. The whole card links to
 * the case study; the cover and title carry a `view-transition-name`, so they morph into the case
 * study header when it opens.
 */
export function ProjectCard({ project, index = 0, headingLevel = 3 }: ProjectCardProps) {
  const Heading = `h${headingLevel}` as const;
  const { t } = useI18n();
  const routes = useRoutes();
  const visibleTech = project.tech.slice(0, PROJECT_CARD.visibleTechBadges);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  return (
    <article
      data-flip-id={project.slug}
      className="group relative flex h-full flex-col border border-border bg-card/70 transition-colors duration-300 hover:border-border-strong"
    >
      <CropMarks
        className="-m-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        sizeClassName="size-2.5"
      />

      <div className="flex items-center justify-between border-b border-border px-5 py-3 annotation text-muted-foreground">
        <span>
          <span className="text-brand">P-{String(index + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> · </span>
          {t.projectTypes[project.type]}
        </span>
        <span>{project.year}</span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary">
        {project.coverImage && (
          <img
            src={assetUrl(project.coverImage)}
            alt=""
            loading="lazy"
            width={800}
            height={450}
            style={{ viewTransitionName: `cover-${project.slug}` }}
            className="size-full object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <Heading className="text-2xl leading-tight font-semibold tracking-tight md:text-[1.75rem]">
          <span style={{ viewTransitionName: `title-${project.slug}` }}>{project.title}</span>
        </Heading>
        <p className="line-clamp-3 text-muted-foreground">{project.excerpt}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {visibleTech.join(' / ')}
          {hiddenTechCount > 0 && ` / +${hiddenTechCount}`}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className="relative z-10 flex items-center gap-1">
            {project.repoUrl && (
              <Button size="icon" variant="ghost" asChild>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.a11y.viewRepository}: ${project.title} ${t.a11y.openInNewTab}`}
                >
                  <GithubIcon aria-hidden="true" />
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="icon" variant="ghost" asChild>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.a11y.viewDemo}: ${project.title} ${t.a11y.openInNewTab}`}
                >
                  <ExternalLink aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>

          <Link
            to={routes.project(project.slug)}
            viewTransition
            className="stretched-link inline-flex h-11 items-center gap-2 annotation focus-ring group-hover:text-brand"
          >
            {t.common.viewMore}
            <span className="sr-only">: {project.title}</span>
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
