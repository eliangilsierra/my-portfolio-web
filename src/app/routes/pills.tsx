import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { PillsPage } from '@/features/pills';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.pills;

  return pageMeta({ locale, path: PATHS.pills, title, description });
};

export default PillsPage;
