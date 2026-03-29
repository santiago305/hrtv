<?php

namespace App\Http\Requests\Categories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150', Rule::unique('categories', 'name')->ignore($this->route('category'))],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.max' => 'El nombre de la categoría no debe superar los 150 caracteres.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
            'description.string' => 'La descripción de la categoría debe ser un texto válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre de la categoría',
            'description' => 'descripción de la categoría',
        ];
    }
}
