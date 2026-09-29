import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, type RouteObject } from 'react-router';
import { ErrorBoundary as RootErrorBoundary, HydrateFallback } from './root';
import LocaleLayout, { ErrorBoundary as LocaleErrorBoundary } from './routes/locale-layout';

function Bomb(): never {
  throw new Error('boom');
}

function renderRoutes(routes: RouteObject[], route: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [route] })} />,
  );
}

describe('error boundaries', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('inside a language', () => {
    const routes = (child: RouteObject): RouteObject[] => [
      {
        path: '/:lang',
        Component: LocaleLayout,
        ErrorBoundary: LocaleErrorBoundary,
        children: [child],
      },
    ];

    it('keeps the site frame and speaks the language of the page', async () => {
      renderRoutes(routes({ index: true, Component: Bomb }), '/es');

      expect(await screen.findByRole('alert')).toHaveTextContent(/algo salió mal/i);
      expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    });

    it('shows the not-found page for a 404 response', async () => {
      renderRoutes(
        routes({
          index: true,
          loader: () => {
            // Throwing a Response is how React Router models an HTTP error such as a 404.
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('nope', { status: 404 });
          },
          Component: () => null,
        }),
        '/en',
      );

      expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    });
  });

  describe('at the root', () => {
    it('still shows a recovery screen, in the language of the URL when there is one', async () => {
      renderRoutes(
        [
          {
            path: '/:lang',
            ErrorBoundary: RootErrorBoundary,
            children: [{ index: true, Component: Bomb }],
          },
        ],
        '/es',
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(/algo salió mal/i);
    });

    it('defaults to English when the URL has no language', async () => {
      renderRoutes([{ path: '/', ErrorBoundary: RootErrorBoundary, Component: Bomb }], '/');

      expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
    });

    it('logs what went wrong', async () => {
      renderRoutes([{ path: '/', ErrorBoundary: RootErrorBoundary, Component: Bomb }], '/');
      await screen.findByRole('alert');

      expect(console.error).toHaveBeenCalledWith(
        '[portfolio] Unhandled route error',
        expect.any(Error),
      );
    });
  });

  it('announces loading to assistive technology while a fallback page hydrates', () => {
    render(<HydrateFallback />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });
});
