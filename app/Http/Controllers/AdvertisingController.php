<?php

namespace App\Http\Controllers;

use App\Models\AdCreative;
use App\Models\AdSlot;
use App\Models\Advertiser;
use App\Models\Campaign;
use Inertia\Inertia;
use Inertia\Response;

class AdvertisingController extends Controller
{
    public function index(): Response
    {
        $advertisers = Advertiser::query()
            ->withCount('campaigns')
            ->orderBy('name')
            ->get()
            ->map(fn (Advertiser $advertiser) => [
                'id' => $advertiser->id,
                'name' => $advertiser->name,
                'company_name' => $advertiser->company_name,
                'document_type' => $advertiser->document_type,
                'document_number' => $advertiser->document_number,
                'contact_name' => $advertiser->contact_name,
                'contact_phone' => $advertiser->contact_phone,
                'contact_email' => $advertiser->contact_email,
                'notes' => $advertiser->notes,
                'is_active' => $advertiser->is_active,
                'campaigns_count' => $advertiser->campaigns_count,
                'created_at' => $advertiser->created_at?->toDateTimeString(),
            ])
            ->values();

        $adSlots = AdSlot::query()
            ->withCount('creatives')
            ->orderBy('page_type')
            ->orderBy('name')
            ->get()
            ->map(fn (AdSlot $slot) => [
                'id' => $slot->id,
                'code' => $slot->code,
                'name' => $slot->name,
                'page_type' => $slot->page_type?->value,
                'size' => $slot->size?->value,
                'banner_width' => $slot->banner_width,
                'banner_height' => $slot->banner_height,
                'description' => $slot->description,
                'is_active' => $slot->is_active,
                'creatives_count' => $slot->creatives_count,
                'created_at' => $slot->created_at?->toDateTimeString(),
            ])
            ->values();

        $campaigns = Campaign::query()
            ->with(['advertiser:id,name', 'slotTargets.adSlot:id,code,name,size,page_type'])
            ->latest()
            ->get()
            ->map(fn (Campaign $campaign) => [
                'id' => $campaign->id,
                'advertiser_id' => $campaign->advertiser_id,
                'name' => $campaign->name,
                'start_date' => $campaign->start_date?->format('Y-m-d'),
                'end_date' => $campaign->end_date?->format('Y-m-d'),
                'status' => $campaign->status?->value,
                'priority_weight' => $campaign->priority_weight,
                'impressions_count' => $campaign->impressions_count,
                'clicks_count' => $campaign->clicks_count,
                'notes' => $campaign->notes,
                'advertiser' => $campaign->advertiser ? [
                    'id' => $campaign->advertiser->id,
                    'name' => $campaign->advertiser->name,
                ] : null,
                'slot_ids' => $campaign->slotTargets->pluck('ad_slot_id')->values()->all(),
                'slots' => $campaign->slotTargets->map(fn ($target) => [
                    'id' => $target->adSlot?->id,
                    'code' => $target->adSlot?->code,
                    'name' => $target->adSlot?->name,
                    'size' => $target->adSlot?->size?->value,
                    'page_type' => $target->adSlot?->page_type?->value,
                ])->values(),
            ])
            ->values();

        $creatives = AdCreative::query()
            ->with(['campaign.advertiser:id,name', 'adSlot:id,code,name,size,banner_width,banner_height'])
            ->latest()
            ->get()
            ->map(fn (AdCreative $creative) => [
                'id' => $creative->id,
                'campaign_id' => $creative->campaign_id,
                'ad_slot_id' => $creative->ad_slot_id,
                'title' => $creative->title,
                'file_url' => $creative->file_url,
                'target_url' => $creative->target_url,
                'width' => $creative->width,
                'height' => $creative->height,
                'mime_type' => $creative->mime_type,
                'file_size' => $creative->file_size,
                'alt_text' => $creative->alt_text,
                'display_weight' => $creative->display_weight,
                'impressions_count' => $creative->impressions_count,
                'clicks_count' => $creative->clicks_count,
                'is_active' => $creative->is_active,
                'campaign' => $creative->campaign ? [
                    'id' => $creative->campaign->id,
                    'name' => $creative->campaign->name,
                    'advertiser' => $creative->campaign->advertiser ? [
                        'id' => $creative->campaign->advertiser->id,
                        'name' => $creative->campaign->advertiser->name,
                    ] : null,
                ] : null,
                'slot' => $creative->adSlot ? [
                    'id' => $creative->adSlot->id,
                    'code' => $creative->adSlot->code,
                    'name' => $creative->adSlot->name,
                    'size' => $creative->adSlot->size?->value,
                    'banner_width' => $creative->adSlot->banner_width,
                    'banner_height' => $creative->adSlot->banner_height,
                ] : null,
                'created_at' => $creative->created_at?->toDateTimeString(),
            ])
            ->values();

        return Inertia::render('advertising', [
            'advertisers' => $advertisers,
            'adSlots' => $adSlots,
            'campaigns' => $campaigns,
            'creatives' => $creatives,
        ]);
    }
}
