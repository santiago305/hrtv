import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ContactMessagesTableCard } from './contact-messages/components/contact-messages-table-card';
import type { ContactMessagesPageProps } from './contact-messages/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Contactos',
        href: '/dashboard/contact-messages',
    },
];

export default function ContactMessagesIndex() {
    const { messages, messagesPagination } = usePage<ContactMessagesPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mensajes de contacto" />

            <div className="container-main py-4 text-xs sm:py-6">
                <ContactMessagesTableCard messages={messages} pagination={messagesPagination} />
            </div>
        </AppLayout>
    );
}
