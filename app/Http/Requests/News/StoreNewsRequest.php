<?php

namespace App\Http\Requests\News;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreNewsRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'images' => $this->normalizeMediaInput($this->input('images')),
            'videos' => $this->normalizeMediaInput($this->input('videos')),
            'is_breaking' => $this->boolean('is_breaking'),
            'is_featured' => $this->boolean('is_featured'),
            'is_published' => $this->boolean('is_published'),
            'views_count' => $this->filled('views_count') ? (int) $this->input('views_count') : 0,
            'likes_count' => $this->filled('likes_count') ? (int) $this->input('likes_count') : 0,
        ]);
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists(Category::class, 'id')],
            'sub_category_id' => ['required', 'integer', Rule::exists(SubCategory::class, 'id')],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'audio_path' => ['nullable', 'string', 'max:255'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:255'],
            'videos' => ['nullable', 'array'],
            'videos.*' => ['string', 'max:255'],
            'video_thumbnail' => ['nullable', 'string', 'max:255'],
            'is_breaking' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'views_count' => ['nullable', 'integer', 'min:0'],
            'likes_count' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $categoryId = $this->integer('category_id');
                $subCategoryId = $this->integer('sub_category_id');

                if ($categoryId > 0 && $subCategoryId > 0) {
                    $belongsToCategory = SubCategory::query()
                        ->whereKey($subCategoryId)
                        ->where('category_id', $categoryId)
                        ->exists();

                    if (! $belongsToCategory) {
                        $validator->errors()->add('sub_category_id', 'La subcategoría no pertenece a la categoría seleccionada.');
                    }
                }

                if (($this->input('videos') ?? []) !== [] && blank($this->input('video_thumbnail'))) {
                    $validator->errors()->add('video_thumbnail', 'La miniatura del video es obligatoria cuando registras videos.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'La categoría es obligatoria.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'sub_category_id.required' => 'La subcategoría es obligatoria.',
            'sub_category_id.exists' => 'La subcategoría seleccionada no existe.',
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no debe superar los 255 caracteres.',
            'content.required' => 'El contenido es obligatorio.',
            'views_count.min' => 'Las visualizaciones no pueden ser negativas.',
            'likes_count.min' => 'Los me gusta no pueden ser negativos.',
            'published_at.date' => 'La fecha de publicación no tiene un formato válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'categoría',
            'sub_category_id' => 'subcategoría',
            'title' => 'título',
            'excerpt' => 'bajada',
            'content' => 'contenido',
            'cover_image' => 'imagen principal',
            'audio_path' => 'audio',
            'images' => 'imágenes',
            'videos' => 'videos',
            'video_thumbnail' => 'miniatura del video',
            'views_count' => 'visualizaciones',
            'likes_count' => 'me gusta',
            'published_at' => 'fecha de publicación',
        ];
    }

    private function normalizeMediaInput(mixed $value): ?array
    {
        if (! is_string($value)) {
            return null;
        }

        $items = collect(preg_split('/\r\n|\r|\n/', $value) ?: [])
            ->map(fn ($item) => trim($item))
            ->filter()
            ->values()
            ->all();

        return $items === [] ? null : $items;
    }
}
