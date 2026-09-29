import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { LanguagePicker } from './LanguagePicker';

function renderPicker(variant: 'welcome' | 'not-found') {
  return render(
    <MemoryRouter>
      <LanguagePicker variant={variant} />
    </MemoryRouter>,
  );
}

describe('LanguagePicker', () => {
  it('welcomes the visitor in every language, each one a plain link', () => {
    renderPicker('welcome');

    expect(screen.getByRole('heading', { level: 1, name: 'My Portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue in English' })).toHaveAttribute(
      'href',
      '/en',
    );
    expect(screen.getByRole('link', { name: 'Continuar en español' })).toHaveAttribute(
      'href',
      '/es',
    );
  });

  it('marks each block with its own language for screen readers', () => {
    const { container } = renderPicker('welcome');

    expect(container.querySelector('section[lang="es"]')).not.toBeNull();
    expect(container.querySelector('section[lang="en"]')).not.toBeNull();
  });

  it('explains a missing page in every language', () => {
    renderPicker('not-found');

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
  });

  it('remembers the language the visitor picks', async () => {
    const user = userEvent.setup();
    renderPicker('welcome');

    await user.click(screen.getByRole('link', { name: 'Continuar en español' }));

    expect(window.localStorage.getItem('locale')).toBe('es');
  });
});
