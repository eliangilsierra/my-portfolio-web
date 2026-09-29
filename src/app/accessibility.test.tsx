import { screen } from '@testing-library/react';
import { LOCALES } from '@/domain/locale';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderApp } from '@/test/render';

const PATHS = [
  '',
  '/projects',
  '/projects/sivia-visual-inspection',
  '/projects/crop-disease-classifier',
  '/pills',
  '/pills/flyway-idempotent-inserts',
  '/about',
  '/contact',
  '/not-a-page',
];

describe.each(LOCALES)('accessibility (%s)', (locale) => {
  it.each(PATHS)('has no axe violations on %s', async (path) => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderApp({ route: `/${locale}${path}` });
    await screen.findByRole('heading', { level: 1 });

    await expectNoA11yViolations();
  });
});

describe('pages outside a language', () => {
  it('has no axe violations on the language-less not-found page', async () => {
    renderApp({ route: '/fr/whatever' });
    await screen.findByRole('heading', { level: 1, name: '404' });

    await expectNoA11yViolations();
  });
});
