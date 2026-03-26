import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { Modal } from '@/components/modales/Modal';
import { SystemButton } from '@/components/SystemButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { UserRole, UserTableItem, UserUpdateFormData } from '../types';

type UserUpdateModalProps = {
    open: boolean;
    user: UserTableItem | null;
    roles: UserRole[];
    page: number;
    onClose: () => void;
};

export function UserUpdateModal({ open, user, roles, page, onClose }: UserUpdateModalProps) {
    const { data, setData, patch, processing, errors, reset } = useForm<UserUpdateFormData>({
        name: '',
        email: '',
        role_id: '',
    });

    useEffect(() => {
        if (!user || !open) {
            return;
        }

        setData({
            name: user.name,
            email: user.email,
            role_id: user.role ? String(user.role.id) : '',
        });
    }, [open, setData, user]);

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={user ? `Editar usuario: ${user.name}` : 'Editar usuario'}
            className="w-full max-w-xs"
            bodyClassName="text-sm text-foreground"
        >
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();

                    if (!user) {
                        return;
                    }

                    patch(route('users.update', user.id), {
                        data: { ...data, page },
                        preserveScroll: true,
                        onSuccess: () => {
                            reset();
                            onClose();
                        },
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

                <div className="flex justify-end gap-3 pt-2">
                    <SystemButton type="button" variant="secondary" size="sm" onClick={handleClose} disabled={processing}>
                        Cancelar
                    </SystemButton>

                    <SystemButton type="submit" size="sm" loading={processing}>
                        Guardar
                    </SystemButton>
                </div>
            </form>
        </Modal>
    );
}
