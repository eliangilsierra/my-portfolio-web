import { renderHook } from '@testing-library/react';
import { useAbout, usePills, useProjects } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { useContactService } from '@/services/contact/ContactServiceContext';

describe('hooks outside their provider', () => {
  beforeEach(() => {
    // React logs the error it rethrows; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const cases: [name: string, hook: () => unknown, message: RegExp][] = [
    ['useI18n', () => useI18n(), /I18nProvider/],
    ['useProjects', () => useProjects(), /ContentProvider/],
    ['usePills', () => usePills(), /ContentProvider/],
    ['useAbout', () => useAbout(), /ContentProvider/],
    ['useContactService', () => useContactService(), /ContactServiceContext/],
  ];

  it.each(cases)('%s explains what is missing', (_name, hook, message) => {
    expect(() => renderHook(hook)).toThrow(message);
  });
});
