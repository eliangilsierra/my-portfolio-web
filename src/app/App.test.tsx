import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/render';

describe('App', () => {
  it('renders the home page with featured content', async () => {
    renderApp();

    expect(await screen.findByRole('heading', { level: 1, name: /hi, i am/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /latest work/i })).toBeInTheDocument();
    expect(document.title).toContain('Full-stack developer');
  });

  it('navigates from the projects list to a project page', async () => {
    const user = userEvent.setup();
    renderApp({ route: '/projects' });
    await screen.findByRole('heading', { level: 1, name: 'Projects' });

    await user.click(screen.getAllByRole('link', { name: /view more: sivia/i })[0]!);

    expect(
      await screen.findByRole('heading', { level: 1, name: /sivia — ai visual inspection/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to projects/i })).toBeInTheDocument();
  });

  it('filters projects by type and search text', async () => {
    const user = userEvent.setup();
    renderApp({ route: '/projects' });
    await screen.findByRole('heading', { level: 1, name: 'Projects' });

    await user.click(screen.getByRole('button', { name: 'Machine learning' }));

    expect(screen.getByText('Crop Disease Classifier')).toBeInTheDocument();
    expect(screen.queryByText('IoT Rural Cloud Platform')).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), 'zzzz');
    expect(screen.getByText(/no projects match your search/i)).toBeInTheDocument();
  });

  it('shows a pill with its neighbours', async () => {
    renderApp({ route: '/pills/flyway-idempotent-inserts' });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /flyway: patterns for idempotent inserts/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Newer')).toBeInTheDocument();
    expect(screen.getByText('Older')).toBeInTheDocument();
  });

  it.each(['/nope', '/projects/nope', '/pills/nope'])(
    'shows the 404 page for %s',
    async (route) => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      renderApp({ route });

      expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    },
  );

  it('marks the current page in the navigation', async () => {
    renderApp({ route: '/about' });
    await screen.findByRole('heading', { level: 1, name: 'About me' });

    const nav = screen.getByRole('navigation', { name: /main navigation/i });

    expect(within(nav).getAllByRole('link', { current: 'page' })[0]).toHaveTextContent('About');
  });

  it('switches language and remembers the choice', async () => {
    const user = userEvent.setup();
    renderApp({ route: '/projects' });
    await screen.findByRole('heading', { level: 1, name: 'Projects' });

    await user.click(screen.getByRole('button', { name: /change language/i }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Proyectos' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');
    expect(window.localStorage.getItem('locale')).toBe('es');
    expect(screen.getByText('Clasificador de enfermedades en cultivos')).toBeInTheDocument();
  });

  it('exposes a skip link to the main content', async () => {
    renderApp();
    await screen.findByRole('heading', { level: 1 });

    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });
});
