import { createContext } from 'react';
import type { ContentRepository } from './repository';

export const ContentContext = createContext<ContentRepository | null>(null);
