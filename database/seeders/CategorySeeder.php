<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Actualidad',
            'Cultura',
            'Deportes',
            'Economia',
            'Espectaculos',
            'Internacional',
            'Politica',
            'Social',
            'Tendencias',
        ];

        foreach ($categories as $name) {
            Category::query()->updateOrCreate(
                ['name' => $name],
                [
                    'description' => null,
                    'is_active' => true,
                ]
            );
        }
    }
}
