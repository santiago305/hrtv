<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ActualidadNewsSeeder extends Seeder
{
    /**
     * Seed the application's database with sample news for the public listing.
     */
    public function run(): void
    {
        $category = Category::query()->firstOrCreate(
            ['name' => 'Actualidad'],
            [
                'description' => null,
                'is_active' => true,
            ],
        );

        $author = User::query()->where('email', 'redaccion@hrtv.com.pe')->first()
            ?? User::query()->orderBy('id')->first();

        if (! $author) {
            return;
        }

        foreach (range(1, 15) as $index) {
            $title = "Actualidad informativa {$index}";
            $publishedAt = Carbon::now()->subHours($index);

            News::query()->updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $category->id,
                    'sub_category_id' => null,
                    'user_id' => $author->id,
                    'title' => $title,
                    'excerpt' => "Resumen de actualidad numero {$index} para validar el listado publico y su paginacion.",
                    'content' => "Contenido de prueba de la noticia {$index}. Este registro fue creado para verificar la paginacion, el orden cronologico y la visualizacion de tarjetas en la seccion publica de noticias.",
                    'cover_image' => 'logo.png',
                    'audio_path' => null,
                    'images' => [],
                    'videos' => [],
                    'is_breaking' => $index <= 2,
                    'is_featured' => $index <= 4,
                    'is_published' => true,
                    'views_count' => 100 + $index,
                    'likes_count' => 10 + $index,
                    'published_at' => $publishedAt,
                ],
            );
        }
    }
}
