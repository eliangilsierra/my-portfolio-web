import { render } from '@testing-library/react';
import type { RouteConfigEntry } from '@react-router/dev/routes';
import type { ComponentType, ReactElement } from 'react';
import {
  Outlet,
  RouterProvider,
  createMemoryRouter,
  type LoaderFunction,
  type RouteObject,
} from 'react-router';
import routeConfig from '@/app/routes';
import { RootProviders } from '@/app/RootProviders';
import { ContentProvider } from '@/content/ContentProvider';
import type { Locale } from '@/domain/locale';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { ContactService } from '@/services/contact/contact-service';

interface RouteModule {
  default: ComponentType;
  ErrorBoundary?: ComponentType;
  clientLoader?: LoaderFunction;
}

// Every route module, loaded on demand exactly like the framework does.
const modules = import.meta.glob<RouteModule>('../app/routes/*.tsx');

/** Turns the real route table (`src/app/routes.ts`) into router objects, so tests use what ships. */
function toRouteObjects(entries: readonly RouteConfigEntry[]): RouteObject[] {
  return entries.map((entry) => {
    const load = modules[`../app/${entry.file}`];
    if (!load) throw new Error(`No route module found for ${entry.file}`);

    const common = {
      id: entry.id,
      path: entry.path,
      lazy: async () => {
        const module = await load();
        return {
          Component: module.default,
          ErrorBoundary: module.ErrorBoundary,
          loader: module.clientLoader,
        };
      },
    };

    return entry.index
      ? { ...common, index: true }
      : { ...common, children: entry.children ? toRouteObjects(entry.children) : undefined };
  });
}

interface RenderAppOptions {
  /** Address to start on, including the language, e.g. `/en/projects`. */
  route?: string;
  contactService?: ContactService;
}

/** Renders the application (root providers plus the real route table) at a given address. */
export function renderApp({ route = '/en', contactService }: RenderAppOptions = {}) {
  const router = createMemoryRouter(
    [
      {
        element: (
          <RootProviders contactService={contactService}>
            <Outlet />
          </RootProviders>
        ),
        children: toRouteObjects(routeConfig),
      },
    ],
    { initialEntries: [route] },
  );

  return { router, ...render(<RouterProvider router={router} />) };
}

interface RenderWithProvidersOptions {
  locale?: Locale;
  contactService?: ContactService;
}

/** Renders a single element with the language, content and root providers, but no router. */
export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', contactService }: RenderWithProvidersOptions = {},
) {
  return render(
    <RootProviders contactService={contactService}>
      <I18nProvider locale={locale}>
        <ContentProvider>{ui}</ContentProvider>
      </I18nProvider>
    </RootProviders>,
  );
}
