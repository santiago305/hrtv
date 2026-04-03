import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import InputImages from '@/components/input_images/input-images';
import { SystemButton } from '@/components/SystemButton';
import type { InertiaFormProps } from '@inertiajs/react';
import { ImagePlus } from 'lucide-react';
import type { CreativeFormData } from '../types';
import { SectionCard } from './section-card';

type CreativeFormCardProps = {
    form: InertiaFormProps<CreativeFormData>;
    campaignOptions: Array<{ value: string; label: string }>;
    slotOptions: Array<{ value: string; label: string }>;
    isEditing: boolean;
    hasSelectedCampaign: boolean;
    previewUrls: string[];
    resetKey: number;
    onFilesUpload: (files: File[], previewUrls: string[]) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onCampaignChange: (value: string) => void;
};

export function CreativeFormCard({
    form,
    campaignOptions,
    slotOptions,
    isEditing,
    hasSelectedCampaign,
    previewUrls,
    resetKey,
    onFilesUpload,
    onSubmit,
    onCancel,
    onCampaignChange,
}: CreativeFormCardProps) {
    return (
        <SectionCard
            icon={<ImagePlus className="h-5 w-5" />}
            title={isEditing ? 'Editar banner creativo' : 'Subir banner creativo'}
            description="Carga una imagen por banner. La URL de destino es opcional."
        >
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingSelect label="Campana" name="campaign_id" value={form.data.campaign_id} options={campaignOptions} onChange={onCampaignChange} error={form.errors.campaign_id} placeholder="" searchable />
                    <FloatingSelect label="Slot" name="ad_slot_id" value={form.data.ad_slot_id} options={slotOptions} onChange={(value) => form.setData('ad_slot_id', value)} error={form.errors.ad_slot_id} placeholder="" searchable disabled={!hasSelectedCampaign} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingInput label="Titulo" name="creative_title" value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} error={form.errors.title} />
                    <FloatingInput label="URL destino opcional" name="target_url" value={form.data.target_url} onChange={(event) => form.setData('target_url', event.target.value)} error={form.errors.target_url} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingInput label="Texto alternativo" name="alt_text" value={form.data.alt_text} onChange={(event) => form.setData('alt_text', event.target.value)} error={form.errors.alt_text} />
                    <FloatingInput label="Peso interno" name="display_weight" type="number" min={1} max={100} value={form.data.display_weight} onChange={(event) => form.setData('display_weight', Number(event.target.value || 1))} error={form.errors.display_weight} />
                </div>
                <InputImages id="creative-upload" label={isEditing ? 'Reemplazar imagen del banner' : 'Subir imagen del banner'} accept="image/*" error={form.errors.creative_file ?? null} previewUrls={previewUrls} onFilesUpload={onFilesUpload} resetKey={resetKey} helperText="Usa exactamente el tamano del slot elegido. Puedes dejar la URL vacia si no debe redirigir." />
                <div className="flex gap-3">
                    <SystemButton type="submit" size="sm" fullWidth loading={form.processing}>{isEditing ? 'Guardar banner' : 'Crear banner'}</SystemButton>
                    {isEditing ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={onCancel}>Cancelar</SystemButton> : null}
                </div>
            </form>
        </SectionCard>
    );
}
