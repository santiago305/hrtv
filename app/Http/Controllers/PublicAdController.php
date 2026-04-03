<?php

namespace App\Http\Controllers;

use App\Models\AdCreative;
use App\Models\AdSlot;
use App\Services\Ads\AdDeliveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PublicAdController extends Controller
{
    public function show(string $slotCode, Request $request, AdDeliveryService $adDeliveryService): JsonResponse
    {
        /** @var AdSlot $slot */
        $slot = $request->attributes->get('adSlot');
        $creative = $adDeliveryService->getCreativeForSlot($slot, $request);

        if ($creative === null) {
            return response()->json([
                'slot' => $slotCode,
                'data' => null,
            ]);
        }

        return response()->json([
            'slot' => $slotCode,
            'data' => [
                'id' => $creative->id,
                'title' => $creative->title,
                'image_url' => $creative->file_url,
                'target_url' => $creative->target_url,
                'alt_text' => $creative->alt_text,
                'size' => $creative->adSlot->size->value,
                'width' => $creative->width,
                'height' => $creative->height,
                'click_url' => route('ads.click', $creative),
                'campaign' => [
                    'id' => $creative->campaign->id,
                    'name' => $creative->campaign->name,
                ],
                'advertiser' => [
                    'id' => $creative->campaign->advertiser->id,
                    'name' => $creative->campaign->advertiser->name,
                ],
            ],
        ]);
    }

    public function click(AdCreative $adCreative, Request $request, AdDeliveryService $adDeliveryService): RedirectResponse
    {
        $adCreative->loadMissing(['campaign.advertiser', 'adSlot']);

        $adDeliveryService->registerClick($adCreative, $request);

        return redirect()->away($adCreative->target_url ?: route('home'));
    }
}
