import type { Dictionary } from './en';

export const es: Dictionary = {
  meta: {
    home: {
      title: 'Desarrollador full-stack',
      description:
        'Portafolio de un desarrollador full-stack especializado en Java, Spring Boot, React y arquitecturas escalables.',
    },
    projects: {
      title: 'Proyectos',
      description:
        'Trabajo seleccionado en desarrollo full-stack, arquitectura cloud y sistemas distribuidos.',
    },
    pills: {
      title: 'Píldoras',
      description:
        'Notas técnicas breves: aprendizajes, soluciones y reflexiones del desarrollo de software.',
    },
    about: {
      title: 'Sobre mí',
      description: 'Habilidades, certificaciones y trayectoria profesional.',
    },
    contact: {
      title: 'Contacto',
      description: 'Ponte en contacto para colaboraciones y oportunidades.',
    },
    notFound: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe.',
    },
  },

  a11y: {
    skipToContent: 'Saltar al contenido',
    mainNavigation: 'Navegación principal',
    toggleMenu: 'Abrir o cerrar el menú',
    switchToDark: 'Cambiar a modo oscuro',
    switchToLight: 'Cambiar a modo claro',
    changeLanguage: 'Cambiar idioma',
    viewRepository: 'Ver repositorio',
    viewDemo: 'Ver demo',
    openInNewTab: '(se abre en una pestaña nueva)',
    codeExample: 'Ejemplo de código',
    loading: 'Cargando…',
  },

  nav: {
    home: 'Inicio',
    projects: 'Proyectos',
    pills: 'Píldoras',
    about: 'Sobre mí',
    contact: 'Contacto',
  },

  footer: {
    quickLinks: 'Enlaces rápidos',
    connect: 'Conéctate',
    copyright: (year, name) => `© ${year} ${name}. Todos los derechos reservados.`,
    builtWith: 'Hecho con React, TypeScript y Tailwind CSS.',
  },

  common: {
    readMore: 'Leer más',
    viewMore: 'Ver más',
    repository: 'Repositorio',
    liveDemo: 'Ver demo',
  },

  projectTypes: {
    all: 'Todos',
    fullstack: 'Full-stack',
    frontend: 'Frontend',
    backend: 'Backend',
    ml: 'Machine learning',
    iot: 'IoT',
  },

  home: {
    availability: 'Disponible para proyectos',
    greeting: 'Hola, soy',
    viewProjects: 'Ver proyectos',
    contactMe: 'Contactar',
    featured: {
      badge: 'Proyectos destacados',
      title: 'Últimos trabajos',
      description:
        'Una selección de proyectos que reflejan mi experiencia en desarrollo full-stack.',
      viewAll: 'Ver todos los proyectos',
    },
    latest: {
      badge: 'Píldoras de conocimiento',
      title: 'Últimas publicaciones',
      description: 'Reflexiones, aprendizajes y soluciones técnicas del día a día.',
      viewAll: 'Ver todas las píldoras',
    },
  },

  projects: {
    badge: 'Portafolio',
    title: 'Proyectos',
    description:
      'Explora mi trabajo en desarrollo full-stack, arquitecturas cloud y sistemas distribuidos.',
    searchPlaceholder: 'Buscar por título, tecnología o descripción…',
    empty: 'No se encontraron proyectos que coincidan con tu búsqueda.',
    backToList: 'Volver a proyectos',
    techStack: 'Stack tecnológico',
    highlights: 'Destacados',
    gallery: 'Galería',
  },

  pills: {
    badge: 'Conocimiento',
    title: 'Píldoras',
    description: 'Aprendizajes, soluciones técnicas y reflexiones del desarrollo de software.',
    searchPlaceholder: 'Buscar por título o etiqueta…',
    empty: 'No se encontraron píldoras que coincidan con tu búsqueda.',
    backToList: 'Volver a píldoras',
    newer: 'Más reciente',
    older: 'Más antigua',
    tags: 'Etiquetas',
  },

  about: {
    badge: 'Perfil',
    title: 'Sobre mí',
    skills: 'Habilidades',
    certifications: 'Certificaciones',
    timeline: 'Trayectoria',
    skillGroups: {
      frontend: 'Frontend',
      backend: 'Backend',
      devops: 'DevOps',
      dataAi: 'Datos e IA',
    },
  },

  search: {
    label: 'Buscar',
    filterByType: 'Filtrar por tipo',
  },

  contact: {
    badge: 'Contacto',
    title: 'Hablemos',
    description:
      '¿Tienes un proyecto en mente? Estoy disponible para colaboraciones y oportunidades.',
    form: {
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@email.com',
      message: 'Mensaje',
      messagePlaceholder: 'Cuéntame sobre tu proyecto…',
      submit: 'Enviar mensaje',
      sending: 'Enviando…',
      openEmail: 'Abrir app de correo',
      sendAnother: 'Enviar otro mensaje',
      requiredNote: '* Campos obligatorios',
    },
    validation: {
      nameMin: (min) => `El nombre debe tener al menos ${min} caracteres`,
      nameMax: (max) => `El nombre debe tener como máximo ${max} caracteres`,
      emailInvalid: 'Correo electrónico no válido',
      emailMax: (max) => `El correo debe tener como máximo ${max} caracteres`,
      messageMin: (min) => `El mensaje debe tener al menos ${min} caracteres`,
      messageMax: (max) => `El mensaje debe tener como máximo ${max} caracteres`,
    },
    success: '¡Mensaje recibido! Te responderé pronto.',
    error: 'Algo salió mal al enviar tu mensaje. Inténtalo de nuevo o usa el botón de correo.',
    demoNotice:
      'Modo demo: este formulario aún no está conectado a un backend, así que los mensajes no se entregan. Usa "Abrir app de correo" para escribirme.',
    alsoFindMe: {
      before: 'También puedes encontrarme en',
      and: 'o',
    },
    mailto: {
      subject: 'Contacto desde tu portafolio',
      body: 'Hola, me gustaría ponerme en contacto…',
    },
  },

  landing: {
    welcome: 'Bienvenido',
    chooseLanguage: 'Elige tu idioma para continuar.',
    continueIn: 'Continuar en español',
  },

  notFound: {
    code: '404',
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha cambiado de lugar.',
    backHome: 'Volver al inicio',
  },

  errorBoundary: {
    title: 'Algo salió mal',
    description: 'Ocurrió un error inesperado al mostrar esta página.',
    reload: 'Recargar página',
  },
};
