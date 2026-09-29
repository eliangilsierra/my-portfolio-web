import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { createJsonContentRepository } from '@/content/json-source';
import { PillDetailPage } from '@/features/pills';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const pill = createJsonContentRepository(locale).getPillBySlug(params.slug ?? '');

  if (!pill) {
    const { title, description } = dictionaries[locale].meta.notFound;
    return pageMeta({ locale, path: PATHS.pills, title, description, noIndex: true });
  }

  return pageMeta({
    locale,
    path: PATHS.pill(pill.slug),
    title: pill.title,
    description: pill.summary,
  });
};

export default PillDetailPage;
