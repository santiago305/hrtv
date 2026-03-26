<?php

namespace App\Http\Requests\Users;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_id' => ['required', 'integer', Rule::in($availableRoleIds)],
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.in' => 'No puedes crear usuarios con este rol.',
        ];
    }
}
