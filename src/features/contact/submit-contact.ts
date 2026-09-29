import { z } from 'zod';
import { logger } from '@/lib/logger';
import {
  CONTACT_FIELDS,
  type ContactField,
  type ContactInput,
  type ContactSchema,
} from './contact-schema';
import type { ContactService } from '@/services/contact/contact-service';
import {
  EMPTY_CONTACT_VALUES,
  type ContactFieldErrors,
  type ContactFormState,
} from './contact-state';

function readValues(formData: FormData): Record<ContactField, string> {
  const values = { ...EMPTY_CONTACT_VALUES };
  for (const field of CONTACT_FIELDS) {
    const value = formData.get(field);
    values[field] = typeof value === 'string' ? value : '';
  }
  return values;
}

function firstErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const { fieldErrors } = z.flattenError(error);
  const errors: ContactFieldErrors = {};
  for (const field of CONTACT_FIELDS) {
    const message = fieldErrors[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
}

/**
 * Builds the form action: validate, deliver through the service, describe the outcome.
 * It is a plain async function so it can be tested without rendering anything.
 */
export function createContactAction(service: ContactService, schema: ContactSchema) {
  return async (_previous: ContactFormState, formData: FormData): Promise<ContactFormState> => {
    const values = readValues(formData);
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      return { status: 'invalid', values, errors: firstErrors(parsed.error) };
    }

    try {
      await service.send(parsed.data);
      return { status: 'sent', values: EMPTY_CONTACT_VALUES, errors: {} };
    } catch (error) {
      logger.error('Failed to send contact message', error);
      return { status: 'failed', values, errors: {} };
    }
  };
}
