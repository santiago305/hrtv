import type { InertiaFormProps } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { NewsFormData } from './schema';

export type NewsFormErrors = Partial<Record<keyof NewsFormData, string>>;

export type NewsFormPreview = {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    imagePreviews: string[];
    videoPreviews: string[];
};

export type NewsFormContextValue = {
    form: InertiaFormProps<NewsFormData>;
    preview: NewsFormPreview;
    setField: <K extends keyof NewsFormData>(field: K, value: NewsFormData[K]) => void;
    resetForm: () => void;
    submit: () => void;
};

export type NewsFormProviderProps = {
    children: ReactNode;
};
