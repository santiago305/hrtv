import type { DataTablePaginationMeta } from '@/components/table/types';
import type { SharedData } from '@/types';

export type ContactMessageItem = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string | null;
};

export type ContactMessagesPageProps = SharedData & {
    messages: ContactMessageItem[];
    messagesPagination: DataTablePaginationMeta;
};
