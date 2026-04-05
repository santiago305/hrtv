import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { LiveStreamFormCard } from './live-streams/components/live-stream-form-card';
import { LiveStreamsTableCard } from './live-streams/components/live-streams-table-card';
import type { LiveStreamFormData, LiveStreamItem, LiveStreamsPageProps } from './live-streams/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transmisiones',
        href: '/dashboard/live-streams',
    },
];

const initialFormData: LiveStreamFormData = {
    title: '',
    short_description: '',
    description: '',
    platform: 'youtube',
    youtube_url: '',
    youtube_video_id: '',
    iframe_html: '',
    thumbnail_image: null,
    status: 'draft',
    is_active: true,
    is_featured: false,
    scheduled_at: '',
    started_at: '',
    ended_at: '',
    sort_order: '0',
    views_count: '0',
};

export default function LiveStreamsIndex() {
    const { streams } = usePage<LiveStreamsPageProps>().props;
    const [selectedStream, setSelectedStream] = useState<LiveStreamItem | null>(null);
    const [thumbnailPreviewUrls, setThumbnailPreviewUrls] = useState<string[]>([]);
    const [thumbnailResetKey, setThumbnailResetKey] = useState(0);
    const form = useForm<LiveStreamFormData>(initialFormData);

    useEffect(() => {
        if (!selectedStream) {
            form.setData(initialFormData);
            form.clearErrors();
            setThumbnailPreviewUrls([]);
            setThumbnailResetKey((current) => current + 1);
            return;
        }

        form.setData({
            title: selectedStream.title,
            short_description: selectedStream.short_description ?? '',
            description: selectedStream.description ?? '',
            platform: selectedStream.platform ?? 'youtube',
            youtube_url: selectedStream.youtube_url ?? '',
            youtube_video_id: selectedStream.youtube_video_id ?? '',
            iframe_html: selectedStream.iframe_html ?? '',
            thumbnail_image: null,
            status: selectedStream.status,
            is_active: selectedStream.is_active,
            is_featured: selectedStream.is_featured,
            scheduled_at: selectedStream.scheduled_at ?? '',
            started_at: selectedStream.started_at ?? '',
            ended_at: selectedStream.ended_at ?? '',
            sort_order: String(selectedStream.sort_order ?? 0),
            views_count: String(selectedStream.views_count ?? 0),
        });
        form.clearErrors();
        setThumbnailPreviewUrls(selectedStream.thumbnail_url ? [selectedStream.thumbnail_url] : []);
        setThumbnailResetKey((current) => current + 1);
    }, [selectedStream]);

    const handleCancelEdit = () => {
        setSelectedStream(null);
        form.reset();
        form.setData(initialFormData);
        form.clearErrors();
        setThumbnailPreviewUrls([]);
        setThumbnailResetKey((current) => current + 1);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                handleCancelEdit();
            },
        };

        if (selectedStream) {
            form.transform((data) => ({
                ...data,
                _method: 'patch',
            }));
            form.post(route('live-streams.update', selectedStream.id), options);
            return;
        }

        form.transform((data) => data);
        form.post(route('live-streams.store'), options);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transmisiones" />

            <div className="container-main py-4 text-xs sm:py-6">
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-4">
                        <LiveStreamFormCard
                            data={form.data}
                            errors={form.errors}
                            processing={form.processing}
                            isEditing={selectedStream !== null}
                            thumbnailPreviewUrls={thumbnailPreviewUrls}
                            thumbnailResetKey={thumbnailResetKey}
                            onThumbnailUpload={(files, previews) => {
                                form.setData('thumbnail_image', files[0] ?? null);
                                setThumbnailPreviewUrls(previews);
                            }}
                            onChange={form.setData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancelEdit}
                        />
                    </div>

                    <div className="space-y-6 xl:col-span-8">
                        <LiveStreamsTableCard streams={streams} onEdit={setSelectedStream} />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
