import { z } from 'zod';
// Relative imports with explicit extensions on purpose: this module is also loaded by the Vite config
// (content validation plugin), where neither the `@/` alias nor extensionless resolution exists.
import { CALLOUT_VARIANTS, type ContentBlock } from '../domain/content-block.ts';
import type { Locale } from '../domain/locale.ts';
import { PROJECT_TYPES } from '../domain/project.ts';

/**
 * Content is authored once per entity with a translation for every supported locale.
 * The schemas below make a missing translation a load-time error instead of a blank UI.
 */

const nonEmpty = z.string().trim().min(1);

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case');

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD');

/** Build a `{ es, en }` object schema so every locale is required. */
const localized = <T extends z.ZodType>(schema: T) =>
  z.object({ es: schema, en: schema } satisfies Record<Locale, T>);

/** Typed against the domain union so schema and domain can never drift apart. */
export const contentBlockSchema: z.ZodType<ContentBlock> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('h2'), text: nonEmpty }),
  z.object({ type: z.literal('h3'), text: nonEmpty }),
  z.object({ type: z.literal('p'), text: nonEmpty }),
  z.object({ type: z.literal('ul'), items: z.array(nonEmpty).min(1) }),
  z.object({
    type: z.literal('callout'),
    variant: z.enum(CALLOUT_VARIANTS).default('info'),
    text: nonEmpty,
  }),
  z.object({ type: z.literal('code'), language: z.string().optional(), text: nonEmpty }),
]);

const projectTypeSchema = z.enum(PROJECT_TYPES);

const rawProjectSchema = z
  .object({
    slug: slugSchema,
    type: projectTypeSchema,
    tech: z.array(nonEmpty).min(1),
    year: z.number().int().min(2000),
    featured: z.boolean().default(false),
    /** Path relative to `public/`. */
    coverImage: z.string().optional(),
    repoUrl: z.url().nullable(),
    demoUrl: z.url().nullable(),
    /** Paths relative to `public/`; alt texts live in the translations. */
    gallery: z.array(nonEmpty).default([]),
    translations: localized(
      z.object({
        title: nonEmpty,
        excerpt: nonEmpty,
        highlights: z.array(nonEmpty).default([]),
        content: z.array(contentBlockSchema).min(1),
        galleryAlts: z.array(nonEmpty).default([]),
      }),
    ),
  })
  .superRefine((project, ctx) => {
    for (const [locale, translation] of Object.entries(project.translations)) {
      if (translation.galleryAlts.length !== project.gallery.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['translations', locale, 'galleryAlts'],
          message: `expected ${project.gallery.length} alt texts (one per gallery image)`,
        });
      }
    }
  });

const rawPillSchema = z.object({
  slug: slugSchema,
  date: isoDateSchema,
  tags: z.array(nonEmpty).min(1),
  translations: localized(
    z.object({
      title: nonEmpty,
      summary: nonEmpty,
      content: z.array(contentBlockSchema).min(1),
    }),
  ),
});

const rawAboutSchema = z.object({
  name: nonEmpty,
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    email: z.email(),
  }),
  skills: z.object({
    frontend: z.array(nonEmpty),
    backend: z.array(nonEmpty),
    devops: z.array(nonEmpty),
    dataAi: z.array(nonEmpty),
  }),
  certifications: z.array(nonEmpty),
  timeline: z.array(z.object({ year: z.number().int(), event: localized(nonEmpty) })),
  translations: localized(z.object({ tagline: nonEmpty, bio: nonEmpty })),
});

const uniqueSlugs = (items: { slug: string }[]) =>
  new Set(items.map((item) => item.slug)).size === items.length;

export const rawContentSchema = z.object({
  projects: z.array(rawProjectSchema).refine(uniqueSlugs, 'project slugs must be unique'),
  pills: z.array(rawPillSchema).refine(uniqueSlugs, 'pill slugs must be unique'),
  about: rawAboutSchema,
});

export type RawContent = z.infer<typeof rawContentSchema>;
export type RawProject = RawContent['projects'][number];
export type RawPill = RawContent['pills'][number];
export type RawAbout = RawContent['about'];
