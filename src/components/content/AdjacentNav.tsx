import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

export interface AdjacentItem {
  to: string;
  /** Small label above the title, e.g. "Previous project". */
  label: string;
  title: string;
}

interface AdjacentNavProps {
  /** Accessible name of the navigation region. */
  label: string;
  previous?: AdjacentItem;
  next?: AdjacentItem;
}

function AdjacentLink({ item, direction }: { item: AdjacentItem; direction: 'previous' | 'next' }) {
  const Arrow = direction === 'previous' ? ArrowLeft : ArrowRight;
  return (
    <Link
      to={item.to}
      viewTransition
      className={cn(
        'group flex h-full flex-col gap-4 p-6 focus-ring transition-colors hover:bg-card md:p-10',
        direction === 'next' && 'md:items-end md:text-right',
      )}
    >
      <span className="flex items-center gap-2 annotation text-muted-foreground group-hover:text-brand">
        {direction === 'previous' && (
          <Arrow
            className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden="true"
          />
        )}
        {item.label}
        {direction === 'next' && (
          <Arrow
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="max-w-md font-heading text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
        {item.title}
      </span>
    </Link>
  );
}

/** Previous and next entries at the end of a detail page, drawn as the two halves of one strip. */
export function AdjacentNav({ label, previous, next }: AdjacentNavProps) {
  return (
    <nav
      aria-label={label}
      className="grid border-y border-border-strong md:grid-cols-2 [&>*+*]:border-t md:[&>*+*]:border-t-0 md:[&>*+*]:border-l"
    >
      <div>{previous && <AdjacentLink item={previous} direction="previous" />}</div>
      <div>{next && <AdjacentLink item={next} direction="next" />}</div>
    </nav>
  );
}
