import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Info, Mail, Send, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT } from '@/config/constants';
import { useContent } from '@/content/useContent';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useI18n } from '@/i18n/useI18n';
import { logger } from '@/lib/logger';
import { buildMailto } from '@/lib/mailto';
import { createContactSchema, type ContactMessage } from './contact-schema';
import { contactService, type ContactService } from './contact-service';

type SubmitStatus = 'idle' | 'success' | 'error';

interface ContactPageProps {
  /** Injectable for tests; defaults to the demo service. */
  service?: ContactService;
}

const ContactPage = ({ service = contactService }: ContactPageProps) => {
  const { t } = useI18n();
  const { links } = useContent().getAbout();
  const [status, setStatus] = useState<SubmitStatus>('idle');

  useDocumentMeta(t.meta.contact);

  const schema = useMemo(() => createContactSchema(t.contact.validation), [t]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessage>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (status !== 'success') return;

    const timer = setTimeout(() => setStatus('idle'), CONTACT.successMessageDurationMs);
    return () => clearTimeout(timer);
  }, [status]);

  const onSubmit = async (message: ContactMessage) => {
    try {
      await service.send(message);
      reset();
      setStatus('success');
    } catch (error) {
      logger.error('Failed to send contact message', error);
      setStatus('error');
    }
  };

  const mailto = buildMailto(links.email, {
    subject: t.contact.mailto.subject,
    body: t.contact.mailto.body,
  });

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
            <Reveal delay={0.2} className="glass rounded-2xl p-8">
              {status === 'success' ? (
                <Alert
                  role="status"
                  className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300"
                >
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  <AlertDescription>{t.contact.success}</AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <Alert>
                    <Info className="h-5 w-5" aria-hidden="true" />
                    <AlertDescription>{t.contact.demoNotice}</AlertDescription>
                  </Alert>

                  {status === 'error' && (
                    <Alert variant="destructive" role="alert">
                      <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                      <AlertDescription>{t.contact.error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">{t.contact.form.name} *</Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder={t.contact.form.namePlaceholder}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={errors.name ? 'border-destructive' : ''}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contact.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t.contact.form.emailPlaceholder}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={errors.email ? 'border-destructive' : ''}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.contact.form.message} *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder={t.contact.form.messagePlaceholder}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={errors.message ? 'border-destructive' : ''}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-sm text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button type="submit" disabled={isSubmitting} className="group flex-1">
                      {isSubmitting ? (
                        t.contact.form.sending
                      ) : (
                        <>
                          <Send
                            className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                          {t.contact.form.submit}
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="outline" asChild className="flex-1">
                      <a href={mailto}>
                        <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t.contact.form.openEmail}
                      </a>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    {t.contact.form.requiredNote}
                  </p>
                </form>
              )}
            </Reveal>

            <Reveal delay={0.4} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t.contact.alsoFindMe.before}{' '}
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  LinkedIn
                </a>{' '}
                {t.contact.alsoFindMe.and}{' '}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
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

export default ContactPage;
