import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import { SystemButton } from '@/components/SystemButton';
import type { InertiaFormProps } from '@inertiajs/react';
import { SlidersVertical } from 'lucide-react';
import { CAMPAIGN_STATUSES } from '../constants';
import type { AdSlotItem, CampaignFormData } from '../types';
import { PrioritySlider } from './priority-slider';
import { SectionCard } from './section-card';

type CampaignFormCardProps = {
    form: InertiaFormProps<CampaignFormData>;
    advertiserOptions: Array<{ value: string; label: string }>;
    adSlots: AdSlotItem[];
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
};

export function CampaignFormCard({ form, advertiserOptions, adSlots, isEditing, onSubmit, onCancel }: CampaignFormCardProps) {
    return (
        <SectionCard
            icon={<SlidersVertical className="h-5 w-5" />}
            title={isEditing ? 'Editar campana' : 'Crear campana'}
            description="Asigna anunciante, vigencia, slots y prioridad de salida."
        >
            <form className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_220px]" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                <div className="space-y-4">
                    <FloatingSelect label="Anunciante" name="advertiser_id" value={form.data.advertiser_id} options={advertiserOptions} onChange={(value) => form.setData('advertiser_id', value)} error={form.errors.advertiser_id} placeholder="" searchable />
                    <FloatingInput label="Nombre de campana" name="campaign_name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} error={form.errors.name} />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FloatingInput label="Fecha inicio" name="start_date" type="date" value={form.data.start_date} onChange={(event) => form.setData('start_date', event.target.value)} error={form.errors.start_date} />
                        <FloatingInput label="Fecha fin" name="end_date" type="date" value={form.data.end_date} onChange={(event) => form.setData('end_date', event.target.value)} error={form.errors.end_date} />
                    </div>
                    <FloatingSelect label="Estado" name="status" value={form.data.status} options={CAMPAIGN_STATUSES} onChange={(value) => form.setData('status', value)} error={form.errors.status} placeholder="" />

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="mb-3 text-sm font-semibold text-foreground">Slots disponibles</div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {adSlots.length === 0 ? <span className="text-xs text-muted-foreground">Primero crea slots publicitarios.</span> : adSlots.map((slot) => {
                                const checked = form.data.slot_ids.includes(String(slot.id));
                                return (
                                    <label key={slot.id} className="flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-3 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(event) => form.setData('slot_ids', event.target.checked ? [...form.data.slot_ids, String(slot.id)] : form.data.slot_ids.filter((id) => id !== String(slot.id)))}
                                            className="mt-0.5 h-4 w-4"
                                        />
                                        <div>
                                            <div className="font-medium text-foreground">{slot.name}</div>
                                            <div className="text-[11px] text-muted-foreground">{slot.code} / {slot.page_type} / {slot.banner_width}x{slot.banner_height}</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        {form.errors.slot_ids ? <p className="mt-2 text-xs text-red-600 dark:text-red-400">{form.errors.slot_ids}</p> : null}
                    </div>

                    <FloatingTextarea label="Notas" name="campaign_notes" value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} error={form.errors.notes} rows={4} className="min-h-24" />
                    <div className="flex gap-3">
                        <SystemButton type="submit" size="sm" fullWidth loading={form.processing}>{isEditing ? 'Guardar campana' : 'Crear campana'}</SystemButton>
                        {isEditing ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={onCancel}>Cancelar</SystemButton> : null}
                    </div>
                </div>

                <PrioritySlider value={form.data.priority_weight} onChange={(value) => form.setData('priority_weight', value)} disabled={form.processing} />
            </form>
        </SectionCard>
    );
}
