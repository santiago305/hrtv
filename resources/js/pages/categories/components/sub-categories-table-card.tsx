import { ActionsPopover, type ActionItem } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import { useLocalPagination } from '@/components/pagination/use-local-pagination';
import type { DataTableColumn } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { Pencil, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';
import type { CategoryOption, SubCategoryTableItem } from '../types';
import { SubCategoryUpdateModal } from './sub-category-update-modal';

type SubCategoriesTableCardProps = {
    subCategories: SubCategoryTableItem[];
    categoryOptions: CategoryOption[];
};

const PAGE_LIMIT = 10;

function buildActions(subCategory: SubCategoryTableItem, onEdit: (subCategory: SubCategoryTableItem) => void): ActionItem[] {
    return [
        {
            id: 'toggle-status',
            label: subCategory.is_active ? 'Desactivar' : 'Activar',
            icon: subCategory.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
            danger: subCategory.is_active,
            className: subCategory.is_active ? 'hover:bg-red-500/10' : 'hover:bg-primary/5',
            onClick: () =>
                router.patch(
                    route('sub-categories.toggle-status', subCategory.id),
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
            onClick: () => onEdit(subCategory),
        },
    ];
}

export function SubCategoriesTableCard({ subCategories, categoryOptions }: SubCategoriesTableCardProps) {
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryTableItem | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { paginatedData, pagination, setPage } = useLocalPagination({
        data: subCategories,
        limit: PAGE_LIMIT,
    });

    const openEdit = (subCategory: SubCategoryTableItem) => {
        setSelectedSubCategory(subCategory);
        setIsUpdateModalOpen(true);
    };

    const columns: DataTableColumn<SubCategoryTableItem>[] = [
        {
            id: 'name',
            header: 'Subcategoria',
            accessorKey: 'name',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'category',
            header: 'Categoria',
            sortAccessor: (subCategory) => subCategory.category?.name ?? '',
            searchValue: (subCategory) => subCategory.category?.name ?? '',
            cell: (subCategory) => (
                <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-300">
                    {subCategory.category?.name ?? 'Sin categoria'}
                </span>
            ),
        },
        {
            id: 'description',
            header: 'Descripcion',
            sortAccessor: (subCategory) => subCategory.description ?? '',
            cell: (subCategory) => <span className="line-clamp-2 text-muted-foreground">{subCategory.description || 'Sin descripcion'}</span>,
        },
        {
            id: 'status',
            header: 'Estado',
            searchable: false,
            sortAccessor: (subCategory) => Number(subCategory.is_active),
            cell: (subCategory) => (
                <span
                    className={
                        subCategory.is_active
                            ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                    }
                >
                    {subCategory.is_active ? 'Activa' : 'Inactiva'}
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
            cell: (subCategory) => <ActionsPopover actions={buildActions(subCategory, openEdit)} columns={1} compact triggerVariant="outline" />,
            cardCell: (subCategory) => (
                <div className="flex justify-end">
                    <ActionsPopover actions={buildActions(subCategory, openEdit)} columns={1} compact triggerVariant="outline" />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Subcategorias</h2>
                        <p className="text-xs text-muted-foreground">Busca, edita y desactiva sin borrar informacion historica.</p>
                    </div>

                    <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {subCategories.length} registros
                    </div>
                </div>

                <DataTable
                    data={paginatedData}
                    columns={columns}
                    tableId="sub-categories-dashboard-table"
                    showSearch
                    searchPlaceholder="Buscar subcategorias..."
                    rowKey={(subCategory) => String(subCategory.id)}
                    emptyMessage="No hay subcategorias creadas todavia."
                    pagination={pagination}
                    onPageChange={setPage}
                    striped
                    animated={false}
                    selectableColumns={false}
                />
            </div>

            <SubCategoryUpdateModal
                open={isUpdateModalOpen}
                subCategory={selectedSubCategory}
                categoryOptions={categoryOptions}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedSubCategory(null);
                }}
            />
        </>
    );
}
