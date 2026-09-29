import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTE_PATTERNS, ROUTES } from '@/config/routes';
import { useI18n } from '@/i18n/useI18n';

const HomePage = lazy(() => import('@/features/home/HomePage'));
const ProjectsPage = lazy(() => import('@/features/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/features/projects/ProjectDetailPage'));
const PillsPage = lazy(() => import('@/features/pills/PillsPage'));
const PillDetailPage = lazy(() => import('@/features/pills/PillDetailPage'));
const AboutPage = lazy(() => import('@/features/about/AboutPage'));
const ContactPage = lazy(() => import('@/features/contact/ContactPage'));
const NotFoundPage = lazy(() => import('@/features/not-found/NotFoundPage'));

function RouteFallback() {
  const { t } = useI18n();

  return (
    <div role="status" aria-busy="true" className="min-h-[60vh]">
      <span className="sr-only">{t.a11y.loading}</span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.projects} element={<ProjectsPage />} />
        <Route path={ROUTE_PATTERNS.projectDetail} element={<ProjectDetailPage />} />
        <Route path={ROUTES.pills} element={<PillsPage />} />
        <Route path={ROUTE_PATTERNS.pillDetail} element={<PillDetailPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
