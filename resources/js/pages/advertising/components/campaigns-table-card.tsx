import { ActionsPopover } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { PenLine, SlidersVertical } from 'lucide-react';
import { campaignBadge, formatCtr } from '../helpers';
import type { CampaignItem } from '../types';

type CampaignsTableCardProps = {
    campaigns: CampaignItem[];
    pagination: DataTablePaginationMeta;
    onPageChange: (page: number) => void;
    onEdit: (item: CampaignItem) => void;
    campaignLabel: (status: string | null) => string;
};

export function CampaignsTableCard({ campaigns, pagination, onPageChange, onEdit, campaignLabel }: CampaignsTableCardProps) {
    const columns: DataTableColumn<CampaignItem>[] = [
        { id: 'name', header: 'Campana', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'advertiser', header: 'Anunciante', cell: (item) => <span className="text-muted-foreground">{item.advertiser?.name ?? 'Sin anunciante'}</span> },
        { id: 'dates', header: 'Vigencia', cell: (item) => <div><div>{item.start_date || 'Sin inicio'}</div><div className="text-[11px] text-muted-foreground">hasta {item.end_date || 'Sin fin'}</div></div> },
        { id: 'priority', header: 'Prioridad', accessorKey: 'priority_weight', className: 'text-center', headerClassName: 'text-center' },
        { id: 'metrics', header: 'Metricas', cell: (item) => <div><div>{item.impressions_count} impresiones</div><div className="text-[11px] text-muted-foreground">{item.clicks_count} clicks / CTR {formatCtr(item.clicks_count, item.impressions_count)}</div></div> },
        { id: 'status', header: 'Estado', cell: (item) => <span className={campaignBadge(item.status)}>{campaignLabel(item.status)}</span> },
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
                        { id: 'toggle', label: item.status === 'active' ? 'Pausar' : 'Activar', icon: <SlidersVertical className="h-4 w-4" />, onClick: () => router.patch(route('campaigns.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
                    ]}
                    columns={1}
                    compact
                    triggerVariant="outline"
                />
            ),
        },
    ];

    return <DataTable data={campaigns} columns={columns} tableId="ads-campaigns-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar campanas..." striped animated={false} selectableColumns={false} emptyMessage="No hay campanas creadas." pagination={pagination} onPageChange={onPageChange} />;
}
