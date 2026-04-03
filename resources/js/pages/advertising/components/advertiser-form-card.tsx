import { FloatingInput } from '@/components/FloatingInput';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import { SystemButton } from '@/components/SystemButton';
import type { InertiaFormProps } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import type { AdvertiserFormData } from '../types';
import { SectionCard } from './section-card';

type AdvertiserFormCardProps = {
    form: InertiaFormProps<AdvertiserFormData>;
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
};

export function AdvertiserFormCard({ form, isEditing, onSubmit, onCancel }: AdvertiserFormCardProps) {
    return (
        <SectionCard
            icon={<Megaphone className="h-5 w-5" />}
            title={isEditing ? 'Editar anunciante' : 'Crear anunciante'}
            description="Registra la empresa o persona que contratara publicidad."
        >
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                <FloatingInput label="Nombre comercial" name="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} error={form.errors.name} />
                <FloatingInput label="Empresa" name="company_name" value={form.data.company_name} onChange={(event) => form.setData('company_name', event.target.value)} error={form.errors.company_name} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FloatingInput label="Tipo documento" name="document_type" value={form.data.document_type} onChange={(event) => form.setData('document_type', event.target.value)} error={form.errors.document_type} />
                    <FloatingInput label="Numero documento" name="document_number" value={form.data.document_number} onChange={(event) => form.setData('document_number', event.target.value)} error={form.errors.document_number} />
                </div>
                <FloatingInput label="Nombre de contacto" name="contact_name" value={form.data.contact_name} onChange={(event) => form.setData('contact_name', event.target.value)} error={form.errors.contact_name} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FloatingInput label="Telefono" name="contact_phone" value={form.data.contact_phone} onChange={(event) => form.setData('contact_phone', event.target.value)} error={form.errors.contact_phone} />
                    <FloatingInput label="Correo" name="contact_email" type="email" value={form.data.contact_email} onChange={(event) => form.setData('contact_email', event.target.value)} error={form.errors.contact_email} />
                </div>
                <FloatingTextarea label="Notas" name="notes" value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} error={form.errors.notes} rows={4} className="min-h-24" />
                <div className="flex gap-3">
                    <SystemButton type="submit" size="sm" fullWidth loading={form.processing}>{isEditing ? 'Guardar anunciante' : 'Crear anunciante'}</SystemButton>
                    {isEditing ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={onCancel}>Cancelar</SystemButton> : null}
                </div>
            </form>
        </SectionCard>
    );
}
