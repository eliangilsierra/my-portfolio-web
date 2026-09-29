import { defineConfig, devices } from '@playwright/test';

/** The site is tested under a base path, exactly like a GitHub Pages project site. */
const BASE_PATH = '/my-portfolio-web/';
const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

// CI installs Playwright's own Chromium; locally the installed Chrome is used, so nothing is downloaded.
const channel = process.env.CI ? undefined : 'chrome';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: `${ORIGIN}${BASE_PATH}`,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],

  // Serves build/client with GitHub Pages semantics. Run `npm run e2e` to build first.
  webServer: {
    command: 'node scripts/preview.mjs',
    url: `${ORIGIN}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    env: { VITE_BASE_PATH: BASE_PATH, PORT: String(PORT) },
  },
});
