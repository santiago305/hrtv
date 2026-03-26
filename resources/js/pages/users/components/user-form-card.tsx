import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { SystemButton } from '@/components/SystemButton';
import { UserPlus } from 'lucide-react';
import type { UserFormData, UserRole } from '../types';

type UserFormCardProps = {
    data: UserFormData;
    roles: UserRole[];
    errors: Partial<Record<keyof UserFormData, string>>;
    processing: boolean;
    canCreateUsers: boolean;
    successMessage?: string;
    onChange: <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function UserFormCard({
    data,
    roles,
    errors,
    processing,
    canCreateUsers,
    successMessage,
    onChange,
    onSubmit,
}: UserFormCardProps) {
    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6 lg:sticky lg:top-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserPlus className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-base font-semibold text-foreground">Crear usuario</h1>
                </div>
            </div>

            {successMessage && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                    {successMessage}
                </div>
            )}

            {!canCreateUsers && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                    Tu rol no tiene permisos para crear usuarios por debajo en la jerarquia actual.
                </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
                <FloatingInput
                    label="Nombre"
                    name="name"
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    error={errors.name}
                    disabled={processing || !canCreateUsers}
                />

                <FloatingInput
                    label="Correo electronico"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(event) => onChange('email', event.target.value)}
                    error={errors.email}
                    disabled={processing || !canCreateUsers}
                />

                <FloatingSelect
                    label="Rol"
                    name="role_id"
                    value={data.role_id}
                    options={roles.map((role) => ({
                        value: String(role.id),
                        label: role.name,
                    }))}
                    onChange={(value) => onChange('role_id', value)}
                    error={errors.role_id}
                    placeholder="Selecciona un rol"
                    disabled={processing || !canCreateUsers}
                />

                <FloatingInput
                    label="Contrasena"
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={(event) => onChange('password', event.target.value)}
                    error={errors.password}
                    disabled={processing || !canCreateUsers}
                />

                <FloatingInput
                    label="Confirmar contrasena"
                    name="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(event) => onChange('password_confirmation', event.target.value)}
                    error={errors.password_confirmation}
                    disabled={processing || !canCreateUsers}
                />

                <SystemButton type="submit" size="sm" fullWidth loading={processing} className="mt-2" disabled={!canCreateUsers}>
                    Crear usuario
                </SystemButton>
            </form>
        </div>
    );
}
