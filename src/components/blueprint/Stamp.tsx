import { cn } from '@/lib/utils';

/** An approval stamp: two rings and a check. Decorative. */
export function Stamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      fill="none"
      className={cn('size-14 -rotate-12 text-brand', className)}
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M22 33l7 7 13-15" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
