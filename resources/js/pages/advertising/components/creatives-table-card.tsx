import { ActionsPopover } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { ImagePlus, PenLine } from 'lucide-react';
import { activeBadge, formatBytes, formatCtr } from '../helpers';
import type { CreativeItem } from '../types';

type CreativesTableCardProps = {
    creatives: CreativeItem[];
    pagination: DataTablePaginationMeta;
    onPageChange: (page: number) => void;
    onEdit: (item: CreativeItem) => void;
};

export function CreativesTableCard({ creatives, pagination, onPageChange, onEdit }: CreativesTableCardProps) {
    const columns: DataTableColumn<CreativeItem>[] = [
        { id: 'banner', header: 'Banner', hideable: false, cell: (item) => <div className="flex items-center gap-3"><img src={item.file_url} alt={item.alt_text ?? item.title ?? 'banner'} className="h-10 w-16 rounded-lg border border-border object-cover" /><div><div>{item.title || 'Sin titulo'}</div><div className="text-[11px] text-muted-foreground">{item.width}x{item.height}</div></div></div> },
        { id: 'campaign', header: 'Campana', cell: (item) => <div><div>{item.campaign?.name ?? 'Sin campana'}</div><div className="text-[11px] text-muted-foreground">{item.campaign?.advertiser?.name ?? 'Sin anunciante'}</div></div> },
        { id: 'slot', header: 'Slot', cell: (item) => <div><div>{item.slot?.name ?? 'Sin slot'}</div><div className="text-[11px] text-muted-foreground">{item.slot?.size} / {item.slot?.banner_width}x{item.slot?.banner_height}</div></div> },
        { id: 'weight', header: 'Peso', accessorKey: 'display_weight', className: 'text-center', headerClassName: 'text-center' },
        { id: 'metrics', header: 'Metricas', cell: (item) => <div><div>{item.impressions_count} impresiones / {item.clicks_count} clicks</div><div className="text-[11px] text-muted-foreground">CTR {formatCtr(item.clicks_count, item.impressions_count)} / {formatBytes(item.file_size)}</div></div> },
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
                        { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <ImagePlus className="h-4 w-4" />, onClick: () => router.patch(route('ad-creatives.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
                    ]}
                    columns={1}
                    compact
                    triggerVariant="outline"
                />
            ),
        },
    ];

    return <DataTable data={creatives} columns={columns} tableId="ads-creatives-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar banners..." striped animated={false} selectableColumns={false} emptyMessage="No hay banners cargados." pagination={pagination} onPageChange={onPageChange} />;
}
