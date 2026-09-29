import type { ContentBlock } from './content-block';

/** A knowledge pill (short technical article) resolved for a single locale. */
export interface Pill {
  slug: string;
  title: string;
  summary: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  tags: string[];
  content: ContentBlock[];
}
