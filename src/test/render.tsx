import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { AppShell } from '@/app/AppShell';
import { ROUTER_FUTURE_FLAGS } from '@/config/env';
import type { Locale } from '@/i18n/locale';

interface RenderOptions {
  route?: string;
  locale?: Locale;
}

/** Renders the whole application (providers, layout and routes) at a given route. */
export function renderApp({ route = '/', locale = 'en' }: RenderOptions = {}) {
  return render(
    <AppProviders initialLocale={locale}>
      <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE_FLAGS}>
        <AppShell />
      </MemoryRouter>
    </AppProviders>,
  );
}

/** Renders a single element inside the app providers, without router or layout. */
export function renderWithProviders(ui: ReactElement, { locale = 'en' }: RenderOptions = {}) {
  return render(<AppProviders initialLocale={locale}>{ui}</AppProviders>);
}
