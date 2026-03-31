import { ActionsPopover, type ActionItem } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { Pencil, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';
import type { CategoryTableItem } from '../types';
import { CategoryUpdateModal } from './category-update-modal';

type CategoriesTableCardProps = {
    categories: CategoryTableItem[];
};

function buildActions(category: CategoryTableItem, onEdit: (category: CategoryTableItem) => void): ActionItem[] {
    return [
        {
            id: 'toggle-status',
            label: category.is_active ? 'Desactivar' : 'Activar',
            icon: category.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
            danger: category.is_active,
            className: category.is_active ? 'hover:bg-red-500/10' : 'hover:bg-primary/5',
            onClick: () =>
                router.patch(
                    route('categories.toggle-status', category.id),
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
            onClick: () => onEdit(category),
        },
    ];
}

export function CategoriesTableCard({ categories }: CategoriesTableCardProps) {
    const [selectedCategory, setSelectedCategory] = useState<CategoryTableItem | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const columns: DataTableColumn<CategoryTableItem>[] = [
        {
            id: 'name',
            header: 'Categoria',
            accessorKey: 'name',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'description',
            header: 'Descripcion',
            searchable: true,
            sortAccessor: (category) => category.description ?? '',
            cell: (category) => <span className="line-clamp-2 text-muted-foreground">{category.description || 'Sin descripcion'}</span>,
        },
        {
            id: 'sub_categories_count',
            header: 'Subcategorias',
            accessorKey: 'sub_categories_count',
            className: 'text-center',
            headerClassName: 'text-center',
            cell: (category) => (
                <span className="inline-flex min-w-10 justify-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {category.sub_categories_count}
                </span>
            ),
        },
        {
            id: 'status',
            header: 'Estado',
            searchable: false,
            sortAccessor: (category) => Number(category.is_active),
            cell: (category) => (
                <span
                    className={
                        category.is_active
                            ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                    }
                >
                    {category.is_active ? 'Activa' : 'Inactiva'}
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
            cell: (category) => <ActionsPopover actions={buildActions(category, (item) => {
                setSelectedCategory(item);
                setIsUpdateModalOpen(true);
            })} columns={1} compact triggerVariant="outline" />,
            cardCell: (category) => (
                <div className="flex justify-end">
                    <ActionsPopover actions={buildActions(category, (item) => {
                        setSelectedCategory(item);
                        setIsUpdateModalOpen(true);
                    })} columns={1} compact triggerVariant="outline" />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Categorias</h2>
                        <p className="text-xs text-muted-foreground">Administra el arbol principal sin perder historial.</p>
                    </div>

                    <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {categories.length} registros
                    </div>
                </div>

                <DataTable
                    data={categories}
                    columns={columns}
                    tableId="categories-dashboard-table"
                    showSearch
                    searchPlaceholder="Buscar categorias..."
                    rowKey={(category) => String(category.id)}
                    emptyMessage="No hay categorias creadas todavia."
                    striped
                    animated={false}
                    selectableColumns={false}
                />
            </div>

            <CategoryUpdateModal
                open={isUpdateModalOpen}
                category={selectedCategory}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedCategory(null);
                }}
            />
        </>
    );
}
