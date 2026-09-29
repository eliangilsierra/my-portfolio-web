import { act, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from '@/i18n/I18nProvider';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render';
import { ThemeToggle } from './ThemeToggle';

/** A controllable stand-in for the operating system colour scheme. */
function mockSystemScheme(initiallyDark: boolean) {
  let matches = initiallyDark;
  const listeners = new Set<() => void>();

  vi.spyOn(window, 'matchMedia').mockImplementation(
    () =>
      ({
        get matches() {
          return matches;
        },
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      }) as unknown as MediaQueryList,
  );

  return (dark: boolean) => {
    matches = dark;
    listeners.forEach((listener) => {
      listener();
    });
  };
}

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
    vi.restoreAllMocks();
  });

  it('switches between light and dark and stores the choice', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('theme', 'light');
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');

    await user.click(screen.getByRole('button', { name: /switch to light mode/i }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('starts from the system scheme when nothing is stored', () => {
    mockSystemScheme(true);
    renderWithProviders(<ThemeToggle />);

    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('follows the system while the visitor has not chosen', () => {
    const setSystemDark = mockSystemScheme(false);
    renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();

    act(() => {
      setSystemDark(true);
    });

    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('ignores the system once the visitor has chosen', () => {
    const setSystemDark = mockSystemScheme(false);
    window.localStorage.setItem('theme', 'light');
    renderWithProviders(<ThemeToggle />);

    act(() => {
      setSystemDark(true);
    });

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('renders on the server, where there is no DOM to read the theme from', () => {
    const html = renderToString(
      <I18nProvider locale="en">
        <ThemeToggle />
      </I18nProvider>,
    );

    // Server output is the light theme; the inline script and the hook take over in the browser.
    expect(html).toContain('Switch to dark mode');
  });

  it('labels the control in the active language', () => {
    window.localStorage.setItem('theme', 'light');
    renderWithProviders(<ThemeToggle />, { locale: 'es' });

    expect(screen.getByRole('button', { name: /cambiar a modo oscuro/i })).toBeInTheDocument();
  });
});
