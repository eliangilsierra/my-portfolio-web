export interface MailtoOptions {
  subject?: string;
  body?: string;
}

export function buildMailto(email: string, { subject, body }: MailtoOptions = {}): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);

  const query = params.toString().replace(/\+/g, '%20');
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}
