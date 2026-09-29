import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-[9rem] w-full rounded-sm border border-input bg-card/70 px-4 py-3 text-base transition-colors placeholder:text-muted-foreground hover:border-border-strong focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
