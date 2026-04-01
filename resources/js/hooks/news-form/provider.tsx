import { router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { NewsFormContext } from './context';
import { newsFormSchema } from './schema';
import type { NewsFormData, NewsFormPreview, NewsFormProviderProps } from './types';

const initialValues: NewsFormData = {
    category_id: '',
    sub_category_id: '',
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    audio_path: '',
    images: [],
    videos: [],
    views_count: '0',
    likes_count: '0',
    published_at: '',
    is_breaking: false,
    is_featured: false,
    is_published: false,
};

function buildPreview(data: NewsFormData, coverImagePreview: string | null): NewsFormPreview {
    const coverImage = coverImagePreview ?? data.images[0] ?? null;
    const imagePreviews = coverImage ? [coverImage, ...data.images.filter((image) => image !== coverImage)] : data.images;

    return {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage,
        imagePreviews,
        videoPreviews: data.videos,
    };
}

export function NewsFormProvider({ children }: NewsFormProviderProps) {
    const form = useForm<NewsFormData>(initialValues);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [resetKey, setResetKey] = useState(0);

    const preview = useMemo(() => buildPreview(form.data, coverImagePreview), [coverImagePreview, form.data]);

    const setField = <K extends keyof NewsFormData>(field: K, value: NewsFormData[K]) => {
        form.setData((currentData) => ({
            ...currentData,
            [field]: value,
        }));
    };

    const resetForm = () => {
        form.reset();
        form.clearErrors();
        form.setData('views_count', '0');
        form.setData('likes_count', '0');
        setCoverImageFile(null);
        setCoverImagePreview(null);
        setImageFiles([]);
        setVideoFiles([]);
        setAudioFile(null);
        setAudioPreview(null);
        setResetKey((current) => current + 1);
    };

    const setCoverImage = (files: File[], previews: string[]) => {
        const file = files[0] ?? null;
        const previewUrl = previews[0] ?? null;

        setCoverImageFile(file);
        setCoverImagePreview(previewUrl);
        setField('cover_image', previewUrl ?? '');
    };

    const setImages = (files: File[], previews: string[]) => {
        setImageFiles(files);
        setField('images', previews);
    };

    const setVideos = (files: File[], previews: string[]) => {
        setVideoFiles(files);
        setField('videos', previews);
    };

    const setAudio = (files: File[], previews: string[]) => {
        const file = files[0] ?? null;
        const previewUrl = previews[0] ?? null;

        setAudioFile(file);
        setAudioPreview(previewUrl);
        setField('audio_path', file?.name ?? '');

        if (!file) {
            form.clearErrors('audio_path');
        }
    };

    const submit = () => {
        const result = newsFormSchema.safeParse(form.data);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            form.setError({
                category_id: fieldErrors.category_id?.[0],
                sub_category_id: fieldErrors.sub_category_id?.[0],
                title: fieldErrors.title?.[0],
                excerpt: fieldErrors.excerpt?.[0],
                content: fieldErrors.content?.[0],
                cover_image: fieldErrors.cover_image?.[0],
                audio_path: fieldErrors.audio_path?.[0],
                images: fieldErrors.images?.[0],
                videos: fieldErrors.videos?.[0],
                views_count: fieldErrors.views_count?.[0],
                likes_count: fieldErrors.likes_count?.[0],
                published_at: fieldErrors.published_at?.[0],
                is_breaking: fieldErrors.is_breaking?.[0],
                is_featured: fieldErrors.is_featured?.[0],
                is_published: fieldErrors.is_published?.[0],
            });

            return;
        }

        const payload = new FormData();

        payload.append('category_id', result.data.category_id);
        payload.append('title', result.data.title);
        payload.append('content', result.data.content);
        payload.append('views_count', result.data.views_count);
        payload.append('likes_count', result.data.likes_count);
        payload.append('published_at', result.data.published_at);
        payload.append('is_breaking', result.data.is_breaking ? '1' : '0');
        payload.append('is_featured', result.data.is_featured ? '1' : '0');
        payload.append('is_published', result.data.is_published ? '1' : '0');

        if (result.data.sub_category_id.trim() !== '') {
            payload.append('sub_category_id', result.data.sub_category_id);
        }

        if (result.data.excerpt.trim() !== '') {
            payload.append('excerpt', result.data.excerpt);
        }

        if (coverImageFile) {
            payload.append('cover_image', coverImageFile);
        }

        imageFiles.forEach((file, index) => {
            payload.append(`images[${index}]`, file);
        });

        videoFiles.forEach((file, index) => {
            payload.append(`videos[${index}]`, file);
        });

        if (audioFile) {
            payload.append('audio_path', audioFile);
        }

        router.post(route('dashboard.news.store'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                resetForm();
            },
        });
    };

    return (
        <NewsFormContext.Provider
            value={{
                form,
                preview,
                media: {
                    coverImageFile,
                    coverImagePreview,
                    imageFiles,
                    imagePreviews: form.data.images,
                    videoFiles,
                    videoPreviews: form.data.videos,
                    audioFile,
                    audioPreview,
                    resetKey,
                },
                setField,
                setCoverImage,
                setImages,
                setVideos,
                setAudio,
                resetForm,
                submit,
            }}
        >
            {children}
        </NewsFormContext.Provider>
    );
}
