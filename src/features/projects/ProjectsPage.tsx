import { Briefcase } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterBar, type FilterOption } from '@/components/content/FilterBar';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
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

  return (
    <>
      <PageHero
        icon={Briefcase}
        badge={t.projects.badge}
        title={t.projects.title}
        description={t.projects.description}
        tone="muted"
      />

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0.2}>
            <FilterBar
              searchQuery={query}
              onSearchChange={setQuery}
              placeholder={t.projects.searchPlaceholder}
              options={typeOptions}
              selectedOption={type}
              onOptionChange={setType}
            />
          </Reveal>

          <div className="mt-12">
            {visibleProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={index}
                    headingLevel={2}
                  />
                ))}
              </div>
            ) : (
              <p role="status" className="py-20 text-center text-xl text-muted-foreground">
                {t.projects.empty}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export { ProjectsPage };
