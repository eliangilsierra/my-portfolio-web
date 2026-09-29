import { normalizeText } from './text';

describe('normalizeText', () => {
  it('lowercases, trims and strips accents', () => {
    expect(normalizeText('  Acción Rápida ')).toBe('accion rapida');
  });
});
