import type { ContentBlock, ProjectType } from './schema';

export type { ContentBlock, ProjectType };

export interface GalleryImage {
  src: string;
  alt: string;
}

/** A project resolved for a single locale. */
export interface Project {
  slug: string;
  type: ProjectType;
  title: string;
  excerpt: string;
  tech: string[];
  year: number;
  featured: boolean;
  coverImage?: string;
  repoUrl: string | null;
  demoUrl: string | null;
  highlights: string[];
  content: ContentBlock[];
  gallery: GalleryImage[];
}

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

export interface SkillGroups {
  frontend: string[];
  backend: string[];
  devops: string[];
  dataAi: string[];
}

export interface About {
  name: string;
  tagline: string;
  bio: string;
  skills: SkillGroups;
  certifications: string[];
  timeline: { year: number; event: string }[];
  links: {
    github: string;
    linkedin: string;
    /** Plain address, without the `mailto:` scheme. */
    email: string;
  };
}
