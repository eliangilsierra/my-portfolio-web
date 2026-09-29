import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { createJsonContentRepository } from '@/content/json-source';
import { ProjectDetailPage } from '@/features/projects';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const project = createJsonContentRepository(locale).getProjectBySlug(params.slug ?? '');

  if (!project) {
    const { title, description } = dictionaries[locale].meta.notFound;
    return pageMeta({ locale, path: PATHS.projects, title, description, noIndex: true });
  }

  return pageMeta({
    locale,
    path: PATHS.project(project.slug),
    title: project.title,
    description: project.excerpt,
  });
};

export default ProjectDetailPage;
