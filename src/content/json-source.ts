import type { Locale } from '@/domain/locale';
import aboutJson from './data/about.json';
import pillsJson from './data/pills.json';
import projectsJson from './data/projects.json';
import { createContentRepository, type ContentRepository } from './repository';
import type { RawContent } from './schema';

/**
 * The JSON is validated against `rawContentSchema` by the `validateContent` Vite plugin when the
 * build or dev server starts (and by the test suite), so this cast is checked at build time and
 * the runtime bundle does not need to ship a schema library.
 */
export const rawContent = {
  projects: projectsJson,
  pills: pillsJson,
  about: aboutJson,
} as unknown as RawContent;

export function createJsonContentRepository(locale: Locale): ContentRepository {
  return createContentRepository(rawContent, locale);
}
