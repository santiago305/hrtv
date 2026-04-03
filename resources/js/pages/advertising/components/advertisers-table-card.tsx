import { ActionsPopover } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { Megaphone, PenLine } from 'lucide-react';
import { activeBadge } from '../helpers';
import type { AdvertiserItem } from '../types';

type AdvertisersTableCardProps = {
    advertisers: AdvertiserItem[];
    pagination: DataTablePaginationMeta;
    onPageChange: (page: number) => void;
    onEdit: (item: AdvertiserItem) => void;
};

export function AdvertisersTableCard({ advertisers, pagination, onPageChange, onEdit }: AdvertisersTableCardProps) {
    const columns: DataTableColumn<AdvertiserItem>[] = [
        { id: 'name', header: 'Anunciante', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'company_name', header: 'Empresa', cell: (item) => <span className="text-muted-foreground">{item.company_name || 'Persona natural'}</span> },
        { id: 'contact', header: 'Contacto', cell: (item) => <div><div>{item.contact_name || item.name}</div><div className="text-[11px] text-muted-foreground">{item.contact_email || 'Sin correo'}</div></div> },
        { id: 'campaigns_count', header: 'Campanas', accessorKey: 'campaigns_count', className: 'text-center', headerClassName: 'text-center' },
        { id: 'status', header: 'Estado', cell: (item) => <span className={activeBadge(item.is_active)}>{item.is_active ? 'Activo' : 'Inactivo'}</span> },
        {
            id: 'actions',
            header: 'Acciones',
            sortable: false,
            searchable: false,
            hideable: false,
            className: 'flex justify-center',
            cell: (item) => (
                <ActionsPopover
                    actions={[
                        { id: 'edit', label: 'Editar', icon: <PenLine className="h-4 w-4" />, onClick: () => onEdit(item) },
                        { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <Megaphone className="h-4 w-4" />, onClick: () => router.patch(route('advertisers.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
                    ]}
                    columns={1}
                    compact
                    triggerVariant="outline"
                />
            ),
        },
    ];

    return <DataTable data={advertisers} columns={columns} tableId="ads-advertisers-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar anunciantes..." striped animated={false} selectableColumns={false} emptyMessage="No hay anunciantes creados." pagination={pagination} onPageChange={onPageChange} />;
}
