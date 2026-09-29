import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/layout/Layout';
import { AppRoutes } from './AppRoutes';

/** Router-agnostic application frame: layout, error handling and routes. */
export function AppShell() {
  return (
    <ErrorBoundary>
      <Layout>
        <AppRoutes />
      </Layout>
    </ErrorBoundary>
  );
}
