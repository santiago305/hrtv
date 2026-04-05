<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserTestSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['role' => 'admin', 'name' => 'Administracion HRTV', 'email' => 'administracion@hrtv.com.pe'],
            ['role' => 'moderator', 'name' => 'Moderador HRTV', 'email' => 'moderador@hrtv.com.pe'],
            ['role' => 'writer', 'name' => 'Redaccion HRTV', 'email' => 'redaccion@hrtv.com.pe'],
            ['role' => 'streamer', 'name' => 'Streaming HRTV', 'email' => 'streaming@hrtv.com.pe'],
        ];

        foreach ($users as $data) {
            $role = Role::query()->where('slug', $data['role'])->first();

            if (! $role) {
                continue;
            }

            User::query()->updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'role_id' => $role->id,
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'password' => Hash::make('password'),
                ]
            );
        }
    }
}
