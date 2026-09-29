import type { MetaFunction } from 'react-router';
import { PATHS } from '@/config/routes';
import { ContactPage } from '@/features/contact';
import { dictionaries } from '@/i18n/dictionaries';
import { localeFromParams, pageMeta } from '../seo';

export const meta: MetaFunction = ({ params }) => {
  const locale = localeFromParams(params);
  const { title, description } = dictionaries[locale].meta.contact;

  return pageMeta({ locale, path: PATHS.contact, title, description });
};

export default ContactPage;
