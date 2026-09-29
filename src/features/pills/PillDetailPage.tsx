import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { HeroSection } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useContent } from '@/content/useContent';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useI18n } from '@/i18n/useI18n';
import { formatDate } from '@/lib/format';

const PillDetailPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const content = useContent();
  const pill = content.getPillBySlug(slug);

  useDocumentMeta({
    title: pill?.title ?? t.meta.notFound.title,
    description: pill?.summary ?? t.meta.notFound.description,
  });

  if (!pill) return <NotFoundPage />;

  const { newer, older } = content.getAdjacentPills(pill.slug);

  return (
    <>
      <HeroSection tone="accent" widthClassName="max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to={ROUTES.pills}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.pills.backToList}
          </Link>
        </Button>

        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={pill.date}>{formatDate(pill.date, locale)}</time>
        </div>

        <h1 className="mb-6 font-heading text-5xl font-bold">{pill.title}</h1>
        <p className="mb-6 text-xl text-muted-foreground">{pill.summary}</p>

        <ul className="flex flex-wrap gap-2">
          {pill.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </li>
          ))}
        </ul>
      </HeroSection>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0.2} className="mx-auto max-w-4xl">
            <div className="glass mb-12 rounded-2xl p-8">
              <ContentRenderer content={pill.content} />
            </div>

            <nav className="flex items-center justify-between gap-4 border-t border-border pt-8">
              {newer ? (
                <Button asChild variant="ghost" className="h-auto">
                  <Link to={ROUTES.pill(newer.slug)} className="group">
                    <ArrowLeft
                      className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                    <span className="text-left">
                      <span className="block text-xs text-muted-foreground">{t.pills.newer}</span>
                      <span className="block text-sm font-medium">{newer.title}</span>
                    </span>
                  </Link>
                </Button>
              ) : (
                <div />
              )}

              {older ? (
                <Button asChild variant="ghost" className="h-auto">
                  <Link to={ROUTES.pill(older.slug)} className="group">
                    <span className="text-right">
                      <span className="block text-xs text-muted-foreground">{t.pills.older}</span>
                      <span className="block text-sm font-medium">{older.title}</span>
                    </span>
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </nav>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default PillDetailPage;
