import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/motion/Reveal';
import { staggerDelay } from '@/components/motion/stagger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import type { Pill } from '@/content/types';
import { useI18n } from '@/i18n/useI18n';
import { formatDate } from '@/lib/format';

interface PillCardProps {
  pill: Pill;
  index?: number;
}

export function PillCard({ pill, index = 0 }: PillCardProps) {
  const { t, locale } = useI18n();

  return (
    <Reveal inView delay={staggerDelay(index)} className="h-full">
      <Card className="group glass flex h-full flex-col transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={pill.date}>{formatDate(pill.date, locale)}</time>
          </div>
          <h3 className="font-heading text-xl font-bold transition-colors group-hover:text-brand">
            {pill.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{pill.summary}</p>

          <ul className="flex flex-wrap gap-2" aria-label={t.pills.tags}>
            {pill.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button asChild variant="ghost" size="sm" className="group/btn w-full">
            <Link to={ROUTES.pill(pill.slug)}>
              {t.common.readMore}
              <span className="sr-only">: {pill.title}</span>
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Reveal>
  );
}
