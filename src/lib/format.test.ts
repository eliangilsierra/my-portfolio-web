import { formatDate } from './format';

describe('formatDate', () => {
  it('formats ISO dates in the requested locale', () => {
    expect(formatDate('2025-08-01', 'en')).toBe('August 1, 2025');
    expect(formatDate('2025-08-01', 'es')).toBe('1 de agosto de 2025');
  });

  it('does not shift the day across timezones', () => {
    expect(formatDate('2025-01-01', 'en')).toBe('January 1, 2025');
  });
});
