<?php

namespace App\Http\Requests\Users;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $availableRoleIds = Role::query()
            ->get(['id', 'slug'])
            ->filter(fn (Role $role) => $this->user()?->canManageRole($role))
            ->pluck('id')
            ->all();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user'))],
            'role_id' => ['required', 'integer', Rule::in($availableRoleIds)],
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
            'role_id.required' => 'El rol es obligatorio.',
            'role_id.integer' => 'El rol seleccionado no es válido.',
            'role_id.in' => 'No puedes actualizar usuarios con este rol.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'role_id' => 'rol',
        ];
    }
}
