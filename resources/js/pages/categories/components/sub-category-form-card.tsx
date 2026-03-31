import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { SystemButton } from '@/components/SystemButton';
import { Shapes } from 'lucide-react';
import type { CategoryOption, SubCategoryFormData } from '../types';

type SubCategoryFormCardProps = {
    data: SubCategoryFormData;
    categoryOptions: CategoryOption[];
    errors: Partial<Record<keyof SubCategoryFormData, string>>;
    processing: boolean;
    onChange: <K extends keyof SubCategoryFormData>(field: K, value: SubCategoryFormData[K]) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function SubCategoryFormCard({ data, categoryOptions, errors, processing, onChange, onSubmit }: SubCategoryFormCardProps) {
    const disabled = processing || categoryOptions.length === 0;

    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                    <Shapes className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-foreground">Crear subcategoria</h2>
                    <p className="text-xs text-muted-foreground">Asigna cada subcategoria a una categoria activa.</p>
                </div>
            </div>

            {categoryOptions.length === 0 ? (
                <div className="mb-4 rounded-sm border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                    Primero crea una categoria para habilitar el registro de subcategorias.
                </div>
            ) : null}

            <form className="space-y-4" onSubmit={onSubmit}>
                <FloatingSelect
                    label="Selecciona la categoria"
                    name="category_id"
                    value={data.category_id}
                    options={categoryOptions.map((category) => ({ value: String(category.id), label: category.name }))}
                    onChange={(value) => onChange('category_id', value)}
                    error={errors.category_id}
                    placeholder=""
                    searchable
                    disabled={disabled}
                />

                <FloatingInput
                    label="Nombre"
                    name="name"
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    error={errors.name}
                    disabled={disabled}
                />

                <FloatingInput
                    label="Descripcion"
                    name="description"
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    error={errors.description}
                    disabled={disabled}
                />

                <SystemButton type="submit" size="sm" fullWidth loading={processing} className="mt-2" variant="secondary" disabled={categoryOptions.length === 0}>
                    Crear subcategoria
                </SystemButton>
            </form>
        </div>
    );
}
