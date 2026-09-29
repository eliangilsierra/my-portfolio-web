import { useContext } from 'react';
import { ContentContext } from './ContentContext';
import type { ContentRepository } from './repository';

export function useContent(): ContentRepository {
  const repository = useContext(ContentContext);
  if (!repository) {
    throw new Error('useContent must be used within a <ContentProvider>');
  }
  return repository;
}
