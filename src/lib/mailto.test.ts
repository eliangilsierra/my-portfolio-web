import { buildMailto } from './mailto';

describe('buildMailto', () => {
  it('returns a bare mailto link without options', () => {
    expect(buildMailto('me@example.com')).toBe('mailto:me@example.com');
  });

  it('encodes subject and body exactly once', () => {
    const link = buildMailto('me@example.com', { subject: 'Hi there', body: 'A & B' });

    expect(link).toBe('mailto:me@example.com?subject=Hi%20there&body=A%20%26%20B');
    expect(link.match(/body=/g)).toHaveLength(1);
  });
});
