<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Services\News\NewsEngagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicNewsEngagementController extends Controller
{
    public function storeView(News $news, Request $request, NewsEngagementService $engagementService): JsonResponse
    {
        abort_unless($news->is_published, 404);

        $counted = $engagementService->registerView($news, $request);
        $news->refresh();

        return response()->json([
            'counted' => $counted,
            'reason' => $engagementService->lastResult(),
            'views' => $news->views_count,
            'likes' => $news->likes_count,
        ]);
    }

    public function storeLike(News $news, Request $request, NewsEngagementService $engagementService): JsonResponse
    {
        abort_unless($news->is_published, 404);

        $counted = $engagementService->registerLike($news, $request);
        $news->refresh();

        return response()->json([
            'counted' => $counted,
            'reason' => $engagementService->lastResult(),
            'views' => $news->views_count,
            'likes' => $news->likes_count,
        ]);
    }
}
