import { CONTACT } from '@/config/constants';

/** A validated message ready to be delivered. */
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/**
 * Port for delivering contact messages.
 * Features depend on this interface only (through `useContactService`), so connecting a real
 * provider (a form service, a serverless function, ...) means adding an implementation here and
 * choosing it in the composition root (`AppProviders`).
 */
export interface ContactService {
  send(message: ContactMessage): Promise<void>;
}

/** Demo implementation: waits briefly and discards the message. Nothing leaves the browser. */
export function createMockContactService(
  latencyMs: number = CONTACT.mockLatencyMs,
): ContactService {
  return {
    send: () => new Promise((resolve) => setTimeout(resolve, latencyMs)),
  };
}

export const contactService: ContactService = createMockContactService();
