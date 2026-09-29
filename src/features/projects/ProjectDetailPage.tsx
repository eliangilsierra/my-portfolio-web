import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { HeroSection } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { assetUrl } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { useContent } from '@/content/useContent';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useI18n } from '@/i18n/useI18n';

const ProjectDetailPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const project = useContent().getProjectBySlug(slug);

  useDocumentMeta({
    title: project?.title ?? t.meta.notFound.title,
    description: project?.excerpt ?? t.meta.notFound.description,
  });

  if (!project) return <NotFoundPage />;

  return (
    <>
      <HeroSection widthClassName="max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to={ROUTES.projects}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.projects.backToList}
          </Link>
        </Button>

        <Badge variant="secondary" className="mb-4">
          {t.projectTypes[project.type]}
        </Badge>

        <h1 className="mb-6 font-heading text-5xl font-bold">{project.title}</h1>
        <p className="mb-6 text-xl text-muted-foreground">{project.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{project.year}</span>
          </div>

          {project.repoUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                {t.common.repository}
                <span className="sr-only"> {t.a11y.openInNewTab}</span>
              </a>
            </Button>
          )}

          {project.demoUrl && (
            <Button asChild size="sm">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                {t.common.liveDemo}
                <span className="sr-only"> {t.a11y.openInNewTab}</span>
              </a>
            </Button>
          )}
        </div>
      </HeroSection>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0.2} className="mx-auto max-w-4xl">
            <div className="glass mb-12 rounded-2xl p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold">{t.projects.techStack}</h2>
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li key={tech}>
                    <Badge variant="outline" className="font-mono">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            {project.highlights.length > 0 && (
              <div className="glass mb-12 rounded-2xl p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold">{t.projects.highlights}</h2>
                <ul className="space-y-3">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-1 text-brand" aria-hidden="true">
                        ✓
                      </span>
                      <span className="text-foreground/90">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass mb-12 rounded-2xl p-8">
              <ContentRenderer content={project.content} />
            </div>

            {project.gallery.length > 0 && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold">{t.projects.gallery}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {project.gallery.map((image) => (
                    <figure
                      key={image.src}
                      className="glass aspect-video overflow-hidden rounded-xl"
                    >
                      <img
                        src={assetUrl(image.src)}
                        alt={image.alt}
                        loading="lazy"
                        width={800}
                        height={450}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;
