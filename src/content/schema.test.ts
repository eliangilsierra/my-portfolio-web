import aboutJson from './data/about.json';
import pillsJson from './data/pills.json';
import projectsJson from './data/projects.json';
import { rawContentSchema } from './schema';

const validContent = () =>
  structuredClone({ projects: projectsJson, pills: pillsJson, about: aboutJson });

describe('content schema', () => {
  it('accepts the bundled content', () => {
    expect(rawContentSchema.safeParse(validContent()).success).toBe(true);
  });

  it('rejects a project that is missing a translation', () => {
    const content = validContent();
    // @ts-expect-error - deliberately corrupting the data
    delete content.projects[0].translations.es;

    const result = rawContentSchema.safeParse(content);

    expect(result.success).toBe(false);
  });

  it('rejects duplicate project slugs', () => {
    const content = validContent();
    content.projects[1]!.slug = content.projects[0]!.slug;

    expect(rawContentSchema.safeParse(content).success).toBe(false);
  });

  it('rejects gallery images without a matching alt text', () => {
    const content = validContent();
    const project = content.projects.find((item) => item.gallery.length > 0)!;
    project.translations.en.galleryAlts = [];

    expect(rawContentSchema.safeParse(content).success).toBe(false);
  });

  it('rejects malformed slugs, dates and urls', () => {
    const content = validContent();
    content.projects[0]!.slug = 'Not A Slug';
    content.pills[0]!.date = '01/08/2025';
    content.about.links.github = 'not-a-url';

    const result = rawContentSchema.safeParse(content);

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThanOrEqual(3);
  });
});
