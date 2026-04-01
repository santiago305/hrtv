import { createContext } from 'react';
import type { NewsFormContextValue } from './types';

export const NewsFormContext = createContext<NewsFormContextValue | undefined>(undefined);
