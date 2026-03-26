import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { SystemButton } from '@/components/SystemButton';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, UserCheck, UserPlus, UserX, Users } from 'lucide-react';

type Role = {
    id: number;
    name: string;
    slug: string;
};

type UserItem = {
    id: number;
    name: string;
    email: string;
    role: Role | null;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string | null;
};

type PageProps = {
    users: UserItem[];
    usersPagination: {
        page: number;
        limit: number;
        total: number;
    };
    roles: Role[];
    flash?: {
        success?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Usuarios',
        href: '/dashboard/users',
    },
];

export default function UsersIndex() {
    const { users, usersPagination, roles, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0] ? String(roles[0].id) : '',
    });

    const activeUsers = users.filter((user) => user.is_active).length;
    const inactiveUsers = users.filter((user) => !user.is_active).length;
    const verifiedUsers = users.filter((user) => !!user.email_verified_at).length;

    const columns: DataTableColumn<UserItem>[] = [
        {
            id: 'name',
            header: 'Nombre',
            accessorKey: 'name',
            className: 'font-medium text-black',
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
                            ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'
                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700'
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
            sortable: false,
            className: 'w-[220px]',
            cardLabel: 'Acciones',
            cell: (user) => (
                <div className="flex items-center gap-2">
                    <SystemButton
                        type="button"
                        size="sm"
                        variant={user.is_active ? 'outline' : 'primary'}
                        leftIcon={user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        onClick={() =>
                            router.patch(
                                route('users.toggle-status', user.id),
                                { page: usersPagination.page },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                },
                            )
                        }
                    >
                        {user.is_active ? 'Desactivar' : 'Activar'}
                    </SystemButton>

                    <SystemButton type="button" size="sm" variant="secondary" leftIcon={<Pencil className="h-4 w-4" />} disabled>
                        Editar
                    </SystemButton>
                </div>
            ),
            cardCell: (user) => (
                <div className="flex justify-end gap-2">
                    <SystemButton
                        type="button"
                        size="sm"
                        variant={user.is_active ? 'outline' : 'primary'}
                        leftIcon={user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        onClick={() =>
                            router.patch(
                                route('users.toggle-status', user.id),
                                { page: usersPagination.page },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                },
                            )
                        }
                    >
                        {user.is_active ? 'Desactivar' : 'Activar'}
                    </SystemButton>

                    <SystemButton type="button" size="sm" variant="secondary" leftIcon={<Pencil className="h-4 w-4" />} disabled>
                        Editar
                    </SystemButton>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="container-main py-4 text-xs sm:py-6">
                <div className="flex flex-col gap-6">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-border bg-white px-4 py-4">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-medium text-black/55">Total usuarios</p>
                            <p className="mt-1 text-2xl font-semibold text-black">{usersPagination.total}</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-white px-4 py-4">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-medium text-black/55">Activos</p>
                            <p className="mt-1 text-2xl font-semibold text-black">{activeUsers}</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-white px-4 py-4">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                                <UserX className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-medium text-black/55">Inactivos</p>
                            <p className="mt-1 text-2xl font-semibold text-black">{inactiveUsers}</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-white px-4 py-4">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <Users className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-medium text-black/55">Verificados</p>
                            <p className="mt-1 text-2xl font-semibold text-black">{verifiedUsers}</p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-4 2xl:col-span-3">
                            <div className="rounded-sm border border-border  p-5 sm:p-6 lg:sticky lg:top-6">
                                <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <UserPlus className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h1 className="text-base font-semibold text-black">Crear usuario</h1>
                                    </div>
                                </div>

                                {flash?.success && (
                                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                        {flash.success}
                                    </div>
                                )}

                                <form
                                    className="space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        post(route('users.store'), {
                                            onSuccess: () =>
                                                reset('name', 'email', 'password', 'password_confirmation'),
                                        });
                                    }}
                                >
                                    <FloatingInput
                                        label="Nombre"
                                        name="name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        error={errors.name}
                                        disabled={processing}
                                    />

                                    <FloatingInput
                                        label="Correo electronico"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        error={errors.email}
                                        disabled={processing}
                                    />

                                    <FloatingSelect
                                        label="Rol"
                                        name="role_id"
                                        value={data.role_id}
                                        options={roles.map((role) => ({
                                            value: String(role.id),
                                            label: role.name,
                                        }))}
                                        onChange={(value) => setData('role_id', value)}
                                        error={errors.role_id}
                                        placeholder="Selecciona un rol"
                                        disabled={processing}
                                    />

                                    <FloatingInput
                                        label="Contrasena"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        error={errors.password}
                                        disabled={processing}
                                    />

                                    <FloatingInput
                                        label="Confirmar contrasena"
                                        name="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(event) => setData('password_confirmation', event.target.value)}
                                        error={errors.password_confirmation}
                                        disabled={processing}
                                    />

                                    <SystemButton type="submit" size="sm" fullWidth loading={processing} className="mt-2">
                                        Crear usuario
                                    </SystemButton>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-8 2xl:col-span-9">
                            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-black">Usuarios creados</h2>
                                    </div>

                                    <div className="inline-flex w-fit items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-black/60">
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
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
