import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import type { NewsTableItem } from '../types';

type NewsTableCardProps = {
    news: NewsTableItem[];
};

function formatCompactNumber(value: number) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }

    return String(value);
}

export function NewsTableCard({ news }: NewsTableCardProps) {
    const columns: DataTableColumn<NewsTableItem>[] = [
        {
            id: 'title',
            header: 'Noticia',
            accessorKey: 'title',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'category',
            header: 'Categoria',
            searchable: true,
            sortAccessor: (item) => item.category?.name ?? '',
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item.category?.name ?? 'Sin categoria'}</span>
                    <span className="text-[11px] text-muted-foreground">{item.sub_category?.name ?? 'Sin subcategoria'}</span>
                </div>
            ),
        },
        {
            id: 'author',
            header: 'Autor',
            searchable: true,
            sortAccessor: (item) => item.author?.name ?? '',
            cell: (item) => <span className="text-muted-foreground">{item.author?.name ?? 'Sin autor'}</span>,
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
                    {item.is_published ? 'Publicada' : 'Borrador'}
                </span>
            ),
        },
        {
            id: 'flags',
            header: 'Indicadores',
            searchable: false,
            sortable: false,
            cell: (item) => (
                <div className="flex flex-wrap gap-2">
                    {item.is_breaking ? <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500">Urgente</span> : null}
                    {item.is_featured ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">Destacada</span> : null}
                    {!item.is_breaking && !item.is_featured ? <span className="text-[11px] text-muted-foreground">Sin marcadores</span> : null}
                </div>
            ),
        },
        {
            id: 'metrics',
            header: 'Metricas',
            searchable: false,
            sortable: false,
            cell: (item) => (
                <div className="flex flex-col text-[11px] text-muted-foreground">
                    <span>{formatCompactNumber(item.views_count)} vistas</span>
                    <span>{formatCompactNumber(item.likes_count)} me gusta</span>
                </div>
            ),
        },
        {
            id: 'published_at',
            header: 'Publicacion',
            searchable: false,
            sortAccessor: (item) => item.published_at ?? item.created_at ?? '',
            cell: (item) => <span className="text-muted-foreground">{item.published_at ?? item.created_at ?? 'Sin fecha'}</span>,
        },
    ];

    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Noticias registradas</h2>
                    <p className="text-xs text-muted-foreground">Vista editorial para revisar autor, clasificación y estado antes de conectar la web pública.</p>
                </div>

                <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {news.length} registros
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
            />
        </div>
    );
}
