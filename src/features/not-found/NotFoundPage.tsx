import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { CropMarks } from '@/components/blueprint/CropMarks';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { logger } from '@/lib/logger';

const NotFoundPage = () => {
  const { t } = useI18n();
  const routes = useRoutes();
  const { pathname } = useLocation();

  useEffect(() => {
    logger.warn(`Route not found: ${pathname}`);
  }, [pathname]);

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />
      <div className="relative sheet py-24 md:py-36">
        <p className="reveal mb-10 annotation text-muted-foreground">
          <span className="text-brand">
            {t.sheet.label} {t.notFound.code}
          </span>
          <span aria-hidden="true"> — </span>
          <span className="break-all">{pathname}</span>
        </p>
        <p
          aria-hidden="true"
          className="reveal font-heading text-[clamp(7rem,28vw,22rem)] leading-[0.8] font-bold tracking-[-0.06em] outline-text"
        >
          {t.notFound.code}
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="reveal [--reveal-delay:0.2s] md:col-span-7">
            <h1 className="text-title font-semibold">{t.notFound.title}</h1>
            <p className="mt-4 max-w-md text-lead text-muted-foreground">
              {t.notFound.description}
            </p>
          </div>
          <div className="reveal [--reveal-delay:0.35s] md:col-span-5 md:justify-self-end">
            <Button asChild size="lg">
              <Link to={routes.home} viewTransition>
                <ArrowLeft aria-hidden="true" />
                {t.notFound.backHome}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <CropMarks className="m-3 hidden md:block" />
    </section>
  );
};

export { NotFoundPage };
