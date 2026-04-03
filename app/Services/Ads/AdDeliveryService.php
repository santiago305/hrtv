<?php

namespace App\Services\Ads;

use App\Models\AdClick;
use App\Models\AdCreative;
use App\Models\AdImpression;
use App\Models\AdSlot;
use App\Models\Campaign;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdDeliveryService
{
    public function getCreativeForSlot(AdSlot $slot, Request $request): ?AdCreative
    {
        $campaign = $this->pickCampaign($slot);

        if ($campaign === null) {
            return null;
        }

        $creative = $this->pickCreative($campaign, $slot);

        if ($creative === null) {
            return null;
        }

        $creative->loadMissing(['campaign.advertiser', 'adSlot']);
        $this->registerImpression($creative, $request);

        return $creative;
    }

    public function registerClick(AdCreative $creative, Request $request): void
    {
        DB::transaction(function () use ($creative, $request): void {
            AdClick::query()->create([
                'creative_id' => $creative->id,
                'campaign_id' => $creative->campaign_id,
                'advertiser_id' => $creative->campaign->advertiser_id,
                'ad_slot_id' => $creative->ad_slot_id,
                'page_type' => $creative->adSlot->page_type->value,
                'clicked_at' => now(),
                'session_id' => $request->session()->getId(),
                'ip_hash' => $this->hashValue($request->ip()),
                'user_agent_hash' => $this->hashValue($request->userAgent()),
                'referrer_url' => $request->headers->get('referer'),
            ]);

            $creative->increment('clicks_count');
            $creative->campaign()->increment('clicks_count');
        });
    }

    private function registerImpression(AdCreative $creative, Request $request): void
    {
        DB::transaction(function () use ($creative, $request): void {
            AdImpression::query()->create([
                'creative_id' => $creative->id,
                'campaign_id' => $creative->campaign_id,
                'advertiser_id' => $creative->campaign->advertiser_id,
                'ad_slot_id' => $creative->ad_slot_id,
                'page_type' => $creative->adSlot->page_type->value,
                'shown_at' => now(),
                'session_id' => $request->session()->getId(),
                'ip_hash' => $this->hashValue($request->ip()),
                'user_agent_hash' => $this->hashValue($request->userAgent()),
                'referrer_url' => $request->headers->get('referer'),
            ]);

            $creative->increment('impressions_count');
            $creative->campaign()->increment('impressions_count');
        });
    }

    private function pickCampaign(AdSlot $slot): ?Campaign
    {
        $campaigns = Campaign::query()
            ->eligible()
            ->whereHas('slotTargets', fn ($query) => $query
                ->where('ad_slot_id', $slot->id)
                ->where('is_active', true))
            ->whereHas('creatives', fn ($query) => $query
                ->where('ad_slot_id', $slot->id)
                ->where('is_active', true))
            ->get();

        if ($campaigns->isEmpty()) {
            return null;
        }

        return $this->weightedPick($campaigns, static fn (Campaign $campaign) => max($campaign->priority_weight, 1));
    }

    private function pickCreative(Campaign $campaign, AdSlot $slot): ?AdCreative
    {
        $creatives = $campaign->creatives()
            ->where('ad_slot_id', $slot->id)
            ->where('is_active', true)
            ->get();

        if ($creatives->isEmpty()) {
            return null;
        }

        return $this->weightedPick($creatives, static fn (AdCreative $creative) => max($creative->display_weight, 1));
    }

    /**
     * @template TModel of object
     * @param  Collection<int, TModel>  $items
     * @param  callable(TModel):int  $weightResolver
     * @return TModel|null
     */
    private function weightedPick(Collection $items, callable $weightResolver): mixed
    {
        $total = $items->sum(fn ($item) => max(1, (int) $weightResolver($item)));

        if ($total <= 0) {
            return $items->random();
        }

        $threshold = random_int(1, $total);
        $current = 0;

        foreach ($items as $item) {
            $current += max(1, (int) $weightResolver($item));

            if ($threshold <= $current) {
                return $item;
            }
        }

        return $items->last();
    }

    private function hashValue(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        return hash('sha256', $value);
    }
}
