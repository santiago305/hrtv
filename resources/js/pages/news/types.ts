import type { SharedData } from '@/types';

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
};

export type NewsPageProps = SharedData & {
    categoryOptions: NewsCategoryOption[];
    news: NewsTableItem[];
};
