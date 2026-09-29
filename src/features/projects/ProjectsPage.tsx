import { useMemo, useState } from 'react';
import { FilterBar, type FilterOption } from '@/components/content/FilterBar';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useFlip } from '@/components/motion/useFlip';
import { SHEETS } from '@/config/constants';
import { PROJECT_TYPES } from '@/domain/project';
import { useProjects } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { ProjectCard } from './ProjectCard';
import { filterProjects, type ProjectTypeFilter } from './search';

const TYPE_FILTERS: ProjectTypeFilter[] = ['all', ...PROJECT_TYPES];

const ProjectsPage = () => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ProjectTypeFilter>('all');

  const projects = useProjects().getProjects();
  const visibleProjects = useMemo(
    () => filterProjects(projects, query, type),
    [projects, query, type],
  );
  const typeOptions: FilterOption<ProjectTypeFilter>[] = TYPE_FILTERS.map((value) => ({
    value,
    label: t.projectTypes[value],
  }));

  // Cards glide to their new places when the filters change.
  const { scope, capture } = useFlip<HTMLUListElement>(`${type}|${query}`);

  return (
    <>
      <PageHero
        sheet={SHEETS.projects}
        label={t.projects.badge}
        title={t.projects.title}
        description={t.projects.description}
      />

      <section className="sheet pt-12 md:pt-16">
        <Reveal delay={0.5}>
          <FilterBar
            searchQuery={query}
            onSearchChange={(value) => {
              capture();
              setQuery(value);
            }}
            placeholder={t.projects.searchPlaceholder}
            options={typeOptions}
            selectedOption={type}
            onOptionChange={(value) => {
              capture();
              setType(value);
            }}
          />
        </Reveal>

        <div className="mt-10 md:mt-14">
          {visibleProjects.length > 0 ? (
            <ScrollReveal items="[data-reveal-card]">
              <ul ref={scope} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project) => (
                  <li key={project.slug} data-reveal-card="">
                    <ProjectCard
                      project={project}
                      index={projects.indexOf(project)}
                      headingLevel={2}
                    />
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ) : (
            <p
              role="status"
              className="border-y border-border py-20 text-center text-lead text-muted-foreground"
            >
              {t.projects.empty}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export { ProjectsPage };
