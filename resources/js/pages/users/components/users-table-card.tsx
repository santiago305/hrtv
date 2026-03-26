import { ActionsPopover, type ActionItem } from '@/components/ActionsPopover';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { router } from '@inertiajs/react';
import { Pencil, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import type { UsersPagination, UserTableItem } from '../types';
import { UserUpdateModal } from './user-update-modal';

type UsersTableCardProps = {
    users: UserTableItem[];
    usersPagination: UsersPagination;
};

function buildActions(
    user: UserTableItem,
    usersPagination: UsersPagination,
    onEdit: (user: UserTableItem) => void,
): ActionItem[] {
    return [
        {
            id: 'toggle-status',
            label: user.is_active ? 'Desactivar' : 'Activar',
            icon: user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
            danger: user.is_active,
            className: user.is_active ? 'hover:bg-red-500/10' : 'hover:bg-primary/5',
            onClick: () =>
                router.patch(
                    route('users.toggle-status', user.id),
                    { page: usersPagination.page },
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
            onClick: () => onEdit(user),
        },
    ];
}

export function UsersTableCard({ users, usersPagination }: UsersTableCardProps) {
    const [selectedUser, setSelectedUser] = useState<UserTableItem | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const openUpdateModal = (user: UserTableItem) => {
        setSelectedUser(user);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedUser(null);
    };

    const columns: DataTableColumn<UserTableItem>[] = [
        {
            id: 'name',
            header: 'Nombre',
            accessorKey: 'name',
            className: 'font-medium text-foreground',
            hideable: false,
        },
        {
            id: 'role',
            header: 'Rol',
            cell: (user) => (
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {user.role?.name ?? 'Sin rol'}
                </span>
            ),
        },
        {
            id: 'status',
            header: 'Estado',
            cell: (user) => (
                <span
                    className={
                        user.is_active
                            ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                    }
                >
                    {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            id: 'created_at',
            header: 'Creado',
            accessorKey: 'created_at',
            cell: (user) => user.created_at ?? '-',
        },
        {
            id: 'actions',
            header: 'Acciones',
            hideable: false,
            searchable: false,
            className: 'flex items-center justify-center',
            sortable: false,
            cardLabel: 'Acciones',
            cell: (user) => (
                <ActionsPopover actions={buildActions(user, usersPagination, openUpdateModal)} columns={1} compact triggerVariant="outline" />
            ),
            cardCell: (user) => (
                <div className="flex justify-end">
                    <ActionsPopover actions={buildActions(user, usersPagination, openUpdateModal)} columns={1} compact triggerVariant="outline" />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Usuarios creados</h2>
                    </div>

                    <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {usersPagination.total} registros
                    </div>
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    tableId="users-dashboard-table"
                    showSearch
                    searchPlaceholder="Buscar usuarios..."
                    rowKey={(user) => String(user.id)}
                    emptyMessage="No hay usuarios creados todavia."
                    pagination={usersPagination}
                    onPageChange={(page) => {
                        router.get(
                            route('users.index'),
                            { page },
                            {
                                preserveState: true,
                                preserveScroll: true,
                            },
                        );
                    }}
                    striped
                    selectableColumns
                    animated={false}
                />
            </div>

            <UserUpdateModal open={isUpdateModalOpen} user={selectedUser} onClose={closeUpdateModal} />
        </>
    );
}
