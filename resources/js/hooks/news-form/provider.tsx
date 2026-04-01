import { router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { NewsFormContext } from './context';
import { newsFormSchema } from './schema';
import type { NewsFormData, NewsFormPreview, NewsFormProviderProps } from './types';

function createInitialValues(initialNews?: NewsFormProviderProps['initialNews']): NewsFormData {
    return {
        category_id: initialNews ? String(initialNews.category_id) : '',
        sub_category_id: initialNews?.sub_category_id ? String(initialNews.sub_category_id) : '',
        title: initialNews?.title ?? '',
        excerpt: initialNews?.excerpt ?? '',
        content: initialNews?.content ?? '',
        cover_image: initialNews?.cover_image_url ?? '',
        audio_path: initialNews?.audio_url ?? '',
        images: initialNews?.images_urls ?? [],
        videos: initialNews?.videos_urls ?? [],
        views_count: String(initialNews?.views_count ?? 0),
        likes_count: String(initialNews?.likes_count ?? 0),
        published_at: initialNews?.published_at ?? '',
        is_breaking: initialNews?.is_breaking ?? false,
        is_featured: initialNews?.is_featured ?? false,
        is_published: initialNews?.is_published ?? false,
    };
}

function buildPreview(data: NewsFormData, coverImagePreview: string | null, audioPreview: string | null): NewsFormPreview {
    const coverImage = coverImagePreview ?? data.images[0] ?? null;
    const imagePreviews = coverImage ? [coverImage, ...data.images.filter((image) => image !== coverImage)] : data.images;

    return {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage,
        imagePreviews,
        videoPreviews: data.videos,
        audioPreview,
    };
}

export function NewsFormProvider({ children, initialNews = null }: NewsFormProviderProps) {
    const isEditing = initialNews !== null;
    const form = useForm<NewsFormData>(createInitialValues(initialNews));
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialNews?.cover_image_url ?? null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(initialNews?.audio_url ?? null);
    const [resetKey, setResetKey] = useState(0);

    const preview = useMemo(() => buildPreview(form.data, coverImagePreview, audioPreview), [audioPreview, coverImagePreview, form.data]);

    const setField = <K extends keyof NewsFormData>(field: K, value: NewsFormData[K]) => {
        form.setData((currentData) => ({
            ...currentData,
            [field]: value,
        }));
    };

    const cancelEdit = () => {
        router.get(route('dashboard'));
    };

    const resetForm = () => {
        if (isEditing) {
            router.get(route('dashboard.news.edit', initialNews?.slug));
            return;
        }

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
        setCoverImagePreview(previewUrl ?? (file ? null : initialNews?.cover_image_url ?? null));
        setField('cover_image', previewUrl ?? initialNews?.cover_image_url ?? '');
    };

    const setImages = (files: File[], previews: string[]) => {
        setImageFiles(files);
        setField('images', previews.length > 0 ? previews : initialNews?.images_urls ?? []);
    };

    const setVideos = (files: File[], previews: string[]) => {
        setVideoFiles(files);
        setField('videos', previews.length > 0 ? previews : initialNews?.videos_urls ?? []);
    };

    const setAudio = (files: File[], previews: string[]) => {
        const file = files[0] ?? null;
        const previewUrl = previews[0] ?? null;

        setAudioFile(file);
        setAudioPreview(previewUrl ?? (file ? null : initialNews?.audio_url ?? null));
        setField('audio_path', file?.name ?? initialNews?.audio_url ?? '');

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

        if (isEditing && initialNews) {
            payload.append('_method', 'patch');

            router.post(route('dashboard.news.update', initialNews.slug), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    cancelEdit();
                },
            });

            return;
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
                isEditing,
                editingNewsId: initialNews?.id ?? null,
                setField,
                setCoverImage,
                setImages,
                setVideos,
                setAudio,
                cancelEdit,
                resetForm,
                submit,
            }}
        >
            {children}
        </NewsFormContext.Provider>
    );
}
