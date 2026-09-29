import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/useI18n';

export function ErrorFallback() {
  const { t } = useI18n();

  return (
    <div role="alert" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />
      <div className="sheet py-24 md:py-36">
        <p className="mb-8 annotation text-destructive">{t.sheet.label} — ERR</p>
        <h1 className="text-title font-semibold">{t.errorBoundary.title}</h1>
        <p className="mt-4 mb-10 max-w-md text-lead text-muted-foreground">
          {t.errorBoundary.description}
        </p>
        <Button size="lg" onClick={() => window.location.reload()}>
          <RotateCw aria-hidden="true" />
          {t.errorBoundary.reload}
        </Button>
      </div>
    </div>
  );
}
