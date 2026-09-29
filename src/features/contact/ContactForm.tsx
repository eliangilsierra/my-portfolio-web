import { CheckCircle2, Info, Mail, Send, TriangleAlert } from 'lucide-react';
import { useActionState, useEffect, useMemo, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/useI18n';
import { buildMailto } from '@/lib/mailto';
import { cn } from '@/lib/utils';
import { createContactSchema, type ContactField } from './contact-schema';
import { INITIAL_CONTACT_STATE } from './contact-state';
import { useContactService } from '@/services/contact/ContactServiceContext';
import { createContactAction } from './submit-contact';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button type="submit" disabled={pending} className="group flex-1">
      {pending ? (
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
  );
}

interface ContactFormProps {
  /** Public address used by the "open email app" fallback. */
  email: string;
  /** Called when the visitor asks to write another message after a success. */
  onReset: () => void;
}

export function ContactForm({ email, onReset }: ContactFormProps) {
  const { t } = useI18n();
  const service = useContactService();
  const formRef = useRef<HTMLFormElement>(null);

  const action = useMemo(
    () => createContactAction(service, createContactSchema(t.contact.validation)),
    [service, t],
  );
  const [state, formAction] = useActionState(action, INITIAL_CONTACT_STATE);

  // Move focus to the first invalid field so keyboard and screen-reader users land on the problem.
  useEffect(() => {
    if (state.status === 'invalid') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  if (state.status === 'sent') {
    return (
      <div className="space-y-6">
        <Alert
          role="status"
          className="border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-300"
        >
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          <AlertDescription>{t.contact.success}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onReset}>
          {t.contact.form.sendAnother}
        </Button>
      </div>
    );
  }

  const mailto = buildMailto(email, {
    subject: t.contact.mailto.subject,
    body: t.contact.mailto.body,
  });

  const fieldProps = (field: ContactField) => {
    const error = state.errors[field];
    return {
      id: field,
      name: field,
      defaultValue: state.values[field],
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${field}-error` : undefined,
      className: cn(error && 'border-destructive'),
    } as const;
  };

  const fieldError = (field: ContactField) =>
    state.errors[field] && (
      <p id={`${field}-error`} className="text-sm text-destructive">
        {state.errors[field]}
      </p>
    );

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <Alert>
        <Info className="h-5 w-5" aria-hidden="true" />
        <AlertDescription>{t.contact.demoNotice}</AlertDescription>
      </Alert>

      {state.status === 'failed' && (
        <Alert variant="destructive" role="alert">
          <TriangleAlert className="h-5 w-5" aria-hidden="true" />
          <AlertDescription>{t.contact.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t.contact.form.name} *</Label>
        <Input
          type="text"
          autoComplete="name"
          placeholder={t.contact.form.namePlaceholder}
          {...fieldProps('name')}
        />
        {fieldError('name')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.contact.form.email} *</Label>
        <Input
          type="email"
          autoComplete="email"
          placeholder={t.contact.form.emailPlaceholder}
          {...fieldProps('email')}
        />
        {fieldError('email')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.contact.form.message} *</Label>
        <Textarea
          rows={6}
          placeholder={t.contact.form.messagePlaceholder}
          {...fieldProps('message')}
        />
        {fieldError('message')}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <SubmitButton />

        <Button type="button" variant="outline" asChild className="flex-1">
          <a href={mailto}>
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.contact.form.openEmail}
          </a>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">{t.contact.form.requiredNote}</p>
    </form>
  );
}
