<?php

namespace Database\Seeders;

use App\Models\AdSlot;
use Illuminate\Database\Seeder;

class AdSlotSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->publicSlots() as $slot) {
            AdSlot::query()->updateOrCreate(
                ['code' => $slot['code']],
                [
                    ...$slot,
                    'is_active' => true,
                ]
            );
        }
    }

    private function publicSlots(): array
    {
        return [
            ['code' => 'home_leaderboard_top', 'name' => 'Inicio leaderboard superior', 'page_type' => 'home', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Banner superior en la pagina de inicio.'],
            ['code' => 'home_banner_mid', 'name' => 'Inicio banner intermedio', 'page_type' => 'home', 'size' => 'banner', 'banner_width' => 728, 'banner_height' => 90, 'description' => 'Banner entre bloques en la pagina de inicio.'],
            ['code' => 'home_leaderboard_bottom', 'name' => 'Inicio leaderboard inferior', 'page_type' => 'home', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Segundo leaderboard en la pagina de inicio.'],
            ['code' => 'home_banner_bottom', 'name' => 'Inicio banner final', 'page_type' => 'home', 'size' => 'banner', 'banner_width' => 728, 'banner_height' => 90, 'description' => 'Banner final en la pagina de inicio.'],
            ['code' => 'radio_leaderboard_top', 'name' => 'Radio leaderboard superior', 'page_type' => 'radio', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Leaderboard sobre noticias de radio.'],
            ['code' => 'radio_banner_bottom', 'name' => 'Radio banner inferior', 'page_type' => 'radio', 'size' => 'banner', 'banner_width' => 728, 'banner_height' => 90, 'description' => 'Banner inferior en radio.'],
            ['code' => 'news_list_leaderboard_top', 'name' => 'Noticias listado leaderboard superior', 'page_type' => 'news_list', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Leaderboard superior en listado de noticias.'],
            ['code' => 'news_list_rectangle_sidebar_top', 'name' => 'Noticias listado rectangulo sidebar superior', 'page_type' => 'news_list', 'size' => 'rectangle', 'banner_width' => 336, 'banner_height' => 280, 'description' => 'Rectangulo superior en sidebar del listado.'],
            ['code' => 'news_list_rectangle_sidebar_bottom', 'name' => 'Noticias listado rectangulo sidebar inferior', 'page_type' => 'news_list', 'size' => 'rectangle', 'banner_width' => 336, 'banner_height' => 280, 'description' => 'Rectangulo inferior en sidebar del listado.'],
            ['code' => 'news_detail_leaderboard_bottom', 'name' => 'Detalle noticia leaderboard inferior', 'page_type' => 'news_detail', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Leaderboard al final del cuerpo de la noticia.'],
            ['code' => 'news_detail_rectangle_sidebar_top', 'name' => 'Detalle noticia rectangulo sidebar superior', 'page_type' => 'news_detail', 'size' => 'rectangle', 'banner_width' => 336, 'banner_height' => 280, 'description' => 'Rectangulo superior en sidebar del detalle.'],
            ['code' => 'news_detail_rectangle_sidebar_bottom', 'name' => 'Detalle noticia rectangulo sidebar inferior', 'page_type' => 'news_detail', 'size' => 'rectangle', 'banner_width' => 336, 'banner_height' => 280, 'description' => 'Rectangulo inferior en sidebar del detalle.'],
            ['code' => 'contact_leaderboard_top', 'name' => 'Contacto leaderboard superior', 'page_type' => 'contact', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Leaderboard superior en contacto.'],
            ['code' => 'contact_banner_bottom', 'name' => 'Contacto banner inferior', 'page_type' => 'contact', 'size' => 'banner', 'banner_width' => 728, 'banner_height' => 90, 'description' => 'Banner inferior en contacto.'],
            ['code' => 'about_leaderboard_top', 'name' => 'Conocenos leaderboard superior', 'page_type' => 'about', 'size' => 'leaderboard', 'banner_width' => 970, 'banner_height' => 90, 'description' => 'Leaderboard superior en conocenos.'],
            ['code' => 'about_banner_mid', 'name' => 'Conocenos banner intermedio', 'page_type' => 'about', 'size' => 'banner', 'banner_width' => 728, 'banner_height' => 90, 'description' => 'Banner intermedio en conocenos.'],
        ];
    }
}
