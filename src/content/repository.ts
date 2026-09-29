import type { Locale } from '@/i18n/locale';
import type { RawAbout, RawContent, RawPill, RawProject } from './schema';
import type { About, Pill, Project } from './types';

/**
 * Read-only access to portfolio content for one locale.
 * The UI depends on this interface, not on where the content comes from,
 * so swapping JSON for a CMS or API only requires a new implementation.
 */
export interface ContentRepository {
  getProjects(): Project[];
  getProjectBySlug(slug: string): Project | undefined;
  getFeaturedProjects(limit: number): Project[];
  getPills(): Pill[];
  getPillBySlug(slug: string): Pill | undefined;
  /** Neighbours in publication order: `newer` was published after, `older` before. */
  getAdjacentPills(slug: string): { newer?: Pill; older?: Pill };
  getLatestPills(limit: number): Pill[];
  getAbout(): About;
}

function toProject(raw: RawProject, locale: Locale): Project {
  const { title, excerpt, highlights, content, galleryAlts } = raw.translations[locale];
  return {
    slug: raw.slug,
    type: raw.type,
    title,
    excerpt,
    tech: raw.tech,
    year: raw.year,
    featured: raw.featured,
    coverImage: raw.coverImage,
    repoUrl: raw.repoUrl,
    demoUrl: raw.demoUrl,
    highlights,
    content,
    gallery: raw.gallery.map((src, index) => ({ src, alt: galleryAlts[index] ?? '' })),
  };
}

function toPill(raw: RawPill, locale: Locale): Pill {
  const { title, summary, content } = raw.translations[locale];
  return { slug: raw.slug, title, summary, date: raw.date, tags: raw.tags, content };
}

function toAbout(raw: RawAbout, locale: Locale): About {
  return {
    name: raw.name,
    tagline: raw.translations[locale].tagline,
    bio: raw.translations[locale].bio,
    skills: raw.skills,
    certifications: raw.certifications,
    timeline: raw.timeline.map(({ year, event }) => ({ year, event: event[locale] })),
    links: raw.links,
  };
}

export function createContentRepository(raw: RawContent, locale: Locale): ContentRepository {
  // Newest first. `Array.prototype.sort` is stable, so equal keys keep their authoring order.
  const projects = raw.projects
    .map((project) => toProject(project, locale))
    .sort((a, b) => b.year - a.year);
  const pills = raw.pills
    .map((pill) => toPill(pill, locale))
    .sort((a, b) => b.date.localeCompare(a.date));
  const about = toAbout(raw.about, locale);

  return {
    getProjects: () => projects,
    getProjectBySlug: (slug) => projects.find((project) => project.slug === slug),
    getFeaturedProjects: (limit) => projects.filter((project) => project.featured).slice(0, limit),
    getPills: () => pills,
    getPillBySlug: (slug) => pills.find((pill) => pill.slug === slug),
    getAdjacentPills: (slug) => {
      const index = pills.findIndex((pill) => pill.slug === slug);
      if (index === -1) return {};
      return { newer: pills[index - 1], older: pills[index + 1] };
    },
    getLatestPills: (limit) => pills.slice(0, limit),
    getAbout: () => about,
  };
}
