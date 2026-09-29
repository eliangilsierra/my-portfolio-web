import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useI18n } from '@/i18n/useI18n';
import { logger } from '@/lib/logger';

const NotFoundPage = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();

  useDocumentMeta(t.meta.notFound);

  useEffect(() => {
    logger.warn(`Route not found: ${pathname}`);
  }, [pathname]);

  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <p className="gradient-text font-heading text-7xl font-bold">{t.notFound.code}</p>
      <h1 className="mt-4 font-heading text-3xl font-bold">{t.notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t.notFound.description}</p>
      <Button asChild className="mt-8">
        <Link to={ROUTES.home}>{t.notFound.backHome}</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
