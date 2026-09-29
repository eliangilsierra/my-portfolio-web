import { CONTACT } from '@/config/constants';
import type { ContactMessage } from './contact-schema';

/**
 * Port for delivering contact messages.
 * The page depends on this interface only, so connecting a real provider
 * (a form service, a serverless function, ...) means adding an implementation here.
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
