import type { Config } from '@react-router/dev/config';
import { loadEnv } from 'vite';
import { getPrerenderPaths } from './scripts/prerender-paths.ts';

// GitHub Pages serves project sites from /<repository>/, so the base path is configurable.
const basePath = loadEnv('production', process.cwd(), 'VITE_').VITE_BASE_PATH || '/';

export default {
  appDirectory: 'src/app',
  basename: basePath,

  // Static hosting: render every route to HTML at build time, no server at runtime.
  ssr: false,
  prerender: getPrerenderPaths,

  // Lazy route discovery needs a server endpoint, which a static host does not have.
  routeDiscovery: { mode: 'initial' },
} satisfies Config;
