import type { SharedData } from '@/types';

export type LiveStreamStatus = 'draft' | 'scheduled' | 'live' | 'ended';

export type LiveStreamAuthor = {
    id: number;
    name: string;
};

export type LiveStreamItem = {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    platform: string;
    youtube_url: string | null;
    youtube_video_id: string | null;
    embed_url: string | null;
    iframe_html: string | null;
    thumbnail_url: string | null;
    status: LiveStreamStatus;
    is_active: boolean;
    is_featured: boolean;
    scheduled_at: string | null;
    started_at: string | null;
    ended_at: string | null;
    sort_order: number;
    views_count: number;
    created_at: string | null;
    updated_at: string | null;
    author: LiveStreamAuthor | null;
};

export type LiveStreamFormData = {
    title: string;
    short_description: string;
    description: string;
    platform: string;
    youtube_url: string;
    youtube_video_id: string;
    iframe_html: string;
    thumbnail_image: File | null;
    status: LiveStreamStatus;
    is_active: boolean;
    is_featured: boolean;
    scheduled_at: string;
    started_at: string;
    ended_at: string;
    sort_order: string;
    views_count: string;
};

export type LiveStreamsPageProps = SharedData & {
    streams: LiveStreamItem[];
};
