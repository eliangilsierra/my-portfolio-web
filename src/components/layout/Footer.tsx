import { Mail } from 'lucide-react';
import { Link } from 'react-router';
import { GithubIcon, LinkedinIcon, type IconComponent } from '@/components/icons/BrandIcons';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { useRoutes } from '@/i18n/useRoutes';
import { buildMailto } from '@/lib/mailto';

const QUICK_LINKS = ['home', 'projects', 'pills', 'contact'] as const;

const SOCIAL_LINK_CLASSES =
  'rounded-lg p-1 text-muted-foreground transition-all hover:scale-110 hover:text-brand focus-ring';

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
      className={SOCIAL_LINK_CLASSES}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}

export function Footer() {
  const { t } = useI18n();
  const routes = useRoutes();
  const { name, tagline, links } = useAbout();
  const mailto = buildMailto(links.email, {
    subject: t.contact.mailto.subject,
    body: t.contact.mailto.body,
  });

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-xs">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <p className="gradient-text font-heading text-lg font-bold">{name}</p>
            <p className="max-w-xs text-sm text-muted-foreground">{tagline}</p>
          </div>

          <nav aria-label={t.footer.quickLinks} className="space-y-4">
            <h2 className="font-heading text-sm font-semibold tracking-wider uppercase">
              {t.footer.quickLinks}
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((key) => (
                <li key={key}>
                  <Link
                    to={routes[key]}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <h2 className="font-heading text-sm font-semibold tracking-wider uppercase">
              {t.footer.connect}
            </h2>
            <div className="flex space-x-4">
              <SocialLink href={links.github} label="GitHub" icon={GithubIcon} />
              <SocialLink href={links.linkedin} label="LinkedIn" icon={LinkedinIcon} />
              <SocialLink href={mailto} label={t.contact.form.email} icon={Mail} external={false} />
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-1 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{t.footer.copyright(new Date().getFullYear(), name)}</p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
