import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { RevealText } from '@/components/motion/RevealText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useMagnetic } from '@/components/motion/useMagnetic';
import { Button } from '@/components/ui/button';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { buildMailto } from '@/lib/mailto';

/** The last section of the home sheet: one oversized invitation and two ways to act on it. */
export function ClosingCta() {
  const { t } = useI18n();
  const routes = useRoutes();
  const { links } = useAbout();
  const primary = useMagnetic<HTMLAnchorElement>();
  const secondary = useMagnetic<HTMLAnchorElement>();
  const mailto = buildMailto(links.email, {
    subject: t.contact.mailto.subject,
    body: t.contact.mailto.body,
  });

  return (
    <section aria-labelledby="closing-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bp-grid bp-grid-fade" />
      <div className="sheet py-24 md:py-40">
        <p className="mb-10 annotation text-muted-foreground">
          <span className="text-brand">04</span> / {t.home.closing.badge}
        </p>
        <RevealText as="h2" id="closing-title" className="max-w-[14ch] text-headline font-bold">
          {t.home.closing.title}
        </RevealText>

        <ScrollReveal className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lead text-muted-foreground">{t.contact.description}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link ref={primary} to={routes.contact} viewTransition>
                {t.home.closing.cta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a ref={secondary} href={mailto}>
                {t.home.closing.email}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
