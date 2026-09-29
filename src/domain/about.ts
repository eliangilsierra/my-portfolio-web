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
