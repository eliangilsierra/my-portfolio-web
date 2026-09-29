import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { NotFoundPage } from '@/features/not-found';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.notFound;

  return pageMeta({ locale, path: PATHS.home, title, description, noIndex: true });
};

export default NotFoundPage;
