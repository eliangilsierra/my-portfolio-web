import type { ProjectType } from '@/domain/project';

/**
 * English is the source of truth for the dictionary shape.
 * Every other locale is typed as `Dictionary`, so a missing key is a compile error.
 */
export const en = {
  meta: {
    home: {
      title: 'Full-stack developer',
      description:
        'Portfolio of a full-stack developer specialised in Java, Spring Boot, React and scalable architectures.',
    },
    projects: {
      title: 'Projects',
      description:
        'Selected work in full-stack development, cloud architecture and distributed systems.',
    },
    pills: {
      title: 'Pills',
      description:
        'Short technical notes: learnings, solutions and reflections from software development.',
    },
    about: {
      title: 'About me',
      description: 'Skills, certifications and career timeline.',
    },
    contact: {
      title: 'Contact',
      description: 'Get in touch for collaborations and opportunities.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you are looking for does not exist.',
    },
  },

  a11y: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    toggleMenu: 'Toggle menu',
    closeMenu: 'Close menu',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    changeLanguage: 'Change language',
    viewRepository: 'View repository',
    viewDemo: 'View demo',
    openInNewTab: '(opens in a new tab)',
    codeExample: 'Code example',
    loading: 'Loading…',
  },

  nav: {
    home: 'Home',
    projects: 'Projects',
    pills: 'Pills',
    about: 'About',
    contact: 'Contact',
  },

  sheet: {
    label: 'Sheet',
    revision: 'Rev.',
    endOfSheet: 'End of sheet',
    scroll: 'Scroll',
  },

  footer: {
    quickLinks: 'Quick links',
    connect: 'Connect',
    copyright: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
    builtWith: 'Built with React, TypeScript and Tailwind CSS.',
    backToTop: 'Back to top',
  },

  common: {
    readMore: 'Read more',
    viewMore: 'View more',
    repository: 'Repository',
    liveDemo: 'Live demo',
  },

  projectTypes: {
    all: 'All',
    fullstack: 'Full-stack',
    frontend: 'Frontend',
    backend: 'Backend',
    ml: 'Machine learning',
    iot: 'IoT',
  } satisfies Record<'all' | ProjectType, string>,

  home: {
    availability: 'Available for projects',
    greeting: 'Hi, I am',
    viewProjects: 'View projects',
    contactMe: 'Get in touch',
    featured: {
      badge: 'Selected work',
      title: 'Latest work',
      description: 'A selection of projects that reflect my full-stack experience.',
      viewAll: 'View all projects',
    },
    capabilities: {
      badge: 'Capabilities',
      title: 'From interface to infrastructure',
      description: 'The tools I work with, grouped by the layer of the system they serve.',
    },
    latest: {
      badge: 'Knowledge pills',
      title: 'Latest posts',
      description: 'Reflections, learnings and day-to-day technical solutions.',
      viewAll: 'View all pills',
    },
    closing: {
      badge: 'Next step',
      title: "Let's build something",
      cta: 'Start a conversation',
      email: 'Write me an email',
    },
  },

  projects: {
    badge: 'Portfolio',
    title: 'Projects',
    description:
      'Explore my work in full-stack development, cloud architecture and distributed systems.',
    searchPlaceholder: 'Search by title, technology or description…',
    empty: 'No projects match your search.',
    backToList: 'Back to projects',
    techStack: 'Tech stack',
    highlights: 'Highlights',
    gallery: 'Gallery',
    details: 'Project data',
    type: 'Type',
    year: 'Year',
    links: 'Links',
    figure: 'Fig.',
    caseStudy: 'Case study',
    adjacent: 'More projects',
    previous: 'Previous project',
    next: 'Next project',
  },

  pills: {
    badge: 'Knowledge',
    title: 'Pills',
    description: 'Learnings, technical solutions and reflections from software development.',
    searchPlaceholder: 'Search by title or tag…',
    empty: 'No pills match your search.',
    backToList: 'Back to pills',
    newer: 'Newer',
    older: 'Older',
    tags: 'Tags',
    contents: 'Contents',
    adjacent: 'More pills',
  },

  about: {
    badge: 'Profile',
    title: 'About me',
    approach: 'Approach',
    skills: 'Skills',
    skillsDescription: 'Grouped by the layer of the system they serve.',
    certifications: 'Certifications',
    timeline: 'Timeline',
    timelineColumns: {
      revision: 'Rev.',
      year: 'Year',
      change: 'Change',
    },
    skillGroups: {
      frontend: 'Frontend',
      backend: 'Backend',
      devops: 'DevOps',
      dataAi: 'Data & AI',
    },
  },

  callouts: {
    info: 'Note',
    warning: 'Caution',
    success: 'Result',
  },

  search: {
    label: 'Search',
    filterByType: 'Filter by type',
  },

  contact: {
    badge: 'Contact',
    title: "Let's talk",
    description: 'Have a project in mind? I am available for collaborations and opportunities.',
    channels: 'Direct channels',
    formTitle: 'Send a message',
    form: {
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      message: 'Message',
      messagePlaceholder: 'Tell me about your project…',
      submit: 'Send message',
      sending: 'Sending…',
      openEmail: 'Open email app',
      sendAnother: 'Send another message',
      requiredNote: '* Required fields',
    },
    validation: {
      nameMin: (min: number) => `Name must be at least ${min} characters`,
      nameMax: (max: number) => `Name must be at most ${max} characters`,
      emailInvalid: 'Invalid email address',
      emailMax: (max: number) => `Email must be at most ${max} characters`,
      messageMin: (min: number) => `Message must be at least ${min} characters`,
      messageMax: (max: number) => `Message must be at most ${max} characters`,
    },
    success: 'Message received! I will get back to you soon.',
    error:
      'Something went wrong while sending your message. Please try again or use the email button.',
    demoNotice:
      'Demo mode: this form is not connected to a backend yet, so messages are not delivered. Use "Open email app" to reach me.',
    alsoFindMe: {
      before: 'You can also find me on',
      and: 'or',
    },
    mailto: {
      subject: 'Contact from your portfolio',
      body: 'Hi, I would like to get in touch…',
    },
  },

  landing: {
    welcome: 'Welcome',
    chooseLanguage: 'Choose your language to continue.',
    continueIn: 'Continue in English',
  },

  notFound: {
    code: '404',
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
  },

  errorBoundary: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while rendering this page.',
    reload: 'Reload page',
  },
};

export type Dictionary = typeof en;
