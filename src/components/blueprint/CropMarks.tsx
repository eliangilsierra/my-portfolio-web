import { cn } from '@/lib/utils';

const CORNERS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
] as const;

interface CropMarksProps {
  className?: string;
  /** Length of each mark, as a Tailwind size class. */
  sizeClassName?: string;
}

/** Registration marks at the four corners of the nearest positioned ancestor. Decorative. */
export function CropMarks({ className, sizeClassName = 'size-3' }: CropMarksProps) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {CORNERS.map((corner) => (
        <span key={corner} className={cn('absolute border-border-strong', sizeClassName, corner)} />
      ))}
    </span>
  );
}
