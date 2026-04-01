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
            'sub_category_id' => ['nullable', 'integer', Rule::exists(SubCategory::class, 'id')],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'cover_image' => ['required', 'file', 'image', 'max:10240'],
            'audio_path' => ['nullable', 'file', 'mimetypes:audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,audio/mp4,audio/x-m4a', 'max:51200'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:10240'],
            'videos' => ['nullable', 'array'],
            'videos.*' => ['file', 'mimetypes:video/mp4,video/webm,video/ogg,video/quicktime', 'max:102400'],
            'is_breaking' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'views_count' => ['nullable', 'integer', 'min:0'],
            'likes_count' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['required', 'date'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $categoryId = $this->integer('category_id');
                $subCategoryId = $this->integer('sub_category_id');
                $hasImages = $this->hasFile('images');
                $hasVideos = $this->hasFile('videos');

                if ($categoryId > 0 && $subCategoryId > 0) {
                    $belongsToCategory = SubCategory::query()
                        ->whereKey($subCategoryId)
                        ->where('category_id', $categoryId)
                        ->exists();

                    if (! $belongsToCategory) {
                        $validator->errors()->add('sub_category_id', 'La subcategoria no pertenece a la categoria seleccionada.');
                    }
                }

                if (! $hasImages && ! $hasVideos) {
                    $validator->errors()->add('images', 'Debes subir al menos imagenes o videos.');
                    $validator->errors()->add('videos', 'Debes subir al menos imagenes o videos.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'La categoria es obligatoria.',
            'category_id.exists' => 'La categoria seleccionada no existe.',
            'sub_category_id.exists' => 'La subcategoria seleccionada no existe.',
            'title.required' => 'El titulo es obligatorio.',
            'title.max' => 'El titulo no debe superar los 255 caracteres.',
            'content.required' => 'El contenido es obligatorio.',
            'cover_image.required' => 'La imagen principal es obligatoria.',
            'cover_image.image' => 'La portada debe ser una imagen valida.',
            'audio_path.mimetypes' => 'El audio debe estar en formato MP3, WAV, OGG o M4A.',
            'published_at.required' => 'La fecha de publicacion es obligatoria.',
            'published_at.date' => 'La fecha de publicacion no tiene un formato valido.',
            'views_count.min' => 'Las visualizaciones no pueden ser negativas.',
            'likes_count.min' => 'Los me gusta no pueden ser negativos.',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'categoria',
            'sub_category_id' => 'subcategoria',
            'title' => 'titulo',
            'excerpt' => 'bajada',
            'content' => 'contenido',
            'cover_image' => 'imagen principal',
            'audio_path' => 'audio',
            'images' => 'imagenes',
            'videos' => 'videos',
            'views_count' => 'visualizaciones',
            'likes_count' => 'me gusta',
            'published_at' => 'fecha de publicacion',
        ];
    }
}
