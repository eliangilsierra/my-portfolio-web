import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/motion/Reveal';
import { staggerDelay } from '@/components/motion/stagger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PROJECT_CARD } from '@/config/constants';
import { assetUrl } from '@/config/env';
import { ROUTES } from '@/config/routes';
import type { Project } from '@/content/types';
import { useI18n } from '@/i18n/useI18n';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { t } = useI18n();
  const hiddenTechCount = project.tech.length - PROJECT_CARD.visibleTechBadges;

  return (
    <Reveal inView delay={staggerDelay(index)} className="h-full">
      <Card className="group glass flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand/20 to-accent/20">
          {project.coverImage && (
            <img
              src={assetUrl(project.coverImage)}
              alt=""
              loading="lazy"
              width={800}
              height={450}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2">
              {t.projectTypes[project.type]}
            </Badge>
            <h3 className="line-clamp-2 font-heading text-xl font-bold text-foreground">
              {project.title}
            </h3>
          </div>
        </div>

        <CardHeader className="flex-1">
          <p className="line-clamp-3 text-sm text-muted-foreground">{project.excerpt}</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, PROJECT_CARD.visibleTechBadges).map((tech) => (
              <Badge key={tech} variant="outline" className="font-mono text-xs">
                {tech}
              </Badge>
            ))}
            {hiddenTechCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{hiddenTechCount}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.a11y.viewRepository}: ${project.title} ${t.a11y.openInNewTab}`}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.a11y.viewDemo}: ${project.title} ${t.a11y.openInNewTab}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>

          <Button asChild size="sm" className="group/btn">
            <Link to={ROUTES.project(project.slug)}>
              {t.common.viewMore}
              <span className="sr-only">: {project.title}</span>
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Reveal>
  );
}
