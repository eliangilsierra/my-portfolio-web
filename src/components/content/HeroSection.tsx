import type { CSSProperties, ReactNode } from 'react';
import { CropMarks } from '@/components/blueprint/CropMarks';
import { SplitHeadline } from '@/components/motion/SplitHeadline';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  /** Sheet number of the page, e.g. "01". */
  sheet: string;
  /** Short label printed next to the sheet number. */
  label: string;
  title: string;
  description?: string;
  /** A link back to the parent page, shown on the right of the sheet label. */
  back?: ReactNode;
  /** Inline style for the title, e.g. a `view-transition-name` shared with the previous page. */
  titleStyle?: CSSProperties;
  /** Extra header content under the title (metadata, links, a cover image). */
  children?: ReactNode;
}

/**
 * The header of every page, drawn as the top of a technical sheet: sheet code, an oversized title
 * whose characters rise on load, and a signal line that draws across the bottom edge. Everything
 * here animates in CSS so it plays before hydration.
 */
export function PageHero({
  sheet,
  label,
  title,
  description,
  back,
  titleStyle,
  children,
}: PageHeroProps) {
  const { t } = useI18n();

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />

      <div className="relative sheet pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="reveal mb-14 flex flex-wrap items-center justify-between gap-4 md:mb-24">
          <p className="annotation text-muted-foreground">
            <span className="text-brand">
              {t.sheet.label} {sheet}
            </span>
            <span aria-hidden="true"> — </span>
            {label}
          </p>
          {back}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1
            className={cn(
              'text-headline font-semibold break-words hyphens-auto',
              description ? 'lg:col-span-8' : 'lg:col-span-12',
            )}
            style={titleStyle}
          >
            <SplitHeadline text={title} delay={120} />
          </h1>
          {description && (
            <p
              className="reveal max-w-xl text-lead text-muted-foreground lg:col-span-4"
              style={{ '--reveal-delay': '0.45s' } as CSSProperties}
            >
              {description}
            </p>
          )}
        </div>

        {children}
      </div>

      <CropMarks className="m-3 hidden md:block" />
      <span
        aria-hidden="true"
        className="grow-on-load absolute bottom-0 left-0 signal-line w-full"
        style={{ '--grow-delay': '0.3s' } as CSSProperties}
      />
    </section>
  );
}
