import { render } from '@testing-library/react';
import { expectNoA11yViolations } from './a11y';

describe('expectNoA11yViolations', () => {
  it('fails when the document has an accessibility problem', async () => {
    document.documentElement.lang = 'en';
    document.title = 'Probe';
    render(
      <main>
        <h1>Title</h1>
        {/* Deliberately inaccessible: no alt text and an unlabelled button. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src="/x.png" />
        <button />
      </main>,
    );

    await expect(expectNoA11yViolations()).rejects.toThrow(/image-alt/);
  });

  it('passes for an accessible document', async () => {
    document.documentElement.lang = 'en';
    document.title = 'Probe';
    render(
      <main>
        <h1>Title</h1>
        <img src="/x.png" alt="A diagram" />
        <button>Save</button>
      </main>,
    );

    await expectNoA11yViolations();
  });
});
