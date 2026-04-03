import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { ContactMessageItem } from '../types';
import { ContactMessageDetailModal } from './contact-message-detail-modal';

type Props = {
    messages: ContactMessageItem[];
    pagination: DataTablePaginationMeta;
};

export function ContactMessagesTableCard({ messages, pagination }: Props) {
    const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

    const columns: DataTableColumn<ContactMessageItem>[] = [
        {
            id: 'name',
            header: 'Nombre',
            accessorKey: 'name',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'email',
            header: 'Correo',
            accessorKey: 'email',
        },
        {
            id: 'subject',
            header: 'Asunto',
            accessorKey: 'subject',
        },
        {
            id: 'message',
            header: 'Mensaje',
            sortAccessor: (item) => item.message,
            searchValue: (item) => item.message,
            cell: (item) => <span className="line-clamp-2 text-muted-foreground">{item.message}</span>,
        },
        {
            id: 'created_at',
            header: 'Recibido',
            accessorKey: 'created_at',
            cell: (item) => item.created_at ?? '-',
        },
    ];

    return (
        <>
            <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Mensajes de contacto</h2>
                        <p className="text-xs text-muted-foreground">Haz click en una fila para ver el detalle completo del mensaje.</p>
                    </div>

                    <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {pagination.total} registros
                    </div>
                </div>

                <DataTable
                    data={messages}
                    columns={columns}
                    tableId="contact-messages-table"
                    showSearch
                    searchPlaceholder="Buscar mensajes..."
                    rowKey={(message) => String(message.id)}
                    emptyMessage="No hay mensajes de contacto registrados."
                    pagination={pagination}
                    onPageChange={(page) => {
                        router.get(
                            route('contact-messages.index'),
                            { page },
                            {
                                preserveState: true,
                                preserveScroll: true,
                            },
                        );
                    }}
                    onRowClick={(message) => setSelectedMessage(message)}
                    striped
                    animated={false}
                    selectableColumns
                />
            </div>

            <ContactMessageDetailModal
                open={selectedMessage !== null}
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
            />
        </>
    );
}
