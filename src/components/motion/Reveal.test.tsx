import { render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';
import { staggerDelay } from './stagger';

describe('Reveal', () => {
  it('plays on load and always renders its children', () => {
    render(<Reveal>content</Reveal>);

    expect(screen.getByText('content')).toHaveClass('reveal');
  });

  it('exposes the delay to CSS only when there is one', () => {
    const { rerender } = render(<Reveal>content</Reveal>);
    expect(screen.getByText('content').style.getPropertyValue('--reveal-delay')).toBe('');

    rerender(<Reveal delay={0.3}>content</Reveal>);
    expect(screen.getByText('content').style.getPropertyValue('--reveal-delay')).toBe('0.3s');
  });

  it('merges extra classes', () => {
    render(<Reveal className="h-full">content</Reveal>);

    expect(screen.getByText('content')).toHaveClass('reveal', 'h-full');
  });
});

describe('staggerDelay', () => {
  it('grows with the index and is capped so long lists stay snappy', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(2)).toBeCloseTo(0.16);
    expect(staggerDelay(50)).toBe(staggerDelay(6));
  });
});
