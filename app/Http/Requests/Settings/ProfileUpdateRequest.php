<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image', 'mimes:webp', 'max:5120'],
            'remove_avatar' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no debe superar los 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'email.max' => 'El correo electrónico no debe superar los 255 caracteres.',
            'avatar.image' => 'El archivo seleccionado debe ser una imagen válida.',
            'avatar.mimes' => 'La foto de perfil debe estar en formato WEBP.',
            'avatar.max' => 'La foto de perfil no debe superar los 5 MB.',
            'remove_avatar.boolean' => 'El valor para eliminar la foto de perfil no es válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'avatar' => 'foto de perfil',
            'remove_avatar' => 'eliminar foto de perfil',
        ];
    }
}
