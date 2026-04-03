<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::query()->updateOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrador']
        );

        $moderatorRole = Role::query()->updateOrCreate(
            ['slug' => 'moderator'],
            ['name' => 'Moderador']
        );

        $writerRole = Role::query()->updateOrCreate(
            ['slug' => 'writer'],
            ['name' => 'Redactor']
        );

        User::query()->updateOrCreate(
            ['email' => 'administracion@hrtv.com.pe'],
            [
                'name' => 'Administracion HRTV',
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'is_active' => true,
                'password' => Hash::make('password'),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'moderador@hrtv.com.pe'],
            [
                'name' => 'Moderador HRTV',
                'role_id' => $moderatorRole->id,
                'email_verified_at' => now(),
                'is_active' => true,
                'password' => Hash::make('password'),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'redaccion@hrtv.com.pe'],
            [
                'name' => 'Redaccion HRTV',
                'role_id' => $writerRole->id,
                'email_verified_at' => now(),
                'is_active' => true,
                'password' => Hash::make('password'),
            ]
        );

        $this->call([
            CategorySeeder::class,
            UserTestSeeder::class,
            ActualidadNewsSeeder::class,
        ]);
    }
}
