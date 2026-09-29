import { Mail } from 'lucide-react';
import { useState } from 'react';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { ContactForm } from './ContactForm';

const ContactPage = () => {
  const { t } = useI18n();
  const { links } = useAbout();
  // Bumping the key remounts the form, which is how "send another message" starts from a clean state.
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <PageHero
        icon={Mail}
        badge={t.contact.badge}
        title={t.contact.title}
        description={t.contact.description}
        tone="accent"
      />

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Reveal delay={0.2} className="rounded-2xl p-8 glass">
              <ContactForm
                key={formKey}
                email={links.email}
                onReset={() => setFormKey((key) => key + 1)}
              />
            </Reveal>

            <Reveal delay={0.4} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t.contact.alsoFindMe.before}{' '}
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline underline-offset-4 hover:no-underline"
                >
                  LinkedIn
                </a>{' '}
                {t.contact.alsoFindMe.and}{' '}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline underline-offset-4 hover:no-underline"
                >
                  GitHub
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export { ContactPage };
