import { ArrowUpRight } from 'lucide-react';
import { useParams } from 'react-router';
import { CropMarks } from '@/components/blueprint/CropMarks';
import { TitleBlock } from '@/components/blueprint/TitleBlock';
import { AdjacentNav } from '@/components/content/AdjacentNav';
import { BackLink } from '@/components/content/BackLink';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { RevealText } from '@/components/motion/RevealText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { SHEETS } from '@/config/constants';
import { assetUrl } from '@/config/env';
import { useProjects } from '@/content/hooks';
import { NotFoundPage } from '@/features/not-found';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';

const pad = (value: number) => String(value).padStart(2, '0');

function ExternalLinkItem({
  href,
  label,
  openInNewTab,
}: {
  href: string;
  label: string;
  openInNewTab: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm focus-ring hover:text-brand"
    >
      <span className="draw-underline">{label}</span>
      <ArrowUpRight
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
      <span className="sr-only"> {openInNewTab}</span>
    </a>
  );
}

const ProjectDetailPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const routes = useRoutes();
  const repository = useProjects();
  const project = repository.getProjectBySlug(slug);

  if (!project) return <NotFoundPage />;

  const position = repository.getProjects().indexOf(project) + 1;
  const { previous, next } = repository.getAdjacentProjects(project.slug);
  const hasLinks = Boolean(project.repoUrl ?? project.demoUrl);

  return (
    <>
      <PageHero
        sheet={`${SHEETS.projects}.${pad(position)}`}
        label={t.projects.caseStudy}
        title={project.title}
        description={project.excerpt}
        back={<BackLink to={routes.projects}>{t.projects.backToList}</BackLink>}
        titleStyle={{ viewTransitionName: `title-${project.slug}` }}
      />

      <section className="sheet pt-12 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal delay={0.35} className="lg:col-span-8">
            <figure className="relative border border-border-strong bg-card p-2 md:p-3">
              <CropMarks className="-m-2" sizeClassName="size-3" />
              {project.coverImage ? (
                <img
                  src={assetUrl(project.coverImage)}
                  alt=""
                  width={800}
                  height={450}
                  style={{ viewTransitionName: `cover-${project.slug}` }}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div aria-hidden="true" className="aspect-[16/9] w-full bp-grid" />
              )}
            </figure>
          </Reveal>

          <Reveal delay={0.5} className="lg:col-span-4">
            <TitleBlock
              title={t.projects.details}
              className="lg:sticky lg:top-28"
              rows={[
                { label: t.projects.type, value: t.projectTypes[project.type] },
                { label: t.projects.year, value: project.year },
                {
                  label: t.projects.techStack,
                  value: (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.8rem]">
                      {project.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  ),
                },
                ...(hasLinks
                  ? [
                      {
                        label: t.projects.links,
                        value: (
                          <div className="flex flex-col items-start gap-1.5">
                            {project.repoUrl && (
                              <ExternalLinkItem
                                href={project.repoUrl}
                                label={t.common.repository}
                                openInNewTab={t.a11y.openInNewTab}
                              />
                            )}
                            {project.demoUrl && (
                              <ExternalLinkItem
                                href={project.demoUrl}
                                label={t.common.liveDemo}
                                openInNewTab={t.a11y.openInNewTab}
                              />
                            )}
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </Reveal>
        </div>

        {project.highlights.length > 0 && (
          <section aria-labelledby="highlights-title" className="mt-24 md:mt-32">
            <p className="mb-4 annotation text-muted-foreground">
              <span className="text-brand">A</span> / {t.projects.highlights}
            </p>
            <RevealText as="h2" id="highlights-title" className="mb-10 text-title font-semibold">
              {t.projects.highlights}
            </RevealText>
            <ScrollReveal items="li">
              <ol className="grid border-t border-l border-border md:grid-cols-2">
                {project.highlights.map((highlight, index) => (
                  <li key={highlight} className="border-r border-b border-border p-6 md:p-8">
                    <span aria-hidden="true" className="annotation text-brand">
                      N.{pad(index + 1)}
                    </span>
                    <p className="mt-4 max-w-md text-lg leading-snug">{highlight}</p>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </section>
        )}

        <article className="mt-24 grid md:mt-32 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <ContentRenderer content={project.content} />
          </div>
        </article>

        {project.gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="mt-24 md:mt-32">
            <p className="mb-4 annotation text-muted-foreground">
              <span className="text-brand">B</span> / {t.projects.gallery}
            </p>
            <RevealText as="h2" id="gallery-title" className="mb-10 text-title font-semibold">
              {t.projects.gallery}
            </RevealText>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {project.gallery.map((image, index) => (
                <ScrollReveal key={image.src} variant="clip">
                  <figure>
                    <div className="border border-border bg-card p-2">
                      {/* The caption carries the description, so the image itself is not announced twice. */}
                      <img
                        src={assetUrl(image.src)}
                        alt=""
                        loading="lazy"
                        width={800}
                        height={450}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 flex gap-3 text-sm text-muted-foreground">
                      <span className="shrink-0 annotation text-brand">
                        {t.projects.figure} {index + 1}
                      </span>
                      <span>{image.alt}</span>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        <div className="mt-24 md:mt-32">
          <AdjacentNav
            label={t.projects.adjacent}
            previous={
              previous && {
                to: routes.project(previous.slug),
                label: t.projects.previous,
                title: previous.title,
              }
            }
            next={
              next && { to: routes.project(next.slug), label: t.projects.next, title: next.title }
            }
          />
        </div>
      </section>
    </>
  );
};

export { ProjectDetailPage };
