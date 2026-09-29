import type { Project, ProjectType } from '@/domain/project';
import { normalizeText } from '@/lib/text';

export type ProjectTypeFilter = ProjectType | 'all';

export function filterProjects(
  projects: Project[],
  query: string,
  type: ProjectTypeFilter = 'all',
): Project[] {
  const needle = normalizeText(query);

  return projects.filter((project) => {
    if (type !== 'all' && project.type !== type) return false;
    if (!needle) return true;

    const haystack = normalizeText([project.title, project.excerpt, ...project.tech].join(' '));
    return haystack.includes(needle);
  });
}
