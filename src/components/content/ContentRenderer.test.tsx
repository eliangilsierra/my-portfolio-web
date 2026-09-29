import { render, screen } from '@testing-library/react';
import type { ContentBlock } from '@/content/types';
import { ContentRenderer } from './ContentRenderer';

const blocks: ContentBlock[] = [
  { type: 'h2', text: 'Heading two' },
  { type: 'h3', text: 'Heading three' },
  { type: 'p', text: 'A paragraph' },
  { type: 'ul', items: ['first', 'second'] },
  { type: 'callout', variant: 'warning', text: 'Careful now' },
  { type: 'code', language: 'ts', text: 'const a = 1;' },
];

describe('ContentRenderer', () => {
  it('renders every block type', () => {
    render(<ContentRenderer content={blocks} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Heading two' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Heading three' })).toBeInTheDocument();
    expect(screen.getByText('A paragraph')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Careful now')).toBeInTheDocument();
    expect(screen.getByText('const a = 1;')).toHaveAttribute('data-language', 'ts');
  });

  it('renders markup in text as plain text', () => {
    render(<ContentRenderer content={[{ type: 'p', text: '<img src=x onerror=alert(1)>' }]} />);

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });
});
