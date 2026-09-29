import { expect, test } from '@playwright/test';
import { LOCALES, PAGE_PATHS, watchForProblems } from './support';

test.describe('deployment', () => {
  for (const locale of LOCALES) {
    for (const path of PAGE_PATHS) {
      test(`${locale}/${path} loads cleanly: no CSP violations, errors or third-party requests`, async ({
        page,
        baseURL,
      }) => {
        const problems = watchForProblems(page, baseURL);

        const response = await page.goto(`${locale}/${path}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        // Let hydration, lazy chunks and fonts settle.
        await page.waitForLoadState('networkidle');

        expect(response?.status()).toBe(200);
        expect(problems).toEqual([]);
      });
    }
  }

  test('every page is readable before any script runs', async ({ page }) => {
    await page.route('**/assets/**/*.js', (route) => route.abort());
    await page.route('**/*.js', (route) => route.abort());

    await page.goto('es/projects/');

    await expect(page.getByRole('heading', { level: 1, name: 'Proyectos' })).toBeVisible();
    await expect(page.getByText('SIVIA — Inspección Visual con IA').first()).toBeVisible();
  });

  test('serves the fallback with a 404 status for unknown addresses, and still renders them', async ({
    page,
  }) => {
    const unknownProject = await page.goto('es/projects/does-not-exist');
    expect(unknownProject?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();

    const unknownLanguage = await page.goto('fr/whatever');
    expect(unknownLanguage?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 2, name: 'Page not found' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Página no encontrada' }),
    ).toBeVisible();
  });

  test('redirects trailing-slash-less directory URLs like GitHub Pages does', async ({
    request,
  }) => {
    const response = await request.get('en/projects', { maxRedirects: 0 });

    expect(response.status()).toBe(301);
    expect(response.headers().location).toMatch(/\/en\/projects\/$/);
  });

  test('publishes robots.txt and a favicon', async ({ request }) => {
    expect((await request.get('robots.txt')).ok()).toBe(true);
    expect((await request.get('favicon.ico')).ok()).toBe(true);
  });
});

test.describe('language', () => {
  test.describe('Spanish browser', () => {
    test.use({ locale: 'es-ES' });

    test('the site root sends the visitor to Spanish', async ({ page }) => {
      await page.goto('');

      await expect(page).toHaveURL(/\/my-portfolio-web\/es$/);
      await expect(page.getByRole('heading', { level: 1, name: /hola, soy/i })).toBeVisible();
    });
  });

  test.describe('unsupported browser language', () => {
    test.use({ locale: 'fr-FR' });

    test('the site root falls back to English', async ({ page }) => {
      await page.goto('');

      await expect(page).toHaveURL(/\/my-portfolio-web\/en$/);
    });
  });

  test('the language switch keeps the page, updates the document and is remembered', async ({
    page,
  }) => {
    await page.goto('en/projects/');
    await page.getByRole('link', { name: /change language/i }).click();

    await expect(page).toHaveURL(/\/es\/projects\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Proyectos' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page).toHaveTitle(/Proyectos · My Portfolio/);

    // The next visit to the root goes straight to the remembered language.
    await page.goto('');
    await expect(page).toHaveURL(/\/es$/);
  });
});

test.describe('theme', () => {
  test.use({ colorScheme: 'dark' });

  test('follows the system before any script bundle loads (no light flash)', async ({ page }) => {
    await page.route('**/*.js', (route) => route.abort());

    await page.goto('en/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('a manual choice beats the system and survives a reload', async ({ page }) => {
    await page.goto('en/');
    await page.getByRole('button', { name: /switch to light mode/i }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await page.reload();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.getByRole('button', { name: /switch to dark mode/i })).toBeVisible();
  });
});

test.describe('interaction', () => {
  test('navigates client-side between pages without a full reload', async ({ page }) => {
    await page.goto('en/');
    await page.evaluate(() => {
      Object.assign(globalThis, { __marker: 'same-document' });
    });

    // The desktop header holds the link; on a phone it lives in the menu.
    const menu = page.getByRole('button', { name: /toggle menu/i });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole('link', { name: 'Projects', exact: true }).first().click();

    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
    expect(await page.evaluate(() => (globalThis as { __marker?: string }).__marker)).toBe(
      'same-document',
    );
  });

  test('filters projects', async ({ page }) => {
    await page.goto('en/projects/');

    await page.getByRole('button', { name: 'Machine learning' }).click();

    await expect(page.getByRole('heading', { name: 'Crop Disease Classifier' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'IoT Rural Cloud Platform' })).toHaveCount(0);
  });

  test('the skip link is the first thing a keyboard user reaches', async ({ page }) => {
    await page.goto('en/');

    await page.keyboard.press('Tab');

    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused();
  });

  test('the contact form validates, then sends in demo mode', async ({ page, baseURL }) => {
    const problems = watchForProblems(page, baseURL);
    await page.goto('en/contact/');

    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: /^name/i })).toBeFocused();

    await page.getByRole('textbox', { name: /^name/i }).fill('Ada Lovelace');
    await page.getByRole('textbox', { name: /^email/i }).fill('ada@example.com');
    await page
      .getByRole('textbox', { name: /^message/i })
      .fill('Hello, I would like to talk about a project.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/message received/i)).toBeVisible();
    expect(problems).toEqual([]);
  });
});
