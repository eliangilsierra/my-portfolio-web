import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const TONES = {
  brand: 'bg-brand/10 text-brand',
  accent: 'bg-accent/10 text-accent',
} as const;

export type BadgeTone = keyof typeof TONES;

interface SectionBadgeProps {
  icon: LucideIcon;
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

/** Small pill with an icon, used above page and section titles. */
export function SectionBadge({
  icon: Icon,
  tone = 'brand',
  children,
  className,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
        TONES[tone],
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
