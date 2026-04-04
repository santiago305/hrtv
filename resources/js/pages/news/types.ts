import type { SharedData } from '@/types';
import type { DataTablePaginationMeta } from '@/components/table/types';

export type NewsSubCategoryOption = {
    id: number;
    name: string;
    category_id: number;
};

export type NewsCategoryOption = {
    id: number;
    name: string;
    sub_categories: NewsSubCategoryOption[];
};

export type NewsAuthorOption = {
    id: number;
    name: string;
};

export type NewsTableItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    is_breaking: boolean;
    is_featured: boolean;
    is_published: boolean;
    views_count: number;
    likes_count: number;
    published_at: string | null;
    created_at: string | null;
    author: NewsAuthorOption | null;
    category: {
        id: number;
        name: string;
    } | null;
    sub_category: {
        id: number;
        name: string;
    } | null;
    engagement: {
        range: '7d' | '30d' | '1y';
        daily: Array<{
            date: string;
            views_count: number;
            likes_count: number;
        }>;
        period_totals: {
            views_count: number;
            likes_count: number;
        };
    };
};

export type NewsEditorItem = {
    id: number;
    category_id: number;
    sub_category_id: number | null;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    audio_url: string | null;
    images_urls: string[];
    videos_urls: string[];
    views_count: number;
    likes_count: number;
    published_at: string | null;
    is_breaking: boolean;
    is_featured: boolean;
    is_published: boolean;
    author: NewsAuthorOption | null;
};

export type NewsPageProps = SharedData & {
    categoryOptions: NewsCategoryOption[];
    news: NewsTableItem[];
    newsPagination: DataTablePaginationMeta;
    editingNews: NewsEditorItem | null;
};

