import { useNewsForm } from '@/hooks/news-form';
import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { SystemButton } from '@/components/SystemButton';
import type { NewsCategoryOption } from '../types';

type NewsFormCardProps = {
    categoryOptions: NewsCategoryOption[];
};

export function NewsFormCard({ categoryOptions }: NewsFormCardProps) {
    const { form, setField, submit } = useNewsForm();
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
                    Primero necesitas categorías y subcategorías activas para registrar noticias.
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

                <FloatingInput
                    label="Titulo"
                    name="title"
                    value={data.title}
                    onChange={(event) => setField('title', event.target.value)}
                    error={errors.title}
                    disabled={disableForm}
                />

                <div className="space-y-1">
                    <label htmlFor="excerpt" className="text-xs font-medium text-muted-foreground">
                        Bajada
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={data.excerpt}
                        onChange={(event) => setField('excerpt', event.target.value)}
                        disabled={disableForm}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    />
                    {errors.excerpt ? <p className="text-xs text-red-600 dark:text-red-400">{errors.excerpt}</p> : null}
                </div>

                <div className="space-y-1">
                    <label htmlFor="content" className="text-xs font-medium text-muted-foreground">
                        Contenido
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={data.content}
                        onChange={(event) => setField('content', event.target.value)}
                        disabled={disableForm}
                        rows={8}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    />
                    {errors.content ? <p className="text-xs text-red-600 dark:text-red-400">{errors.content}</p> : null}
                </div>

                <FloatingInput
                    label="Imagen principal"
                    name="cover_image"
                    value={data.cover_image}
                    onChange={(event) => setField('cover_image', event.target.value)}
                    error={errors.cover_image}
                    disabled={disableForm}
                />

                <FloatingInput
                    label="Audio opcional"
                    name="audio_path"
                    value={data.audio_path}
                    onChange={(event) => setField('audio_path', event.target.value)}
                    error={errors.audio_path}
                    disabled={disableForm}
                />

                <div className="space-y-1">
                    <label htmlFor="images" className="text-xs font-medium text-muted-foreground">
                        Imagenes adicionales
                    </label>
                    <textarea
                        id="images"
                        name="images"
                        value={data.images}
                        onChange={(event) => setField('images', event.target.value)}
                        disabled={disableForm}
                        rows={4}
                        placeholder="/storage/news/1/image1.jpg"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    />
                    <p className="text-[11px] text-muted-foreground">Una ruta o URL por línea.</p>
                    {errors.images ? <p className="text-xs text-red-600 dark:text-red-400">{errors.images}</p> : null}
                </div>

                <div className="space-y-1">
                    <label htmlFor="videos" className="text-xs font-medium text-muted-foreground">
                        Videos
                    </label>
                    <textarea
                        id="videos"
                        name="videos"
                        value={data.videos}
                        onChange={(event) => setField('videos', event.target.value)}
                        disabled={disableForm}
                        rows={4}
                        placeholder="https://www.youtube.com/watch?v=xxxxxx"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    />
                    <p className="text-[11px] text-muted-foreground">Si agregas videos, la miniatura será obligatoria.</p>
                    {errors.videos ? <p className="text-xs text-red-600 dark:text-red-400">{errors.videos}</p> : null}
                </div>

                <FloatingInput
                    label="Miniatura de video"
                    name="video_thumbnail"
                    value={data.video_thumbnail}
                    onChange={(event) => setField('video_thumbnail', event.target.value)}
                    error={errors.video_thumbnail}
                    disabled={disableForm}
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
