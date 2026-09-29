import { dictionaries } from '.';

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string' || typeof value === 'function') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function hasEmptyString(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(hasEmptyString);
  }
  return false;
}

describe('dictionaries', () => {
  it('define the same keys in every locale', () => {
    expect(collectKeys(dictionaries.es).sort()).toEqual(collectKeys(dictionaries.en).sort());
  });

  it('contain no empty strings', () => {
    expect(hasEmptyString(dictionaries.en)).toBe(false);
    expect(hasEmptyString(dictionaries.es)).toBe(false);
  });
});
