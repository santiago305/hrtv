import { FloatingInput } from '@/components/FloatingInput';
import { SystemButton } from '@/components/SystemButton';
import { FolderPlus } from 'lucide-react';
import type { CategoryFormData } from '../types';

type CategoryFormCardProps = {
    data: CategoryFormData;
    errors: Partial<Record<keyof CategoryFormData, string>>;
    processing: boolean;
    onChange: <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CategoryFormCard({ data, errors, processing, onChange, onSubmit }: CategoryFormCardProps) {
    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FolderPlus className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-base font-semibold text-foreground">Crear categoria</h1>
                    <p className="text-xs text-muted-foreground">Registra una categoria principal visible en el dashboard.</p>
                </div>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
                <FloatingInput
                    label="Nombre"
                    name="name"
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    error={errors.name}
                    disabled={processing}
                />

                <FloatingInput
                    label="Descripcion"
                    name="description"
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    error={errors.description}
                    disabled={processing}
                />

                <SystemButton type="submit" size="sm" fullWidth loading={processing} className="mt-2">
                    Crear categoria
                </SystemButton>
            </form>
        </div>
    );
}
