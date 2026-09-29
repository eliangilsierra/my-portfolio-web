import type { ContactField } from './contact-schema';

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export interface ContactFormState {
  /**
   * - `idle`: nothing submitted yet
   * - `invalid`: validation failed, `errors` says why
   * - `sent`: the service accepted the message
   * - `failed`: the service rejected or threw
   */
  status: 'idle' | 'invalid' | 'sent' | 'failed';
  /** Raw values, kept so the form can be re-rendered without losing the user's input. */
  values: Record<ContactField, string>;
  errors: ContactFieldErrors;
}

export const EMPTY_CONTACT_VALUES: ContactFormState['values'] = {
  name: '',
  email: '',
  message: '',
};

export const INITIAL_CONTACT_STATE: ContactFormState = {
  status: 'idle',
  values: EMPTY_CONTACT_VALUES,
  errors: {},
};
