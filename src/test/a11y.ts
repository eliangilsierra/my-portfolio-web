import axe from 'axe-core';

/**
 * Runs axe-core against the whole document and fails with a readable list of violations.
 *
 * `color-contrast` is disabled because jsdom has no layout or computed colours; contrast is
 * verified against the real design tokens in a browser (see docs/development.md).
 */
export async function expectNoA11yViolations(): Promise<void> {
  const results = await axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
    rules: {
      'color-contrast': { enabled: false },
      // The <html lang> and <title> come from the document shell (root.tsx) and route `meta`, which
      // component tests do not render. `scripts/verify-build.mjs` checks them on the real HTML.
      'document-title': { enabled: false },
      'html-has-lang': { enabled: false },
    },
  });

  if (results.violations.length > 0) {
    const summary = results.violations.map(
      (violation) =>
        `- ${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    );
    throw new Error(`Accessibility violations found:\n${summary.join('\n')}`);
  }
}
