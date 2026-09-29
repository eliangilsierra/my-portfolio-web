import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/lib/utils';

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface FilterBarProps<T extends string> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  options?: FilterOption<T>[];
  selectedOption?: T;
  onOptionChange?: (value: T) => void;
}

/** Search field plus optional type filters, drawn as the layer selector of a CAD tool. */
export function FilterBar<T extends string = string>({
  searchQuery,
  onSearchChange,
  placeholder,
  options,
  selectedOption,
  onOptionChange,
}: FilterBarProps<T>) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search
          className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label={t.search.label}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-11"
        />
      </div>

      {options && onOptionChange && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.search.filterByType}>
          {options.map((option) => {
            const selected = selectedOption === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onOptionChange(option.value)}
                className={cn(
                  'inline-flex h-11 items-center gap-2 rounded-sm border px-3.5 annotation focus-ring transition-colors',
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-1.5 transition-colors',
                    selected ? 'bg-accent' : 'bg-muted-foreground/50',
                  )}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
