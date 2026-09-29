import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { ProjectsPage } from '@/features/projects';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.projects;

  return pageMeta({ locale, path: PATHS.projects, title, description });
};

export default ProjectsPage;
