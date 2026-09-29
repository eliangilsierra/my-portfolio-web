import { useParams } from 'react-router';
import { AdjacentNav } from '@/components/content/AdjacentNav';
import { BackLink } from '@/components/content/BackLink';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { SHEETS } from '@/config/constants';
import { usePills } from '@/content/hooks';
import { NotFoundPage } from '@/features/not-found';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { formatDate } from '@/lib/format';
import { slugify } from '@/lib/text';

const PillDetailPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const routes = useRoutes();
  const pills = usePills();
  const pill = pills.getPillBySlug(slug);

  if (!pill) return <NotFoundPage />;

  const { newer, older } = pills.getAdjacentPills(pill.slug);
  const sections = pill.content.flatMap((block) => (block.type === 'h2' ? [block.text] : []));

  return (
    <>
      <PageHero
        sheet={SHEETS.pills}
        label={t.pills.badge}
        title={pill.title}
        description={pill.summary}
        back={<BackLink to={routes.pills}>{t.pills.backToList}</BackLink>}
      >
        <div className="reveal mt-10 flex flex-wrap items-center gap-4 [--reveal-delay:0.6s]">
          <time dateTime={pill.date} className="annotation text-muted-foreground">
            {formatDate(pill.date, locale)}
          </time>
          <ul className="flex flex-wrap gap-2" aria-label={t.pills.tags}>
            {pill.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">#{tag}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </PageHero>

      <section className="sheet pt-12 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {sections.length > 1 && (
            <Reveal delay={0.5} className="hidden lg:col-span-3 lg:block">
              <nav aria-label={t.pills.contents} className="sticky top-28">
                <p className="mb-4 annotation text-muted-foreground">{t.pills.contents}</p>
                <ol className="space-y-2 border-l border-border">
                  {sections.map((section, index) => (
                    <li key={section}>
                      <a
                        href={`#${slugify(section)}`}
                        className="group -ml-px flex gap-3 border-l border-transparent py-1 pl-4 text-sm text-muted-foreground focus-ring transition-colors hover:border-brand hover:text-foreground"
                      >
                        <span aria-hidden="true" className="annotation text-brand">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {section}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          )}

          <article className="lg:col-span-8 lg:col-start-5">
            <ContentRenderer content={pill.content} />
          </article>
        </div>

        <div className="mt-24 md:mt-32">
          <AdjacentNav
            label={t.pills.adjacent}
            previous={
              newer && { to: routes.pill(newer.slug), label: t.pills.newer, title: newer.title }
            }
            next={
              older && { to: routes.pill(older.slug), label: t.pills.older, title: older.title }
            }
          />
        </div>
      </section>
    </>
  );
};

export { PillDetailPage };
