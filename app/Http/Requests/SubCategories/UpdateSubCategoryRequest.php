<?php

namespace App\Http\Requests\SubCategories;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists(Category::class, 'id')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('sub_categories', 'name')
                    ->where(fn ($query) => $query->where('category_id', $this->integer('category_id')))
                    ->ignore($this->route('subCategory')),
            ],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'La categoría es obligatoria.',
            'category_id.integer' => 'La categoría seleccionada no es válida.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'name.required' => 'El nombre de la subcategoría es obligatorio.',
            'name.max' => 'El nombre de la subcategoría no debe superar los 150 caracteres.',
            'name.unique' => 'Ya existe una subcategoría con este nombre en la categoría seleccionada.',
            'description.string' => 'La descripción de la subcategoría debe ser un texto válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'categoría',
            'name' => 'nombre de la subcategoría',
            'description' => 'descripción de la subcategoría',
        ];
    }
}
