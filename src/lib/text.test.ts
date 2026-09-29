import { normalizeText, slugify } from './text';

describe('normalizeText', () => {
  it('lowercases, trims and strips accents', () => {
    expect(normalizeText('  Acción Rápida ')).toBe('accion rapida');
  });
});

describe('slugify', () => {
  it('turns a heading into a URL fragment', () => {
    expect(slugify('Diseño de la API: ¿por qué?')).toBe('diseno-de-la-api-por-que');
    expect(slugify('  Flyway & Spring Boot 3 ')).toBe('flyway-spring-boot-3');
  });
});
