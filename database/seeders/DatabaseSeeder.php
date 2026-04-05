<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::query()->updateOrCreate(['slug' => 'admin'], ['name' => 'Administrador']);
        Role::query()->updateOrCreate(['slug' => 'moderator'], ['name' => 'Moderador']);
        Role::query()->updateOrCreate(['slug' => 'writer'], ['name' => 'Redactor']);
        Role::query()->updateOrCreate(['slug' => 'streamer'], ['name' => 'Streaming']);

        $this->call([
            CategorySeeder::class,
            AdSlotSeeder::class,
            UserTestSeeder::class,
        ]);
    }
}
