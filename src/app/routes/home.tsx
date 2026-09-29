import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { createJsonContentRepository } from '@/content/json-source';
import { HomePage } from '@/features/home';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta, personStructuredData } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.home;
  const about = createJsonContentRepository(locale).getAbout();

  return [
    ...pageMeta({ locale, path: PATHS.home, title, description }),
    personStructuredData(about, locale),
  ];
};

export default HomePage;
