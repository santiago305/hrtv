<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Media\UploadMediaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ads\StoreAdCreativeRequest;
use App\Http\Requests\Ads\UpdateAdCreativeRequest;
use App\Models\AdCreative;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AdCreativeController extends Controller
{
    public function index(): JsonResponse
    {
        $creatives = AdCreative::query()
            ->with(['campaign.advertiser:id,name', 'adSlot:id,code,name,size'])
            ->latest()
            ->get();

        return response()->json($creatives);
    }

    public function store(StoreAdCreativeRequest $request, UploadMediaAction $uploadMedia): RedirectResponse
    {
        $file = $request->file('creative_file');
        $path = $uploadMedia->execute($file, config('media.ads.creatives_directory', 'uploads/ads/creatives'));
        $imageInfo = getimagesize($file->getRealPath());

        AdCreative::query()->create([
            'campaign_id' => $request->integer('campaign_id'),
            'ad_slot_id' => $request->integer('ad_slot_id'),
            'title' => $request->filled('title') ? $request->string('title')->toString() : null,
            'file_path' => $path,
            'target_url' => $request->filled('target_url') ? $request->string('target_url')->toString() : null,
            'width' => (int) ($imageInfo[0] ?? 0),
            'height' => (int) ($imageInfo[1] ?? 0),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'alt_text' => $request->filled('alt_text') ? $request->string('alt_text')->toString() : null,
            'display_weight' => $request->integer('display_weight'),
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Banner creativo creado correctamente.');
    }

    public function show(AdCreative $adCreative): JsonResponse
    {
        return response()->json($adCreative->load(['campaign.advertiser', 'adSlot']));
    }

    public function update(UpdateAdCreativeRequest $request, AdCreative $adCreative, UploadMediaAction $uploadMedia): RedirectResponse
    {
        $file = $request->file('creative_file');
        $path = $adCreative->file_path;
        $width = $adCreative->width;
        $height = $adCreative->height;
        $mimeType = $adCreative->mime_type;
        $fileSize = $adCreative->file_size;

        if ($file !== null) {
            $path = $uploadMedia->execute($file, config('media.ads.creatives_directory', 'uploads/ads/creatives'));
            $imageInfo = getimagesize($file->getRealPath());
            $width = (int) ($imageInfo[0] ?? 0);
            $height = (int) ($imageInfo[1] ?? 0);
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();
        }

        $adCreative->update([
            'campaign_id' => $request->integer('campaign_id'),
            'ad_slot_id' => $request->integer('ad_slot_id'),
            'title' => $request->filled('title') ? $request->string('title')->toString() : null,
            'file_path' => $path,
            'target_url' => $request->filled('target_url') ? $request->string('target_url')->toString() : null,
            'width' => $width,
            'height' => $height,
            'mime_type' => $mimeType,
            'file_size' => $fileSize,
            'alt_text' => $request->filled('alt_text') ? $request->string('alt_text')->toString() : null,
            'display_weight' => $request->integer('display_weight'),
        ]);

        return redirect()->back()->with('success', 'Banner creativo actualizado correctamente.');
    }

    public function toggleStatus(AdCreative $adCreative): RedirectResponse
    {
        $adCreative->update([
            'is_active' => ! $adCreative->is_active,
        ]);

        return redirect()->back()->with('success', $adCreative->is_active
            ? 'Banner creativo activado correctamente.'
            : 'Banner creativo desactivado correctamente.');
    }
}
