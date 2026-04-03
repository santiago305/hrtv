<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserTestSeeder extends Seeder
{
    /**
     * Seed the application's database with test users for pagination.
     */
    public function run(): void
    {
        $roleIds = Role::query()
            ->whereIn('slug', ['admin', 'moderator', 'writer'])
            ->pluck('id')
            ->all();

        if ($roleIds === []) {
            return;
        }

        User::factory(20)
            ->state(fn () => [
                'role_id' => fake()->randomElement($roleIds),
                'is_active' => true,
                'email_verified_at' => now(),
            ])
            ->create();
    }
}
