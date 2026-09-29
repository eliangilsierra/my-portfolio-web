import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { AboutPage } from '@/features/about';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.about;

  return pageMeta({ locale, path: PATHS.about, title, description });
};

export default AboutPage;
