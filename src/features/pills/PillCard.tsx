import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import type { Pill } from '@/domain/pill';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { formatDate } from '@/lib/format';

interface PillCardProps {
  pill: Pill;
  /** Heading level of the title: 2 under a page title, 3 under a section heading. */
  headingLevel?: 2 | 3;
}

/** One entry of the field log: date, title (the whole row is the link), summary and tags. */
export function PillCard({ pill, headingLevel = 3 }: PillCardProps) {
  const Heading = `h${headingLevel}` as const;
  const { t, locale } = useI18n();
  const routes = useRoutes();

  return (
    <article className="group relative grid grid-cols-12 gap-x-4 gap-y-4 border-b border-border py-8 md:py-10">
      <p className="col-span-12 annotation text-muted-foreground md:col-span-2 md:pt-2">
        <time dateTime={pill.date}>{formatDate(pill.date, locale)}</time>
      </p>

      <div className="col-span-12 md:col-span-7">
        <Heading className="text-2xl leading-tight font-semibold tracking-tight transition-colors duration-300 group-hover:text-brand md:text-[2rem]">
          <Link to={routes.pill(pill.slug)} viewTransition className="stretched-link focus-ring">
            {pill.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-2 max-w-2xl text-muted-foreground">{pill.summary}</p>
      </div>

      <div className="col-span-12 flex items-start justify-between gap-4 md:col-span-3">
        <ul className="flex flex-wrap gap-2" aria-label={t.pills.tags}>
          {pill.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">#{tag}</Badge>
            </li>
          ))}
        </ul>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </div>
    </article>
  );
}
