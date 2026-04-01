import { router } from '@inertiajs/react';
import { Pencil, Power, PowerOff } from 'lucide-react';
import { ActionsPopover, type ActionItem } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, DataTablePaginationMeta } from '@/components/table/types';
import type { NewsTableItem } from '../types';

type NewsTableCardProps = {
    news: NewsTableItem[];
    pagination: DataTablePaginationMeta;
    onPageChange: (page: number) => void;
};

function formatCompactNumber(value: number) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }

    return String(value);
}

function buildActions(item: NewsTableItem): ActionItem[] {
    return [
        {
            id: 'toggle-status',
            label: item.is_published ? 'Desactivar' : 'Activar',
            icon: item.is_published ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
            danger: item.is_published,
            className: item.is_published ? 'hover:bg-red-500/10' : 'hover:bg-primary/5',
            onClick: () =>
                router.patch(
                    route('dashboard.news.toggle-status', item.slug),
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                ),
        },
        {
            id: 'edit',
            label: 'Editar',
            icon: <Pencil className="h-4 w-4" />,
            onClick: () =>
                router.get(route('dashboard.news.edit', item.slug), {}, { preserveScroll: true }),
        },
    ];
}

export function NewsTableCard({ news, pagination, onPageChange }: NewsTableCardProps) {
    const columns: DataTableColumn<NewsTableItem>[] = [
        {
            id: 'title',
            header: 'Titulo',
            accessorKey: 'title',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'category',
            header: 'Categoria',
            searchable: true,
            sortAccessor: (item) => item.category?.name ?? '',
            cell: (item) => <span className="text-muted-foreground">{item.category?.name ?? 'Sin categoria'}</span>,
        },
        {
            id: 'sub_category',
            header: 'Subcategoria',
            searchable: true,
            sortAccessor: (item) => item.sub_category?.name ?? '',
            cell: (item) => <span className="text-muted-foreground">{item.sub_category?.name ?? 'Sin subcategoria'}</span>,
        },
        {
            id: 'author',
            header: 'Escritor',
            searchable: true,
            sortAccessor: (item) => item.author?.name ?? '',
            cell: (item) => <span className="text-muted-foreground">{item.author?.name ?? 'Sin autor'}</span>,
        },
        {
            id: 'views_count',
            header: 'Vistas',
            searchable: false,
            sortAccessor: (item) => item.views_count,
            cell: (item) => <span className="text-muted-foreground">{formatCompactNumber(item.views_count)}</span>,
        },
        {
            id: 'status',
            header: 'Estado',
            searchable: false,
            sortAccessor: (item) => Number(item.is_published),
            cell: (item) => (
                <span
                    className={
                        item.is_published
                            ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                    }
                >
                    {item.is_published ? 'Activa' : 'Desactivada'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            hideable: false,
            searchable: false,
            sortable: false,
            className: 'flex items-center justify-center',
            cardLabel: 'Acciones',
            cell: (item) => <ActionsPopover actions={buildActions(item)} columns={1} compact triggerVariant="outline" />,
            cardCell: (item) => (
                <div className="flex justify-end">
                    <ActionsPopover actions={buildActions(item)} columns={1} compact triggerVariant="outline" />
                </div>
            ),
        },
    ];

    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Noticias registradas</h2>
                    <p className="text-xs text-muted-foreground">Revisa las noticias creadas y gestiona su estado editorial.</p>
                </div>

                <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {pagination.total} registros
                </div>
            </div>

            <DataTable
                data={news}
                columns={columns}
                tableId="news-dashboard-table"
                showSearch
                searchPlaceholder="Buscar noticias..."
                rowKey={(item) => String(item.id)}
                emptyMessage="No hay noticias creadas todavia."
                striped
                animated={false}
                selectableColumns={false}
                pagination={pagination}
                onPageChange={onPageChange}
            />
        </div>
    );
}
