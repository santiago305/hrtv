import type { InertiaFormProps } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { NewsFormData } from './schema';

export type { NewsFormData } from './schema';

export type NewsFormErrors = Partial<Record<keyof NewsFormData, string>>;

export type NewsFormPreview = {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    imagePreviews: string[];
    videoPreviews: string[];
    audioPreview: string | null;
};

export type NewsMediaState = {
    coverImageFile: File | null;
    coverImagePreview: string | null;
    imageFiles: File[];
    imagePreviews: string[];
    videoFiles: File[];
    videoPreviews: string[];
    audioFile: File | null;
    audioPreview: string | null;
    resetKey: number;
};

export type NewsFormContextValue = {
    form: InertiaFormProps<NewsFormData>;
    preview: NewsFormPreview;
    media: NewsMediaState;
    setField: <K extends keyof NewsFormData>(field: K, value: NewsFormData[K]) => void;
    setCoverImage: (files: File[], previews: string[]) => void;
    setImages: (files: File[], previews: string[]) => void;
    setVideos: (files: File[], previews: string[]) => void;
    setAudio: (files: File[], previews: string[]) => void;
    resetForm: () => void;
    submit: () => void;
};

export type NewsFormProviderProps = {
    children: ReactNode;
};
