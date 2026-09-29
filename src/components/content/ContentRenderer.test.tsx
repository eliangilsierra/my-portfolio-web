import { screen } from '@testing-library/react';
import type { ContentBlock } from '@/domain/content-block';
import { renderWithProviders } from '@/test/render';
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
    renderWithProviders(<ContentRenderer content={blocks} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Heading two' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Heading three' })).toBeInTheDocument();
    expect(screen.getByText('A paragraph')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Careful now')).toBeInTheDocument();
    expect(screen.getByText('const a = 1;')).toHaveAttribute('data-language', 'ts');
  });

  it('makes code blocks focusable, labelled groups so keyboard users can scroll them', () => {
    renderWithProviders(<ContentRenderer content={[{ type: 'code', text: 'const a = 1;' }]} />, {
      locale: 'es',
    });

    const block = screen.getByRole('group', { name: 'Ejemplo de código' });
    expect(block).toHaveAttribute('tabindex', '0');
    expect(block).toHaveTextContent('const a = 1;');
  });

  it('renders markup in text as plain text', () => {
    renderWithProviders(
      <ContentRenderer content={[{ type: 'p', text: '<img src=x onerror=alert(1)>' }]} />,
    );

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('renders every callout variant as a labelled note, not a live alert', () => {
    renderWithProviders(
      <ContentRenderer
        content={[
          { type: 'callout', variant: 'info', text: 'Info note' },
          { type: 'callout', variant: 'warning', text: 'Warning note' },
          { type: 'callout', variant: 'success', text: 'Success note' },
        ]}
      />,
    );

    const notes = screen.getAllByRole('note');
    expect(notes).toHaveLength(3);
    expect(notes.map((note) => note.firstChild?.textContent)).toEqual([
      'Note',
      'Caution',
      'Result',
    ]);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('gives second-level headings an id, so a table of contents can link to them', () => {
    renderWithProviders(<ContentRenderer content={[{ type: 'h2', text: 'Diseño de la API' }]} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'diseno-de-la-api');
  });

  it('fails loudly on a block type it does not know', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const unknown = [{ type: 'video', text: 'x' }] as unknown as ContentBlock[];

    expect(() => renderWithProviders(<ContentRenderer content={unknown} />)).toThrow(
      /Unsupported content block/,
    );
    vi.restoreAllMocks();
  });
});
