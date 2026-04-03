<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\News;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsEngagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_public_view_is_counted_only_once_per_fingerprint_within_48_hours(): void
    {
        $news = $this->createPublishedNews();

        $headers = [
            'REMOTE_ADDR' => '127.0.0.10',
            'HTTP_USER_AGENT' => 'FeatureTestAgent/1.0',
        ];

        $this->withServerVariables($headers)
            ->post(route('news.views.store', ['news' => $news->slug]))
            ->assertOk()
            ->assertJson([
                'counted' => true,
                'views' => 1,
            ]);

        $this->withServerVariables($headers)
            ->post(route('news.views.store', ['news' => $news->slug]))
            ->assertOk()
            ->assertJson([
                'counted' => false,
                'views' => 1,
            ]);
    }

    public function test_a_public_like_is_counted_only_once_per_fingerprint_within_48_hours(): void
    {
        $news = $this->createPublishedNews();

        $headers = [
            'REMOTE_ADDR' => '127.0.0.11',
            'HTTP_USER_AGENT' => 'FeatureTestAgent/2.0',
        ];

        $this->withServerVariables($headers)
            ->post(route('news.likes.store', ['news' => $news->slug]))
            ->assertOk()
            ->assertJson([
                'counted' => true,
                'likes' => 1,
            ]);

        $this->withServerVariables($headers)
            ->post(route('news.likes.store', ['news' => $news->slug]))
            ->assertOk()
            ->assertJson([
                'counted' => false,
                'likes' => 1,
            ]);
    }

    private function createPublishedNews(): News
    {
        $role = Role::query()->create([
            'name' => 'Administrador',
            'slug' => 'admin',
        ]);

        $user = User::factory()->create([
            'role_id' => $role->id,
        ]);

        $category = Category::query()->create([
            'name' => 'Actualidad',
            'description' => null,
            'is_active' => true,
        ]);

        return News::query()->create([
            'category_id' => $category->id,
            'sub_category_id' => null,
            'user_id' => $user->id,
            'title' => 'Noticia para pruebas de interaccion',
            'slug' => 'noticia-para-pruebas-de-interaccion',
            'excerpt' => 'Extracto de prueba',
            'content' => 'Contenido de prueba',
            'cover_image' => 'logo.png',
            'audio_path' => null,
            'images' => [],
            'videos' => [],
            'is_breaking' => false,
            'is_featured' => false,
            'is_published' => true,
            'views_count' => 0,
            'likes_count' => 0,
            'published_at' => now(),
        ]);
    }
}
