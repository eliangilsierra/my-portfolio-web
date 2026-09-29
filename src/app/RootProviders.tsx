import type { ReactNode } from 'react';
import {
  contactService as defaultContactService,
  type ContactService,
} from '@/services/contact/contact-service';
import { ContactServiceContext } from '@/services/contact/ContactServiceContext';

interface RootProvidersProps {
  children: ReactNode;
  /** Delivery strategy for the contact form; defaults to the demo implementation. */
  contactService?: ContactService;
}

/**
 * Providers that do not depend on the language. This is the composition root for infrastructure:
 * to connect a real contact provider, pass it here.
 */
export function RootProviders({
  children,
  contactService = defaultContactService,
}: RootProvidersProps) {
  return <ContactServiceContext value={contactService}>{children}</ContactServiceContext>;
}
