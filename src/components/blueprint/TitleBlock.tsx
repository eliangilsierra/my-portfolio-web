import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TitleBlockRow {
  label: string;
  value: ReactNode;
}

interface TitleBlockProps {
  title: string;
  rows: TitleBlockRow[];
  className?: string;
}

/** The title block of a drawing: a small labelled table of facts about what the sheet shows. */
export function TitleBlock({ title, rows, className }: TitleBlockProps) {
  return (
    <section className={cn('border border-border-strong bg-card/80', className)}>
      <h2 className="border-b border-border-strong px-5 py-3 annotation">{title}</h2>
      <dl className="divide-y divide-border">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3.5">
            <dt className="pt-0.5 annotation text-muted-foreground">{label}</dt>
            <dd className="col-span-2 text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
