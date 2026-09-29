import type { ContentBlock } from './content-block.ts';

export const PROJECT_TYPES = ['fullstack', 'frontend', 'backend', 'ml', 'iot'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface GalleryImage {
  src: string;
  alt: string;
}

/** A portfolio project resolved for a single locale. */
export interface Project {
  slug: string;
  type: ProjectType;
  title: string;
  excerpt: string;
  tech: string[];
  year: number;
  featured: boolean;
  coverImage?: string | undefined;
  repoUrl: string | null;
  demoUrl: string | null;
  highlights: string[];
  content: ContentBlock[];
  gallery: GalleryImage[];
}
