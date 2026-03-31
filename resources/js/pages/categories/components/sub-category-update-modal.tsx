import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { Modal } from '@/components/modales/Modal';
import { SystemButton } from '@/components/SystemButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { CategoryOption, SubCategoryFormData, SubCategoryTableItem } from '../types';

type SubCategoryUpdateModalProps = {
    open: boolean;
    subCategory: SubCategoryTableItem | null;
    categoryOptions: CategoryOption[];
    onClose: () => void;
};

export function SubCategoryUpdateModal({ open, subCategory, categoryOptions, onClose }: SubCategoryUpdateModalProps) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm<SubCategoryFormData>({
        category_id: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        if (!subCategory || !open) {
            return;
        }

        setData({
            category_id: String(subCategory.category_id),
            name: subCategory.name,
            description: subCategory.description ?? '',
        });
    }, [open, setData, subCategory]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title={subCategory ? `Editar subcategoria: ${subCategory.name}` : 'Editar subcategoria'} className="w-full max-w-xs">
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();

                    if (!subCategory) {
                        return;
                    }

                    patch(route('sub-categories.update', subCategory.id), {
                        data,
                        preserveScroll: true,
                        preserveState: true,
                        errorBag: 'updateSubCategory',
                        onSuccess: () => {
                            handleClose();
                        },
                    });
                }}
            >
                <FloatingSelect
                    label="Selecciona la categoria"
                    name="category_id"
                    value={data.category_id}
                    options={categoryOptions.map((category) => ({ value: String(category.id), label: category.name }))}
                    onChange={(value) => setData('category_id', value)}
                    error={errors.category_id}
                    placeholder=""
                    searchable
                    disabled={processing}
                />

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
