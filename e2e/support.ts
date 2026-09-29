import type { Page } from '@playwright/test';

export const LOCALES = ['en', 'es'] as const;

/** Every kind of page, relative to the base URL and the language. */
export const PAGE_PATHS = [
  '',
  'projects/',
  'projects/sivia-visual-inspection/',
  'pills/',
  'pills/flyway-idempotent-inserts/',
  'about/',
  'contact/',
];

/**
 * Records anything that would betray a broken deployment: console errors (which include
 * Content-Security-Policy violations), uncaught exceptions, failed requests and requests to
 * other origins.
 */
export function watchForProblems(page: Page, baseURL: string | undefined): string[] {
  const problems: string[] = [];
  const origin = new URL(baseURL ?? 'http://localhost').origin;

  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console error: ${message.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`uncaught exception: ${error.message}`));
  page.on('requestfailed', (request) =>
    problems.push(
      `request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`,
    ),
  );
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) {
      problems.push(`third-party request: ${request.url()}`);
    }
  });

  return problems;
}
