import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

/** "Back to the list" link printed in the sheet header of detail pages. */
export function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      viewTransition
      className="group inline-flex h-11 items-center gap-2 annotation text-muted-foreground focus-ring hover:text-foreground"
    >
      <ArrowLeft
        className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
