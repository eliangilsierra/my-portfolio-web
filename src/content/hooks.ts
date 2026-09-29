import { useContext } from 'react';
import type { About } from '@/domain/about';
import { ContentContext } from './ContentContext';
import type {
  AboutRepository,
  ContentRepository,
  PillRepository,
  ProjectRepository,
} from './repository';

function useRepository(): ContentRepository {
  const repository = useContext(ContentContext);
  if (!repository) {
    throw new Error('Content hooks must be used within a <ContentProvider>');
  }
  return repository;
}

/** Access to projects only. Components should ask for the narrowest hook they need. */
export function useProjects(): ProjectRepository {
  return useRepository();
}

/** Access to knowledge pills only. */
export function usePills(): PillRepository {
  return useRepository();
}

/** The profile (name, bio, skills, links) for the active locale. */
export function useAbout(): About {
  const repository: AboutRepository = useRepository();
  return repository.getAbout();
}
