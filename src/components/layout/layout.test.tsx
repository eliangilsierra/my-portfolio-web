import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockMedia } from '@/test/media';
import { renderApp, renderWithProviders } from '@/test/render';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('class');
  document.documentElement.removeAttribute('style');
});

async function openMenu() {
  const user = userEvent.setup();
  renderApp({ route: '/en' });
  // Let the lazily loaded page settle first, so nothing re-renders underneath the open menu.
  await screen.findByRole('heading', { level: 1 });
  const toggle = screen.getByRole('button', { name: /toggle menu/i });
  await user.click(toggle);
  const menu = document.getElementById('mobile-menu')!;
  return { user, toggle, menu };
}

describe('mobile menu', () => {
  it('moves focus into the menu and locks the page scroll while open', async () => {
    // Without motion: in jsdom GSAP briefly re-parents elements it measures (jsdom has no layout),
    // which would drop focus. The real-browser behaviour is covered by the e2e suite.
    mockMedia({ reducedMotion: true });
    const { menu } = await openMenu();

    await waitFor(() => expect(within(menu).getAllByRole('link')[0]).toHaveFocus());
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('closes from its own button, plays its exit and gives focus back to the toggle', async () => {
    mockMedia({});
    const { user, toggle, menu } = await openMenu();

    await user.click(within(menu).getByRole('button', { name: /close menu/i }));

    await waitFor(() => expect(document.getElementById('mobile-menu')).toBeNull());
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('closes with Escape at once when motion is reduced', async () => {
    mockMedia({ reducedMotion: true });
    const { menu } = await openMenu();

    fireEvent(menu, new Event('cancel', { cancelable: true }));
    // A second request while closing is ignored.
    fireEvent(menu, new Event('cancel', { cancelable: true }));

    expect(document.getElementById('mobile-menu')).toBeNull();
  });
});

describe('mobile menu current page', () => {
  it.each([
    ['/en/', 'Home'],
    ['/en/projects/sivia-visual-inspection', 'Projects'],
  ])('marks the section of %s, trailing slash included', async (route, current) => {
    mockMedia({ reducedMotion: true });
    const user = userEvent.setup();
    renderApp({ route });
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: /toggle menu/i }));

    const menu = document.getElementById('mobile-menu')!;
    expect(within(menu).getByRole('link', { current: 'page' })).toHaveTextContent(current);
  });
});

describe('header', () => {
  it('tucks away while reading down and comes back when scrolling up', async () => {
    mockMedia({});
    renderApp({ route: '/en' });
    await screen.findByRole('heading', { level: 1 });
    const header = document.querySelector('header')!;
    const scrollTo = (y: number) =>
      act(async () => {
        Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
        fireEvent.scroll(window);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });

    await scrollTo(1000);
    expect(header).toHaveAttribute('data-scrolled', 'true');
    expect(header).toHaveAttribute('data-hidden', 'true');

    await scrollTo(900);
    expect(header).toHaveAttribute('data-hidden', 'false');

    await scrollTo(0);
    expect(header).toHaveAttribute('data-scrolled', 'false');
  });
});

describe('theme transition', () => {
  it('spreads the new theme from the button where the browser supports view transitions', async () => {
    mockMedia({});
    window.localStorage.setItem('theme', 'light');
    const animate = vi.fn();
    document.documentElement.animate = animate;
    let finish: () => void = () => undefined;
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return {
        ready: Promise.resolve(),
        finished: new Promise<void>((resolve) => (finish = resolve)),
      };
    });
    Object.assign(document, { startViewTransition });
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.documentElement).toHaveClass('dark', 'theme-transition');
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    expect(animate.mock.calls[0]?.[1]).toMatchObject({
      pseudoElement: '::view-transition-new(root)',
    });

    finish();
    await waitFor(() => expect(document.documentElement).not.toHaveClass('theme-transition'));
    Reflect.deleteProperty(document, 'startViewTransition');
  });
});
