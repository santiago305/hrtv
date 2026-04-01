import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { NewsTableCard } from './news/components/news-table-card';
import type { NewsTableItem } from './news/types';
import type { DataTablePaginationMeta } from '@/components/table/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardPageProps = {
    news: NewsTableItem[];
    newsPagination: DataTablePaginationMeta;
};

export default function Dashboard() {
    const { news, newsPagination } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container-main py-4 text-xs">
                <NewsTableCard
                    news={news}
                    pagination={newsPagination}
                    onPageChange={(page) => {
                        router.get(route('dashboard'), { page }, { preserveScroll: true, preserveState: true });
                    }}
                />
            </div>
        </AppLayout>
    );
}
