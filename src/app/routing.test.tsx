import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/render';

function browserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
}

describe('routing', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('language', () => {
    it.each([
      ['/en', /hi, i am/i],
      ['/es', /hola, soy/i],
    ])('renders the home page at %s in its own language', async (route, heading) => {
      renderApp({ route });

      expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    });

    it('sets the document language to the page language, also when the language changes', async () => {
      const user = userEvent.setup();
      renderApp({ route: '/es/projects' });
      await screen.findByRole('heading', { level: 1, name: 'Proyectos' });
      expect(document.documentElement.lang).toBe('es');

      await user.click(screen.getByRole('link', { name: /cambiar idioma/i }));
      await screen.findByRole('heading', { level: 1, name: 'Projects' });

      expect(document.documentElement.lang).toBe('en');
    });

    it('sends the site root to the language of the browser', async () => {
      browserLanguages(['es-MX', 'en']);
      const { router } = renderApp({ route: '/' });

      expect(
        await screen.findByRole('heading', { level: 1, name: /hola, soy/i }),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/es');
    });

    it('prefers the language the visitor chose before', async () => {
      window.localStorage.setItem('locale', 'en');
      browserLanguages(['es']);
      const { router } = renderApp({ route: '/' });

      await screen.findByRole('heading', { level: 1, name: /hi, i am/i });
      expect(router.state.location.pathname).toBe('/en');
    });

    it('switches language with a real link that keeps the page and remembers the choice', async () => {
      const user = userEvent.setup();
      const { router } = renderApp({ route: '/en/projects' });
      await screen.findByRole('heading', { level: 1, name: 'Projects' });

      const toggle = screen.getByRole('link', { name: /change language/i });
      expect(toggle).toHaveAttribute('href', '/es/projects');
      await user.click(toggle);

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Proyectos' }),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/es/projects');
      expect(window.localStorage.getItem('locale')).toBe('es');
      expect(screen.getByText('Clasificador de enfermedades en cultivos')).toBeInTheDocument();
    });

    it('keeps every internal link inside the current language', async () => {
      renderApp({ route: '/es/projects/sivia-visual-inspection' });
      await screen.findByRole('heading', { level: 1 });

      const internal = screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href') ?? '')
        .filter((href) => href.startsWith('/') && !href.startsWith('//'));

      expect(internal.length).toBeGreaterThan(5);
      // Only the language switch may point at the other language.
      const offenders = internal.filter(
        (href) => !href.startsWith('/es') && !href.startsWith('/en'),
      );
      expect(offenders).toEqual([]);
      expect(internal.filter((href) => href.startsWith('/en'))).toEqual([
        '/en/projects/sivia-visual-inspection',
      ]);
    });
  });

  describe('pages', () => {
    it('renders the home page with featured content', async () => {
      renderApp({ route: '/en' });

      expect(await screen.findByRole('heading', { name: /latest work/i })).toBeInTheDocument();
    });

    it('navigates from the projects list to a project page', async () => {
      const user = userEvent.setup();
      renderApp({ route: '/en/projects' });
      await screen.findByRole('heading', { level: 1, name: 'Projects' });

      await user.click(screen.getAllByRole('link', { name: /view more: sivia/i })[0]!);

      expect(
        await screen.findByRole('heading', { level: 1, name: /sivia — ai visual inspection/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to projects/i })).toHaveAttribute(
        'href',
        '/en/projects',
      );
    });

    it('filters projects by type and search text', async () => {
      const user = userEvent.setup();
      renderApp({ route: '/en/projects' });
      await screen.findByRole('heading', { level: 1, name: 'Projects' });

      await user.click(screen.getByRole('button', { name: 'Machine learning' }));

      expect(screen.getByText('Crop Disease Classifier')).toBeInTheDocument();
      expect(screen.queryByText('IoT Rural Cloud Platform')).not.toBeInTheDocument();

      await user.type(screen.getByRole('searchbox'), 'zzzz');
      expect(screen.getByText(/no projects match your search/i)).toBeInTheDocument();
    });

    it('shows a pill with its neighbours', async () => {
      renderApp({ route: '/en/pills/flyway-idempotent-inserts' });

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /flyway: patterns for idempotent inserts/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('Newer')).toBeInTheDocument();
      expect(screen.getByText('Older')).toBeInTheDocument();
    });
  });

  describe('not found', () => {
    it.each(['/en/nope', '/en/projects/nope', '/en/pills/nope', '/es/a/b/c'])(
      'shows the site not-found page for %s',
      async (route) => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        renderApp({ route });

        expect(
          await screen.findByRole('heading', { name: /página no encontrada|page not found/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /back to home|volver al inicio/i }),
        ).toHaveAttribute('href', route.startsWith('/es') ? '/es' : '/en');
        // The frame stays: a lost visitor can still navigate.
        expect(
          screen.getByRole('navigation', { name: /main navigation|navegación principal/i }),
        ).toBeInTheDocument();
      },
    );

    it('speaks every language when the address has none', async () => {
      renderApp({ route: '/fr/whatever' });

      expect(await screen.findByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Page not found' })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Página no encontrada' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en');
      expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/es');
    });
  });

  describe('navigation', () => {
    it('marks the current page in the navigation', async () => {
      renderApp({ route: '/en/about' });
      await screen.findByRole('heading', { level: 1, name: 'About me' });

      const nav = screen.getByRole('navigation', { name: /main navigation/i });

      expect(within(nav).getAllByRole('link', { current: 'page' })[0]).toHaveTextContent('About');
    });

    it('opens the mobile menu and closes it after navigating', async () => {
      const user = userEvent.setup();
      renderApp({ route: '/en' });
      const toggle = await screen.findByRole('button', { name: /toggle menu/i });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(document.getElementById('mobile-menu')).toBeNull();

      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const menu = document.getElementById('mobile-menu');
      expect(menu).not.toBeNull();

      await user.click(within(menu!).getByRole('link', { name: 'Projects' }));

      await screen.findByRole('heading', { level: 1, name: 'Projects' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(document.getElementById('mobile-menu')).toBeNull();
    });

    it('exposes a skip link to the main content', async () => {
      renderApp({ route: '/en' });
      await screen.findByRole('heading', { level: 1 });

      expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute(
        'href',
        '#main-content',
      );
      expect(document.getElementById('main-content')).not.toBeNull();
    });
  });
});
