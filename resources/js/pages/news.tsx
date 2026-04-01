import AppLayout from '@/layouts/app-layout';
import { NewsFormProvider } from '@/hooks/news-form';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { NewsFormCard } from './news/components/news-form-card';
import PreviewNews from './news/components/PreviewNews';
import type { NewsPageProps } from './news/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Noticias',
        href: '/dashboard/news',
    },
];

function NewsContent() {
    const { categoryOptions } = usePage<NewsPageProps>().props;

    return (
        <div className="container-main py-4 text-xs">
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-8">
                    <PreviewNews />
                </div>
                <div className="space-y-6 xl:col-span-4 2xl:col-span-4">
                    <NewsFormCard categoryOptions={categoryOptions} />
                </div>
            </section>
        </div>
    );
}

export default function NewsIndex() {
    const { editingNews } = usePage<NewsPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias" />
            <NewsFormProvider initialNews={editingNews}>
                <NewsContent />
            </NewsFormProvider>
        </AppLayout>
    );
}
