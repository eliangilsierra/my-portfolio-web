import { z } from 'zod';
import { CONTACT } from '@/config/constants';
import type { Dictionary } from '@/i18n/dictionaries';

type ValidationMessages = Dictionary['contact']['validation'];

/** Builds the form schema with validation messages in the active language. */
export function createContactSchema(messages: ValidationMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(CONTACT.nameMinLength, messages.nameMin(CONTACT.nameMinLength))
      .max(CONTACT.nameMaxLength, messages.nameMax(CONTACT.nameMaxLength)),
    email: z
      .string()
      .trim()
      .max(CONTACT.emailMaxLength, messages.emailMax(CONTACT.emailMaxLength))
      .pipe(z.email(messages.emailInvalid)),
    message: z
      .string()
      .trim()
      .min(CONTACT.messageMinLength, messages.messageMin(CONTACT.messageMinLength))
      .max(CONTACT.messageMaxLength, messages.messageMax(CONTACT.messageMaxLength)),
  });
}

export type ContactSchema = ReturnType<typeof createContactSchema>;
export type ContactInput = z.infer<ContactSchema>;
export type ContactField = keyof ContactInput;

export const CONTACT_FIELDS = [
  'name',
  'email',
  'message',
] as const satisfies readonly ContactField[];
