import path from 'node:path';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// Kept separate from vite.config.ts: tests need neither the build plugins nor the deployment base.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Playwright specs live in e2e/ and run with `npm run e2e`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/vite-env.d.ts',
        // Build-time only: it renders every page to HTML during `react-router build`, which the
        // build itself, scripts/verify-build.mjs and the e2e tests exercise.
        'src/app/entry.server.tsx',
      ],
      // The build fails when coverage drops below these floors (the suite currently sits a little above).
      thresholds: {
        statements: 97,
        lines: 97,
        functions: 97,
        branches: 90,
      },
    },
  },
});
