import { ActionsPopover, type ActionItem } from '@/components/ActionsPopover';
import { useLocalPagination } from '@/components/pagination/use-local-pagination';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { Eye, Pencil, Power, PowerOff } from 'lucide-react';
import type { LiveStreamItem } from '../types';

type LiveStreamsTableCardProps = {
    streams: LiveStreamItem[];
    onEdit: (stream: LiveStreamItem) => void;
};

const PAGE_LIMIT = 10;

const statusClasses: Record<LiveStreamItem['status'], string> = {
    draft: 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    scheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    live: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    ended: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

const statusLabels: Record<LiveStreamItem['status'], string> = {
    draft: 'Borrador',
    scheduled: 'Programada',
    live: 'En vivo',
    ended: 'Finalizada',
};

function buildActions(stream: LiveStreamItem, onEdit: (stream: LiveStreamItem) => void): ActionItem[] {
    return [
        {
            id: 'edit',
            label: 'Editar',
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit(stream),
        },
        {
            id: 'toggle-status',
            label: stream.is_active ? 'Desactivar' : 'Activar',
            icon: stream.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
            danger: stream.is_active,
            className: stream.is_active ? 'hover:bg-red-500/10' : 'hover:bg-primary/5',
            onClick: () =>
                router.patch(
                    route('live-streams.toggle-status', stream.id),
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                ),
        },
    ];
}

export function LiveStreamsTableCard({ streams, onEdit }: LiveStreamsTableCardProps) {
    const { paginatedData, pagination, setPage } = useLocalPagination({
        data: streams,
        limit: PAGE_LIMIT,
    });

    const columns: DataTableColumn<LiveStreamItem>[] = [
        {
            id: 'title',
            header: 'Transmision',
            searchable: true,
            sortAccessor: (stream) => stream.title,
            cell: (stream) => (
                <div className="space-y-1">
                    <div className="font-medium text-foreground">{stream.title}</div>
                    <div className="text-[11px] text-muted-foreground">{stream.slug}</div>
                </div>
            ),
        },
        {
            id: 'youtube_video_id',
            header: 'YouTube',
            searchable: true,
            sortAccessor: (stream) => stream.youtube_video_id ?? '',
            cell: (stream) => <span className="font-mono text-[11px] text-muted-foreground">{stream.youtube_video_id ?? 'Sin ID'}</span>,
        },
        {
            id: 'status',
            header: 'Estado',
            searchable: false,
            sortAccessor: (stream) => stream.status,
            cell: (stream) => <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${statusClasses[stream.status]}`}>{statusLabels[stream.status]}</span>,
        },
        {
            id: 'scheduled_at',
            header: 'Programada',
            searchable: false,
            sortAccessor: (stream) => stream.scheduled_at ?? '',
            cell: (stream) => <span className="text-muted-foreground">{stream.scheduled_at ? stream.scheduled_at.replace('T', ' ') : 'Sin fecha'}</span>,
        },
        {
            id: 'flags',
            header: 'Visibilidad',
            searchable: false,
            sortable: false,
            cell: (stream) => (
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${stream.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'}`}>
                        {stream.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                    {stream.is_featured && <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">Destacada</span>}
                </div>
            ),
        },
        {
            id: 'embed_url',
            header: 'Preview',
            searchable: false,
            sortable: false,
            className: 'text-center',
            headerClassName: 'text-center',
            cell: (stream) =>
                stream.embed_url ? (
                    <a href={stream.embed_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                        <Eye className="h-4 w-4" />
                        Ver
                    </a>
                ) : (
                    <span className="text-muted-foreground">Sin enlace</span>
                ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            hideable: false,
            searchable: false,
            sortable: false,
            className: 'flex items-center justify-center',
            cell: (stream) => <ActionsPopover actions={buildActions(stream, onEdit)} columns={1} compact triggerVariant="outline" />,
            cardCell: (stream) => (
                <div className="flex justify-end">
                    <ActionsPopover actions={buildActions(stream, onEdit)} columns={1} compact triggerVariant="outline" />
                </div>
            ),
        },
    ];

    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Control de transmisiones</h2>
                    <p className="text-xs text-muted-foreground">Cambia estados, activa registros y edita los enlaces administrados en el panel.</p>
                </div>

                <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {streams.length} registros
                </div>
            </div>

            <DataTable
                data={paginatedData}
                columns={columns}
                tableId="live-streams-dashboard-table"
                showSearch
                searchPlaceholder="Buscar transmisiones..."
                rowKey={(stream) => String(stream.id)}
                emptyMessage="No hay transmisiones registradas todavia."
                pagination={pagination}
                onPageChange={setPage}
                striped
                animated={false}
                selectableColumns={false}
            />
        </div>
    );
}
