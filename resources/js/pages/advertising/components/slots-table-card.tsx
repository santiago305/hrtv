import { ActionsPopover } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { LayoutTemplate, PenLine } from 'lucide-react';
import { PAGE_TYPES } from '../constants';
import { activeBadge } from '../helpers';
import type { AdSlotItem } from '../types';

type SlotsTableCardProps = {
    adSlots: AdSlotItem[];
    pagination: DataTablePaginationMeta;
    onPageChange: (page: number) => void;
    onEdit: (item: AdSlotItem) => void;
};

export function SlotsTableCard({ adSlots, pagination, onPageChange, onEdit }: SlotsTableCardProps) {
    const columns: DataTableColumn<AdSlotItem>[] = [
        { id: 'name', header: 'Slot', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'code', header: 'Codigo', accessorKey: 'code', cell: (item) => <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span> },
        { id: 'location', header: 'Ubicacion', cell: (item) => <div><div>{PAGE_TYPES.find((page) => page.value === item.page_type)?.label ?? item.page_type}</div><div className="text-[11px] text-muted-foreground">{item.size} / {item.banner_width}x{item.banner_height}</div></div> },
        { id: 'creatives_count', header: 'Creativos', accessorKey: 'creatives_count', className: 'text-center', headerClassName: 'text-center' },
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
                        { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <LayoutTemplate className="h-4 w-4" />, onClick: () => router.patch(route('ad-slots.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
                    ]}
                    columns={1}
                    compact
                    triggerVariant="outline"
                />
            ),
        },
    ];

    return <DataTable data={adSlots} columns={columns} tableId="ads-slots-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar slots..." striped animated={false} selectableColumns={false} emptyMessage="No hay slots creados." pagination={pagination} onPageChange={onPageChange} />;
}
