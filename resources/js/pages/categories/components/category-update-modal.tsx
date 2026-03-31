import { FloatingInput } from '@/components/FloatingInput';
import { Modal } from '@/components/modales/Modal';
import { SystemButton } from '@/components/SystemButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { CategoryFormData, CategoryTableItem } from '../types';

type CategoryUpdateModalProps = {
    open: boolean;
    category: CategoryTableItem | null;
    onClose: () => void;
};

export function CategoryUpdateModal({ open, category, onClose }: CategoryUpdateModalProps) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm<CategoryFormData>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (!category || !open) {
            return;
        }

        setData({
            name: category.name,
            description: category.description ?? '',
        });
    }, [category, open, setData]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title={category ? `Editar categoria: ${category.name}` : 'Editar categoria'} className="w-full max-w-xs">
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();

                    if (!category) {
                        return;
                    }

                    patch(route('categories.update', category.id), {
                        data,
                        preserveScroll: true,
                        preserveState: true,
                        errorBag: 'updateCategory',
                        onSuccess: () => {
                            handleClose();
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
                    label="Descripcion"
                    name="description"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    error={errors.description}
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
