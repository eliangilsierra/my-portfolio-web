import { ArrowUpRight, Mail } from 'lucide-react';
import { useState } from 'react';
import { CropMarks } from '@/components/blueprint/CropMarks';
import { PageHero } from '@/components/content/HeroSection';
import { GithubIcon, LinkedinIcon, type IconComponent } from '@/components/icons/BrandIcons';
import { Reveal } from '@/components/motion/Reveal';
import { SHEETS } from '@/config/constants';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { buildMailto } from '@/lib/mailto';
import { ContactForm } from './ContactForm';

interface Channel {
  label: string;
  value: string;
  href: string;
  icon: IconComponent;
  external: boolean;
}

function ChannelLink({ channel, openInNewTab }: { channel: Channel; openInNewTab: string }) {
  const Icon = channel.icon;
  return (
    <a
      href={channel.href}
      className="group flex items-center justify-between gap-6 border-b border-border py-6 focus-ring"
      {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="flex min-w-0 flex-col gap-2">
        <span className="flex items-center gap-2 annotation text-muted-foreground group-hover:text-brand">
          <Icon className="size-3.5" aria-hidden="true" />
          {channel.label}
        </span>
        <span className="truncate font-heading text-xl font-semibold tracking-tight md:text-2xl">
          {channel.value}
        </span>
      </span>
      <ArrowUpRight
        className="size-6 shrink-0 text-muted-foreground transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand"
        aria-hidden="true"
      />
      {channel.external && <span className="sr-only"> {openInNewTab}</span>}
    </a>
  );
}

const withoutProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

const ContactPage = () => {
  const { t } = useI18n();
  const { links } = useAbout();
  // Bumping the key remounts the form, which is how "send another message" starts from a clean state.
  const [formKey, setFormKey] = useState(0);

  const channels: Channel[] = [
    {
      label: t.contact.form.email,
      value: links.email,
      href: buildMailto(links.email, {
        subject: t.contact.mailto.subject,
        body: t.contact.mailto.body,
      }),
      icon: Mail,
      external: false,
    },
    {
      label: 'LinkedIn',
      value: withoutProtocol(links.linkedin),
      href: links.linkedin,
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: 'GitHub',
      value: withoutProtocol(links.github),
      href: links.github,
      icon: GithubIcon,
      external: true,
    },
  ];

  return (
    <>
      <PageHero
        sheet={SHEETS.contact}
        label={t.contact.badge}
        title={t.contact.title}
        description={t.contact.description}
      />

      <section className="sheet pt-16 md:pt-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal delay={0.4} className="lg:col-span-5">
            <h2 className="mb-2 annotation text-muted-foreground">
              <span className="text-brand">A</span> / {t.contact.channels}
            </h2>
            <div className="border-t border-border-strong">
              {channels.map((channel) => (
                <ChannelLink
                  key={channel.label}
                  channel={channel}
                  openInNewTab={t.a11y.openInNewTab}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.55} className="lg:col-span-6 lg:col-start-7">
            <h2 className="mb-6 annotation text-muted-foreground">
              <span className="text-brand">B</span> / {t.contact.formTitle}
            </h2>
            <div className="relative border border-border-strong bg-card/80 p-6 md:p-10">
              <CropMarks className="-m-2" />
              <ContactForm
                key={formKey}
                email={links.email}
                onReset={() => setFormKey((key) => key + 1)}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export { ContactPage };
