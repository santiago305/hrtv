import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import { SystemButton } from '@/components/SystemButton';
import type { InertiaFormProps } from '@inertiajs/react';
import { SquareChartGantt } from 'lucide-react';
import { AD_SIZES, PAGE_TYPES } from '../constants';
import type { SlotFormData } from '../types';
import { SectionCard } from './section-card';

type SlotFormCardProps = {
    form: InertiaFormProps<SlotFormData>;
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
};

export function SlotFormCard({ form, isEditing, onSubmit, onCancel }: SlotFormCardProps) {
    return (
        <SectionCard
            icon={<SquareChartGantt className="h-5 w-5" />}
            title={isEditing ? 'Editar slot publicitario' : 'Crear slot publicitario'}
            description="Define el espacio exacto donde puede mostrarse publicidad."
        >
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                <FloatingInput label="Codigo unico" name="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value)} error={form.errors.code} />
                <FloatingInput label="Nombre del slot" name="slot_name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} error={form.errors.name} />
                <FloatingSelect label="Pagina" name="page_type" value={form.data.page_type} options={PAGE_TYPES} onChange={(value) => form.setData('page_type', value)} error={form.errors.page_type} placeholder="" />
                <FloatingSelect label="Tamano" name="size" value={form.data.size} options={AD_SIZES.map((size) => ({ value: size.value, label: `${size.label} (${size.width}x${size.height})` }))} onChange={(value) => form.setData('size', value)} error={form.errors.size} placeholder="" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FloatingInput label="Ancho" name="banner_width" type="number" value={form.data.banner_width} onChange={(event) => form.setData('banner_width', event.target.value)} error={form.errors.banner_width} />
                    <FloatingInput label="Alto" name="banner_height" type="number" value={form.data.banner_height} onChange={(event) => form.setData('banner_height', event.target.value)} error={form.errors.banner_height} />
                </div>
                <FloatingTextarea label="Descripcion" name="description" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} error={form.errors.description} rows={4} className="min-h-24" />
                <div className="flex gap-3">
                    <SystemButton type="submit" size="sm" fullWidth loading={form.processing}>{isEditing ? 'Guardar slot' : 'Crear slot'}</SystemButton>
                    {isEditing ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={onCancel}>Cancelar</SystemButton> : null}
                </div>
            </form>
        </SectionCard>
    );
}
