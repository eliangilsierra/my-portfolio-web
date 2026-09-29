import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    // GitHub Pages serves project sites from /<repository>/, so the base path is configurable.
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
