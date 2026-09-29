import { BrowserRouter } from 'react-router-dom';
import { ROUTER_BASENAME, ROUTER_FUTURE_FLAGS } from '@/config/env';
import { AppProviders } from './AppProviders';
import { AppShell } from './AppShell';

const App = () => (
  <AppProviders>
    <BrowserRouter basename={ROUTER_BASENAME} future={ROUTER_FUTURE_FLAGS}>
      <AppShell />
    </BrowserRouter>
  </AppProviders>
);

export default App;
