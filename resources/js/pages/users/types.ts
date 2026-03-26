import type { SharedData } from '@/types';

export type UserRole = {
    id: number;
    name: string;
    slug: string;
};

export type UserTableItem = {
    id: number;
    name: string;
    email: string;
    role: UserRole | null;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string | null;
};

export type UsersPagination = {
    page: number;
    limit: number;
    total: number;
};

export type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: string;
};

export type UserUpdateFormData = {
    name: string;
    email: string;
    role_id: string;
};

export type UsersPageProps = SharedData & {
    users: UserTableItem[];
    usersPagination: UsersPagination;
    roles: UserRole[];
    flash?: {
        success?: string;
    };
};
