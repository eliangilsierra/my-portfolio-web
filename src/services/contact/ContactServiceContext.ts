import { createContext, useContext } from 'react';
import type { ContactService } from './contact-service';

export const ContactServiceContext = createContext<ContactService | null>(null);

/** The contact delivery strategy chosen by the composition root. */
export function useContactService(): ContactService {
  const service = useContext(ContactServiceContext);
  if (!service) {
    throw new Error('useContactService must be used within a <ContactServiceContext.Provider>');
  }
  return service;
}
