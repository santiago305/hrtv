import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Shield, UserPlus, Users } from 'lucide-react';

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
    email_verified_at: string | null;
    created_at: string | null;
};

type PageProps = {
    users: UserItem[];
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
    const { users, roles, flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0] ? String(roles[0].id) : '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-4">
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Users className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-black/60">Total de usuarios</p>
                        <p className="mt-1 text-3xl font-semibold text-black">{users.length}</p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Shield className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-black/60">Roles disponibles</p>
                        <p className="mt-1 text-3xl font-semibold text-black">{roles.length}</p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-black/60">Creacion interna</p>
                        <p className="mt-1 text-base font-medium text-black">Los usuarios ahora se crean solo desde el dashboard.</p>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[380px,1fr]">
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="mb-5">
                            <h1 className="text-xl font-semibold text-black">Crear usuario</h1>
                            <p className="mt-1 text-sm text-black/60">Registra administradores, moderadores y redactores desde esta seccion.</p>
                        </div>

                        {flash?.success && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>}

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                post(route('users.store'), {
                                    onSuccess: () => reset('name', 'email', 'password', 'password_confirmation'),
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

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Crear usuario
                            </Button>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-black">Usuarios creados</h2>
                                <p className="mt-1 text-sm text-black/60">Listado de cuentas disponibles dentro del sistema.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-black/10">
                                <thead>
                                    <tr className="text-left text-sm text-black/55">
                                        <th className="px-4 py-3 font-medium">Nombre</th>
                                        <th className="px-4 py-3 font-medium">Correo</th>
                                        <th className="px-4 py-3 font-medium">Rol</th>
                                        <th className="px-4 py-3 font-medium">Estado</th>
                                        <th className="px-4 py-3 font-medium">Creado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="text-sm text-black/75">
                                            <td className="px-4 py-4 font-medium text-black">{user.name}</td>
                                            <td className="px-4 py-4">{user.email}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                    {user.role?.name ?? 'Sin rol'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{user.email_verified_at ? 'Activo' : 'Pendiente'}</td>
                                            <td className="px-4 py-4">{user.created_at ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
