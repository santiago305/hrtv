<?php

namespace Database\Seeders;

use App\Models\AdCreative;
use App\Models\AdSlot;
use App\Models\Advertiser;
use App\Models\Campaign;
use App\Models\CampaignSlotTarget;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AdvertisingDemoSeeder extends Seeder
{
    public function run(): void
    {
        $disk = Storage::disk(config('media.disk', 'public'));
        $directory = trim(config('media.ads.creatives_directory', 'uploads/ads/creatives'), '/');
        $now = now();

        $slots = collect($this->publicSlots())->map(function (array $slot) use ($now) {
            return AdSlot::query()->updateOrCreate(
                ['code' => $slot['code']],
                [
                    ...$slot,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        });

        $premiumAdvertiser = Advertiser::query()->updateOrCreate(
            ['contact_email' => 'premium-demo@hrtv.test'],
            [
                'name' => 'Premium Demo',
                'company_name' => 'Marca Premium Demo',
                'contact_name' => 'Equipo Premium',
                'contact_phone' => '999999999',
                'notes' => 'Seeder demo para publicidad premium.',
                'is_active' => true,
            ]
        );

        $standardAdvertiser = Advertiser::query()->updateOrCreate(
            ['contact_email' => 'standard-demo@hrtv.test'],
            [
                'name' => 'Standard Demo',
                'company_name' => 'Marca Standard Demo',
                'contact_name' => 'Equipo Standard',
                'contact_phone' => '988888888',
                'notes' => 'Seeder demo para publicidad standard.',
                'is_active' => true,
            ]
        );

        $campaigns = [
            [
                'advertiser' => $premiumAdvertiser,
                'name' => 'Campana Demo Premium',
                'priority_weight' => 80,
                'background' => '#0f766e',
                'foreground' => '#ecfeff',
                'accent' => '#5eead4',
                'target_url' => 'https://example.com/premium-demo',
            ],
            [
                'advertiser' => $standardAdvertiser,
                'name' => 'Campana Demo Standard',
                'priority_weight' => 20,
                'background' => '#7c2d12',
                'foreground' => '#fff7ed',
                'accent' => '#fdba74',
                'target_url' => 'https://example.com/standard-demo',
            ],
        ];

        foreach ($campaigns as $campaignData) {
            $campaign = Campaign::query()->updateOrCreate(
                [
                    'advertiser_id' => $campaignData['advertiser']->id,
                    'name' => $campaignData['name'],
                ],
                [
                    'start_date' => now()->subDays(3)->toDateString(),
                    'end_date' => now()->addMonths(2)->toDateString(),
                    'status' => 'active',
                    'priority_weight' => $campaignData['priority_weight'],
                    'notes' => 'Seeder demo para revisar espacios publicitarios en el frontend.',
                    'impressions_count' => 0,
                    'clicks_count' => 0,
                ]
            );

            foreach ($slots as $slot) {
                CampaignSlotTarget::query()->updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'ad_slot_id' => $slot->id,
                    ],
                    [
                        'is_active' => true,
                    ]
                );

                $path = sprintf('%s/demo-%s-%s.svg', $directory, $campaign->id, $slot->code);
                $svg = $this->makeSvg(
                    width: (int) $slot->banner_width,
                    height: (int) $slot->banner_height,
                    title: $campaignData['name'],
                    subtitle: $slot->name,
                    background: $campaignData['background'],
                    foreground: $campaignData['foreground'],
                    accent: $campaignData['accent'],
                );

                $disk->put($path, $svg);

                AdCreative::query()->updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'ad_slot_id' => $slot->id,
                        'title' => "{$campaignData['name']} - {$slot->name}",
                    ],
                    [
                        'file_path' => $path,
                        'target_url' => $campaignData['target_url'],
                        'width' => (int) $slot->banner_width,
                        'height' => (int) $slot->banner_height,
                        'mime_type' => 'image/svg+xml',
                        'file_size' => strlen($svg),
                        'alt_text' => "{$campaignData['name']} en {$slot->name}",
                        'display_weight' => 1,
                        'impressions_count' => 0,
                        'clicks_count' => 0,
                        'is_active' => true,
                    ]
                );
            }
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

    private function makeSvg(int $width, int $height, string $title, string $subtitle, string $background, string $foreground, string $accent): string
    {
        $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        $safeSubtitle = htmlspecialchars($subtitle, ENT_QUOTES, 'UTF-8');
        $radius = max((int) round(min($width, $height) * 0.12), 12);
        $titleSize = max((int) round($height * 0.22), 18);
        $subtitleSize = max((int) round($height * 0.12), 12);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="{$width}" height="{$height}" viewBox="0 0 {$width} {$height}">
  <rect width="{$width}" height="{$height}" fill="{$background}" rx="{$radius}" ry="{$radius}" />
  <rect x="3%" y="10%" width="20%" height="80%" fill="{$accent}" opacity="0.18" rx="{$radius}" ry="{$radius}" />
  <rect x="74%" y="15%" width="20%" height="70%" fill="{$accent}" opacity="0.16" rx="{$radius}" ry="{$radius}" />
  <text x="8%" y="42%" fill="{$foreground}" font-family="Arial, sans-serif" font-size="{$titleSize}" font-weight="700">{$safeTitle}</text>
  <text x="8%" y="67%" fill="{$foreground}" font-family="Arial, sans-serif" font-size="{$subtitleSize}" opacity="0.86">{$safeSubtitle}</text>
  <text x="8%" y="84%" fill="{$accent}" font-family="Arial, sans-serif" font-size="{$subtitleSize}" font-weight="700">Publicidad demo HRTV</text>
</svg>
SVG;
    }
}
