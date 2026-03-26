import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { UserFormCard } from './users/components/user-form-card';
import { UsersTableCard } from './users/components/users-table-card';
import type { UserFormData, UsersPageProps } from './users/types';

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
    const { users, usersPagination, roles, flash } = usePage<UsersPageProps>().props;
    const canCreateUsers = roles.length > 0;

    const { data, setData, post, processing, errors, reset } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0] ? String(roles[0].id) : '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="container-main py-4 text-xs sm:py-6">
                <div className="flex flex-col gap-6">
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-4 2xl:col-span-3">
                            <UserFormCard
                                data={data}
                                roles={roles}
                                errors={errors}
                                processing={processing}
                                canCreateUsers={canCreateUsers}
                                successMessage={flash?.success}
                                onChange={setData}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    post(route('users.store'), {
                                        onSuccess: () => reset('name', 'email', 'password', 'password_confirmation'),
                                    });
                                }}
                            />
                        </div>

                        <div className="lg:col-span-8 2xl:col-span-9">
                            <UsersTableCard users={users} usersPagination={usersPagination} />
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
