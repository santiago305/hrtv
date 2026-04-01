import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
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
    images: '',
    videos: '',
    video_thumbnail: '',
    views_count: '0',
    likes_count: '0',
    published_at: '',
    is_breaking: false,
    is_featured: false,
    is_published: false,
};

function parseMediaLines(value: string): string[] {
    return value
        .split(/\r\n|\r|\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

function buildPreview(data: NewsFormData): NewsFormPreview {
    const imagePreviews = parseMediaLines(data.images);
    const coverImage = data.cover_image.trim() !== '' ? data.cover_image.trim() : imagePreviews[0] ?? null;

    return {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage,
        imagePreviews: coverImage ? [coverImage, ...imagePreviews.filter((image) => image !== coverImage)] : imagePreviews,
        videoPreviews: parseMediaLines(data.videos),
    };
}

export function NewsFormProvider({ children }: NewsFormProviderProps) {
    const form = useForm<NewsFormData>(initialValues);

    const preview = useMemo(() => buildPreview(form.data), [form.data]);

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
                video_thumbnail: fieldErrors.video_thumbnail?.[0],
                views_count: fieldErrors.views_count?.[0],
                likes_count: fieldErrors.likes_count?.[0],
                published_at: fieldErrors.published_at?.[0],
                is_breaking: fieldErrors.is_breaking?.[0],
                is_featured: fieldErrors.is_featured?.[0],
                is_published: fieldErrors.is_published?.[0],
            });

            return;
        }

        form.post(route('dashboard.news.store'), {
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
                setField,
                resetForm,
                submit,
            }}
        >
            {children}
        </NewsFormContext.Provider>
    );
}
