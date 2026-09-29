import type { Locale } from '@/i18n/locale';
import aboutJson from './data/about.json';
import pillsJson from './data/pills.json';
import projectsJson from './data/projects.json';
import { createContentRepository, type ContentRepository } from './repository';
import { rawContentSchema } from './schema';

/** Validated once at module load: malformed content fails fast with a readable error. */
const rawContent = rawContentSchema.parse({
  projects: projectsJson,
  pills: pillsJson,
  about: aboutJson,
});

export function createJsonContentRepository(locale: Locale): ContentRepository {
  return createContentRepository(rawContent, locale);
}

export { rawContent };
