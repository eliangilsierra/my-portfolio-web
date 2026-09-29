import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/useI18n';

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
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label={t.search.label}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10 glass"
        />
      </div>

      {options && onOptionChange && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.search.filterByType}>
          {options.map((option) => (
            <Button
              key={option.value}
              variant={selectedOption === option.value ? 'default' : 'outline'}
              size="sm"
              aria-pressed={selectedOption === option.value}
              onClick={() => onOptionChange(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
