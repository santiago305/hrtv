import { FloatingInput } from '@/components/FloatingInput';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import InputImages from '@/components/input_images/input-images';
import { FloatingSelect } from '@/components/FloatingSelect';
import { SystemButton } from '@/components/SystemButton';
import { useNewsForm } from '@/hooks/news-form';
import type { NewsCategoryOption } from '../types';

type NewsFormCardProps = {
    categoryOptions: NewsCategoryOption[];
};

export function NewsFormCard({ categoryOptions }: NewsFormCardProps) {
    const { form, media, setAudio, setCoverImage, setField, setImages, setVideos, submit } = useNewsForm();
    const { data, errors, processing } = form;
    const selectedCategory = categoryOptions.find((category) => String(category.id) === data.category_id) ?? null;
    const subCategoryOptions = selectedCategory?.sub_categories ?? [];
    const disableSubCategory = processing || !selectedCategory;
    const disableForm = processing || categoryOptions.length === 0;

    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="text-sm font-bold">N</span>
                </div>

                <div>
                    <h1 className="text-base font-semibold text-foreground">Crear noticia</h1>
                </div>
            </div>

            {categoryOptions.length === 0 ? (
                <div className="mb-4 rounded-sm border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                    Primero necesitas categorias y subcategorias activas para registrar noticias.
                </div>
            ) : null}

            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <FloatingSelect
                    label="Categoria"
                    name="category_id"
                    value={data.category_id}
                    options={categoryOptions.map((category) => ({ value: String(category.id), label: category.name }))}
                    onChange={(value) => {
                        setField('category_id', value);
                        setField('sub_category_id', '');
                    }}
                    error={errors.category_id}
                    placeholder=""
                    searchable
                    disabled={disableForm}
                />

                {selectedCategory ? (
                    <FloatingSelect
                        label="Subcategoria"
                        name="sub_category_id"
                        value={data.sub_category_id}
                        options={subCategoryOptions.map((subCategory) => ({ value: String(subCategory.id), label: subCategory.name }))}
                        onChange={(value) => setField('sub_category_id', value)}
                        error={errors.sub_category_id}
                        placeholder=""
                        searchable
                        disabled={disableSubCategory}
                    />
                ) : null}

                <FloatingInput
                    label="Titulo"
                    name="title"
                    value={data.title}
                    onChange={(event) => setField('title', event.target.value)}
                    error={errors.title}
                    disabled={disableForm}
                />

                <FloatingTextarea
                    label="Bajada"
                    name="excerpt"
                    value={data.excerpt}
                    onChange={(event) => setField('excerpt', event.target.value)}
                    error={errors.excerpt}
                    disabled={disableForm}
                    rows={3}
                    className="min-h-24"
                />

                <FloatingTextarea
                    label="Contenido"
                    name="content"
                    value={data.content}
                    onChange={(event) => setField('content', event.target.value)}
                    error={errors.content}
                    disabled={disableForm}
                    rows={8}
                    className="min-h-44"
                />

                <InputImages
                    id="cover-image-upload"
                    label="Subir imagen de portada"
                    accept="image/*"
                    error={errors.cover_image ?? null}
                    previewUrls={media.coverImagePreview ? [media.coverImagePreview] : []}
                    onFilesUpload={setCoverImage}
                    resetKey={media.resetKey}
                />

                <InputImages
                    id="news-audio-upload"
                    label="Subir audio opcional"
                    accept="audio/*"
                    error={errors.audio_path}
                    previewUrls={media.audioPreview ? [media.audioPreview] : []}
                    onFilesUpload={setAudio}
                    resetKey={media.resetKey}
                    helperText="Acepta archivos de audio como MP3, WAV, OGG o M4A."
                    maxPreviewHeight="h-20"
                />

                <InputImages
                    id="news-images-upload"
                    label="Subir imagenes adicionales"
                    accept="image/*"
                    multiple
                    error={errors.images ?? null}
                    previewUrls={media.imagePreviews}
                    onFilesUpload={setImages}
                    resetKey={media.resetKey}
                />

                <InputImages
                    id="news-videos-upload"
                    label="Subir videos"
                    accept="video/*"
                    multiple
                    error={errors.videos ?? null}
                    previewUrls={media.videoPreviews}
                    onFilesUpload={setVideos}
                    resetKey={media.resetKey}
                />

                <FloatingInput
                    label="Fecha de publicacion"
                    name="published_at"
                    type="datetime-local"
                    value={data.published_at}
                    onChange={(event) => setField('published_at', event.target.value)}
                    error={errors.published_at}
                    disabled={disableForm}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={data.is_breaking}
                            onChange={(event) => setField('is_breaking', event.target.checked)}
                            disabled={disableForm}
                            className="h-4 w-4"
                        />
                        Urgente
                    </label>

                    <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(event) => setField('is_featured', event.target.checked)}
                            disabled={disableForm}
                            className="h-4 w-4"
                        />
                        Destacada
                    </label>

                    <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(event) => setField('is_published', event.target.checked)}
                            disabled={disableForm}
                            className="h-4 w-4"
                        />
                        Publicada
                    </label>
                </div>

                <SystemButton type="submit" size="sm" fullWidth loading={processing} disabled={categoryOptions.length === 0}>
                    Crear noticia
                </SystemButton>
            </form>
        </div>
    );
}
