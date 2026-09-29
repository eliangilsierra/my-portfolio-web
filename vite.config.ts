import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import { validateContent } from './scripts/vite-plugin-validate-content.ts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    // Must match `basename` in react-router.config.ts.
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: 8080,
    },
    build: {
      // Small font files would be inlined as data: URIs, which the Content-Security-Policy
      // (font-src 'self') rightly refuses. Emit every font as a real file instead.
      assetsInlineLimit: (filePath: string) => (/\.woff2?$/.test(filePath) ? false : undefined),
    },
    plugins: [validateContent(), tailwindcss(), reactRouter()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  };
});
