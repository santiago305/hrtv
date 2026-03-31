import type { SharedData } from '@/types';

export type CategoryOption = {
    id: number;
    name: string;
};

export type CategorySubCategory = {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
};

export type CategoryTableItem = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
    sub_categories_count: number;
    sub_categories: CategorySubCategory[];
};

export type SubCategoryTableItem = {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
    category: CategoryOption | null;
};

export type CategoryFormData = {
    name: string;
    description: string;
};

export type SubCategoryFormData = {
    category_id: string;
    name: string;
    description: string;
};

export type CategoriesPageProps = SharedData & {
    categories: CategoryTableItem[];
    subCategories: SubCategoryTableItem[];
    flash?: {
        success?: string | null;
    };
};
