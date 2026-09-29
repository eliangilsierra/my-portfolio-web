import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { LOCALES, PAGE_PATHS } from './support';

const THEMES = ['light', 'dark'] as const;

// Real browser, real colours: this is where colour contrast is verified (jsdom cannot).
// Motion is reduced so scroll-driven reveals are not caught half-transparent.
test.use({ reducedMotion: 'reduce' });

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });

    for (const locale of LOCALES) {
      for (const path of PAGE_PATHS) {
        test(`${locale}/${path} has no accessibility violations`, async ({ page }) => {
          await page.goto(`${locale}/${path}`);
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
            .analyze();

          expect(
            results.violations.map(
              (violation) =>
                `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
            ),
          ).toEqual([]);
        });
      }
    }

    test('the language-less not-found page has no accessibility violations', async ({ page }) => {
      await page.goto('fr/anything');
      await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();

      expect(results.violations.map((violation) => violation.id)).toEqual([]);
    });
  });
}
