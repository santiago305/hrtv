import { useContext } from 'react';
import { NewsFormContext } from './context';
import type { NewsFormContextValue } from './types';

export function useNewsForm(): NewsFormContextValue {
    const context = useContext(NewsFormContext);

    if (!context) {
        throw new Error('useNewsForm must be used within a NewsFormProvider');
    }

    return context;
}
