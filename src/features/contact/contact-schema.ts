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
      .email(messages.emailInvalid)
      .max(CONTACT.emailMaxLength, messages.emailMax(CONTACT.emailMaxLength)),
    message: z
      .string()
      .trim()
      .min(CONTACT.messageMinLength, messages.messageMin(CONTACT.messageMinLength))
      .max(CONTACT.messageMaxLength, messages.messageMax(CONTACT.messageMaxLength)),
  });
}

export type ContactMessage = z.infer<ReturnType<typeof createContactSchema>>;
