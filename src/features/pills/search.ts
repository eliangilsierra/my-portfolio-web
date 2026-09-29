import type { Pill } from '@/content/types';
import { normalizeText } from '@/lib/text';

export function filterPills(pills: Pill[], query: string): Pill[] {
  const needle = normalizeText(query);
  if (!needle) return pills;

  return pills.filter((pill) =>
    normalizeText([pill.title, pill.summary, ...pill.tags].join(' ')).includes(needle),
  );
}
