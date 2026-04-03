<?php

namespace App\Services\News;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NewsEngagementService
{
    private const CACHE_TTL_HOURS = 48;

    public function registerView(News $news, Request $request): bool
    {
        return $this->registerInteraction($news, $request, 'view', 'views_count');
    }

    public function registerLike(News $news, Request $request): bool
    {
        return $this->registerInteraction($news, $request, 'like', 'likes_count');
    }

    private function registerInteraction(News $news, Request $request, string $interaction, string $column): bool
    {
        $cacheKey = $this->makeCacheKey($news, $request, $interaction);

        if (! Cache::add($cacheKey, true, now()->addHours(self::CACHE_TTL_HOURS))) {
            return false;
        }

        $news->increment($column);

        return true;
    }

    private function makeCacheKey(News $news, Request $request, string $interaction): string
    {
        $ipAddress = $request->ip() ?? 'unknown-ip';
        $userAgent = $request->userAgent() ?? 'unknown-agent';
        $fingerprint = hash('sha256', "{$ipAddress}|{$userAgent}");

        return "news:{$news->id}:{$interaction}:{$fingerprint}";
    }
}
