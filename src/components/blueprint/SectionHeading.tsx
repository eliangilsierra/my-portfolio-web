import type { ReactNode } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Two-digit section number, e.g. "01". */
  index: string;
  /** Short label next to the number, e.g. "Selected work". */
  label: string;
  title: string;
  description?: string;
  /** Id for the heading, so the section can be labelled by it. */
  id?: string;
  /** Extra content on the right of the rule (a "view all" link, for instance). */
  aside?: ReactNode;
  className?: string;
}

/**
 * The header every section opens with: a numbered annotation over a drawn rule, then an oversized
 * title that rises line by line.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  id,
  aside,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('mb-12 md:mb-20', className)}>
      <div className="mb-8 flex items-end justify-between gap-6">
        <p className="flex items-center gap-3 annotation text-muted-foreground">
          <span className="text-brand">{index}</span>
          <span aria-hidden="true">/</span>
          <span>{label}</span>
        </p>
        {aside}
      </div>
      <ScrollReveal variant="draw" className="mb-10 h-px bg-border-strong/80 md:mb-14" />
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <RevealText as="h2" id={id} className="text-title font-semibold md:col-span-8">
          {title}
        </RevealText>
        {description && (
          <p className="max-w-md text-muted-foreground md:col-span-4 md:justify-self-end">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
