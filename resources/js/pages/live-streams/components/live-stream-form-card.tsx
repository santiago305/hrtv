import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import InputImages from '@/components/input_images/input-images';
import { SystemButton } from '@/components/SystemButton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioTower } from 'lucide-react';
import type { LiveStreamFormData, LiveStreamStatus } from '../types';

type LiveStreamFormCardProps = {
    data: LiveStreamFormData;
    errors: Partial<Record<keyof LiveStreamFormData, string>>;
    processing: boolean;
    isEditing: boolean;
    thumbnailPreviewUrls: string[];
    thumbnailResetKey: number;
    onThumbnailUpload: (files: File[], previews: string[]) => void;
    onChange: <K extends keyof LiveStreamFormData>(field: K, value: LiveStreamFormData[K]) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

const STATUS_OPTIONS: Array<{ value: LiveStreamStatus; label: string }> = [
    { value: 'draft', label: 'Borrador' },
    { value: 'scheduled', label: 'Programada' },
    { value: 'live', label: 'En vivo' },
    { value: 'ended', label: 'Finalizada' },
];

export function LiveStreamFormCard({ data, errors, processing, isEditing, thumbnailPreviewUrls, thumbnailResetKey, onThumbnailUpload, onChange, onSubmit, onCancel }: LiveStreamFormCardProps) {
    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <RadioTower className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-base font-semibold text-foreground">{isEditing ? 'Editar transmision' : 'Nueva transmision'}</h1>
                    <p className="text-xs text-muted-foreground">Registra enlaces de YouTube y controla su estado desde el dashboard.</p>
                </div>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
                <FloatingInput label="Titulo" name="title" value={data.title} onChange={(event) => onChange('title', event.target.value)} error={errors.title} disabled={processing} />

                <FloatingTextarea
                    label="Descripcion corta"
                    name="short_description"
                    value={data.short_description}
                    onChange={(event) => onChange('short_description', event.target.value)}
                    error={errors.short_description}
                    rows={3}
                    className="min-h-20"
                    disabled={processing}
                />

                <FloatingTextarea
                    label="Descripcion completa"
                    name="description"
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    error={errors.description}
                    rows={5}
                    className="min-h-28"
                    disabled={processing}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingSelect
                        label="Estado"
                        name="status"
                        value={data.status}
                        options={STATUS_OPTIONS}
                        onChange={(value) => onChange('status', value as LiveStreamStatus)}
                        error={errors.status}
                        disabled={processing}
                        placeholder=""
                    />

                    <FloatingInput label="Plataforma" name="platform" value={data.platform} onChange={(event) => onChange('platform', event.target.value)} error={errors.platform} disabled />
                </div>

                <FloatingInput
                    label="URL de YouTube"
                    name="youtube_url"
                    value={data.youtube_url}
                    onChange={(event) => onChange('youtube_url', event.target.value)}
                    error={errors.youtube_url}
                    disabled={processing}
                />

                <FloatingInput
                    label="Video ID"
                    name="youtube_video_id"
                    value={data.youtube_video_id}
                    onChange={(event) => onChange('youtube_video_id', event.target.value)}
                    error={errors.youtube_video_id}
                    disabled={processing}
                />

                <FloatingTextarea
                    label="Iframe opcional"
                    name="iframe_html"
                    value={data.iframe_html}
                    onChange={(event) => onChange('iframe_html', event.target.value)}
                    error={errors.iframe_html}
                    rows={4}
                    className="min-h-24"
                    disabled={processing}
                />

                <InputImages
                    id="live-stream-thumbnail-upload"
                    label="Subir miniatura"
                    accept="image/*"
                    error={errors.thumbnail_image ?? null}
                    previewUrls={thumbnailPreviewUrls}
                    onFilesUpload={onThumbnailUpload}
                    resetKey={thumbnailResetKey}
                    helperText="Carga una imagen propia para usarla como miniatura de la transmision."
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingInput
                        label="Fecha programada"
                        name="scheduled_at"
                        type="datetime-local"
                        value={data.scheduled_at}
                        onChange={(event) => onChange('scheduled_at', event.target.value)}
                        error={errors.scheduled_at}
                        disabled={processing}
                    />

                    <FloatingInput
                        label="Inicio real"
                        name="started_at"
                        type="datetime-local"
                        value={data.started_at}
                        onChange={(event) => onChange('started_at', event.target.value)}
                        error={errors.started_at}
                        disabled={processing}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingInput
                        label="Finalizacion"
                        name="ended_at"
                        type="datetime-local"
                        value={data.ended_at}
                        onChange={(event) => onChange('ended_at', event.target.value)}
                        error={errors.ended_at}
                        disabled={processing}
                    />

                    <FloatingInput
                        label="Orden manual"
                        name="sort_order"
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(event) => onChange('sort_order', event.target.value)}
                        error={errors.sort_order}
                        disabled={processing}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                        <Checkbox checked={data.is_active} onCheckedChange={(checked) => onChange('is_active', checked === true)} id="stream-is-active" />
                        <Label htmlFor="stream-is-active" className="text-xs font-medium text-foreground">
                            Mostrar en el sistema
                        </Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox checked={data.is_featured} onCheckedChange={(checked) => onChange('is_featured', checked === true)} id="stream-is-featured" />
                        <Label htmlFor="stream-is-featured" className="text-xs font-medium text-foreground">
                            Marcar como destacada
                        </Label>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <SystemButton type="submit" size="sm" fullWidth loading={processing}>
                        {isEditing ? 'Guardar cambios' : 'Crear transmision'}
                    </SystemButton>

                    {isEditing && (
                        <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={onCancel} disabled={processing}>
                            Cancelar edicion
                        </SystemButton>
                    )}
                </div>
            </form>
        </div>
    );
}
