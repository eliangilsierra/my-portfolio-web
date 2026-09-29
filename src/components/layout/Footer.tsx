import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { GithubIcon, LinkedinIcon, type IconComponent } from '@/components/icons/BrandIcons';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { buildMailto } from '@/lib/mailto';
import { NAV_ITEMS, sheetNumber } from './nav-items';

const MAIN_CONTENT_HREF = '#main-content';

interface SocialLinkProps {
  href: string;
  label: string;
  icon: IconComponent;
  external?: boolean;
}

function SocialLink({ href, label, icon: Icon, external = true }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-3 py-1.5 text-sm focus-ring"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="flex items-center gap-3">
        <Icon
          className="size-4 text-muted-foreground transition-colors group-hover:text-brand"
          aria-hidden="true"
        />
        <span className="draw-underline">{label}</span>
      </span>
      <ArrowUpRight
        className="size-3.5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
}

function Cell({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-border p-6 md:p-8 ${className ?? ''}`}>
      <h2 className="mb-6 annotation text-muted-foreground">{label}</h2>
      {children}
    </div>
  );
}

/** The closing title block of every sheet: who drew it, the index, where to reach them. */
export function Footer() {
  const { t, locale } = useI18n();
  const routes = useRoutes();
  const { name, tagline, links } = useAbout();
  const year = new Date().getFullYear();
  const mailto = buildMailto(links.email, {
    subject: t.contact.mailto.subject,
    body: t.contact.mailto.body,
  });

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border-strong md:mt-40">
      <div className="sheet pt-10 pb-8">
        <ScrollReveal
          items="[data-footer-cell]"
          className="grid border border-border md:grid-cols-12 [&>*]:border-b md:[&>*]:border-b-0 md:[&>*+*]:border-l [&>*:last-child]:border-b-0"
        >
          <div data-footer-cell="" className="p-6 md:col-span-5 md:p-8">
            <p className="mb-6 annotation text-muted-foreground">{t.sheet.endOfSheet}</p>
            <p className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">{name}</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">{tagline}</p>
          </div>

          <nav data-footer-cell="" aria-label={t.footer.quickLinks} className="md:col-span-3">
            <Cell label={t.footer.quickLinks}>
              <ul className="space-y-1">
                {(['home', ...NAV_ITEMS] as const).map((key) => (
                  <li key={key}>
                    <Link
                      to={routes[key]}
                      viewTransition
                      className="group flex items-baseline gap-3 py-1.5 text-sm focus-ring"
                    >
                      <span
                        aria-hidden="true"
                        className="annotation text-muted-foreground group-hover:text-brand"
                      >
                        {sheetNumber(key)}
                      </span>
                      <span className="draw-underline">{t.nav[key]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Cell>
          </nav>

          <div data-footer-cell="" className="md:col-span-2">
            <Cell label={t.footer.connect}>
              <div className="space-y-1">
                <SocialLink href={links.github} label="GitHub" icon={GithubIcon} />
                <SocialLink href={links.linkedin} label="LinkedIn" icon={LinkedinIcon} />
                <SocialLink
                  href={mailto}
                  label={t.contact.form.email}
                  icon={Mail}
                  external={false}
                />
              </div>
            </Cell>
          </div>

          <div
            data-footer-cell=""
            className="flex flex-col justify-between gap-8 p-6 md:col-span-2 md:p-8"
          >
            <dl className="space-y-3 annotation">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t.sheet.revision}</dt>
                <dd>{year}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t.sheet.label}</dt>
                <dd>{locale}</dd>
              </div>
            </dl>
            <a
              href={MAIN_CONTENT_HREF}
              className="group inline-flex items-center gap-2 annotation focus-ring hover:text-brand"
            >
              <ArrowUp
                className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              {t.footer.backToTop}
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>{t.footer.copyright(year, name)}</p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.18em] px-2 text-center font-heading text-[19vw] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap outline-text select-none"
      >
        {name}
      </p>
    </footer>
  );
}
