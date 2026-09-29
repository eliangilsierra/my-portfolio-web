import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/useI18n';

export function ErrorFallback() {
  const { t } = useI18n();

  return (
    <div role="alert" className="container mx-auto px-4 py-24 text-center">
      <h1 className="mb-4 font-heading text-3xl font-bold">{t.errorBoundary.title}</h1>
      <p className="mb-8 text-muted-foreground">{t.errorBoundary.description}</p>
      <Button onClick={() => window.location.reload()}>{t.errorBoundary.reload}</Button>
    </div>
  );
}
