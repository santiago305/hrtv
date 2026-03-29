import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Trash2 } from 'lucide-react';
import { type FormEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuracion del perfil',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [previewUrl, setPreviewUrl] = useState<string | null>(auth.user.avatar ?? null);

    const { data, setData, post, transform, errors, processing, recentlySuccessful } = useForm({
        _method: 'patch' as const,
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | null,
        remove_avatar: false,
    });

    useEffect(() => {
        setPreviewUrl(auth.user.avatar ?? null);
    }, [auth.user.avatar]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((current) => ({
            ...current,
            name: current.name?.trim() || auth.user.name,
            email: current.email?.trim() || auth.user.email,
        }));

        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuracion del perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informacion del perfil" description="Actualiza tu nombre, correo y foto de perfil." />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-4">
                                    <Avatar className="h-16 w-16 shrink-0 rounded-2xl border border-border/60 bg-muted">
                                        <AvatarImage src={previewUrl ?? undefined} alt={auth.user.name} className="object-cover" />
                                        <AvatarFallback className="rounded-2xl bg-primary/10 text-base font-semibold text-primary">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground">Foto de perfil</p>
                                        <p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">
                                            Solo se permite formato WEBP.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:justify-end">
                                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                        <Camera className="h-4 w-4" />
                                        <span>Subir</span>

                                        <input
                                            type="file"
                                            accept="image/webp"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;

                                                setData('avatar', file);
                                                setData('remove_avatar', false);

                                                if (!file) {
                                                    setPreviewUrl(auth.user.avatar ?? null);
                                                    return;
                                                }

                                                const nextPreviewUrl = URL.createObjectURL(file);
                                                setPreviewUrl((current) => {
                                                    if (current?.startsWith('blob:')) {
                                                        URL.revokeObjectURL(current);
                                                    }

                                                    return nextPreviewUrl;
                                                });
                                            }}
                                        />
                                    </label>

                                    {(previewUrl || auth.user.avatar) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-10 rounded-xl px-3 text-muted-foreground hover:text-destructive"
                                            onClick={() => {
                                                if (previewUrl?.startsWith('blob:')) {
                                                    URL.revokeObjectURL(previewUrl);
                                                }

                                                setPreviewUrl(null);
                                                setData('avatar', null);
                                                setData('remove_avatar', true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <InputError className="mt-3" message={errors.avatar} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nombre completo"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electronico</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                readOnly
                                disabled
                                aria-readonly="true"
                                autoComplete="username"
                                placeholder="Correo electronico"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
                                    Tu correo electronico no esta verificado.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden dark:text-neutral-300 dark:hover:text-white"
                                    >
                                        Haz clic aqui para reenviar el correo de verificacion.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                        Se ha enviado un nuevo enlace de verificacion a tu correo electronico.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
