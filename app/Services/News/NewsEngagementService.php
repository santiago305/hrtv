<?php

namespace App\Services\News;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Throwable;

class NewsEngagementService
{
    private const CACHE_TTL_HOURS = 48;

    private ?string $lastResult = null;

    public function registerView(News $news, Request $request): bool
    {
        return $this->registerInteraction($news, $request, 'view', 'views_count');
    }

    public function registerLike(News $news, Request $request): bool
    {
        return $this->registerInteraction($news, $request, 'like', 'likes_count');
    }

    public function lastResult(): ?string
    {
        return $this->lastResult;
    }

    private function registerInteraction(News $news, Request $request, string $interaction, string $column): bool
    {
        $cacheKey = $this->makeCacheKey($news, $request, $interaction);

        if (! Cache::add($cacheKey, true, now()->addHours(self::CACHE_TTL_HOURS))) {
            $this->lastResult = 'duplicate_48h';
            return false;
        }

        try {
            DB::transaction(function () use ($news, $interaction, $column): void {
                $news->increment($column);

                $dailyColumn = $interaction === 'view' ? 'views_count' : 'likes_count';
                $now = now();
                $date = $now->toDateString();

                $updatedRows = DB::table('news_daily_engagement_stats')
                    ->where('news_id', $news->id)
                    ->where('date', $date)
                    ->increment($dailyColumn, 1, [
                        'updated_at' => $now,
                    ]);

                if ($updatedRows > 0) {
                    return;
                }

                $insertedRows = DB::table('news_daily_engagement_stats')->insertOrIgnore([
                    'news_id' => $news->id,
                    'date' => $date,
                    'views_count' => $interaction === 'view' ? 1 : 0,
                    'likes_count' => $interaction === 'like' ? 1 : 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                if ($insertedRows > 0) {
                    return;
                }

                DB::table('news_daily_engagement_stats')
                    ->where('news_id', $news->id)
                    ->where('date', $date)
                    ->update([
                        $dailyColumn => DB::raw($dailyColumn . ' + 1'),
                        'updated_at' => $now,
                    ]);
            });
        } catch (Throwable $exception) {
            Cache::forget($cacheKey);
            $this->lastResult = 'failed';

            throw $exception;
        }

        $this->lastResult = 'counted';

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
