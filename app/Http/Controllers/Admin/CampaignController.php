<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ads\StoreCampaignRequest;
use App\Http\Requests\Ads\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Models\CampaignSlotTarget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class CampaignController extends Controller
{
    public function index(): JsonResponse
    {
        $campaigns = Campaign::query()
            ->with(['advertiser:id,name', 'slotTargets.adSlot:id,code,name,size,page_type'])
            ->latest()
            ->get();

        return response()->json($campaigns);
    }

    public function store(StoreCampaignRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $campaign = Campaign::query()->create([
                'advertiser_id' => $request->integer('advertiser_id'),
                'name' => $request->string('name')->toString(),
                'start_date' => $request->date('start_date'),
                'end_date' => $request->date('end_date'),
                'status' => $request->string('status')->toString(),
                'priority_weight' => $request->integer('priority_weight'),
                'notes' => $request->filled('notes') ? $request->string('notes')->toString() : null,
            ]);

            foreach ($request->input('slot_ids', []) as $slotId) {
                CampaignSlotTarget::query()->create([
                    'campaign_id' => $campaign->id,
                    'ad_slot_id' => (int) $slotId,
                    'is_active' => true,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Campana creada correctamente.');
    }

    public function show(Campaign $campaign): JsonResponse
    {
        return response()->json($campaign->load([
            'advertiser',
            'slotTargets.adSlot',
            'creatives.adSlot',
        ]));
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): RedirectResponse
    {
        DB::transaction(function () use ($request, $campaign): void {
            $campaign->update([
                'advertiser_id' => $request->integer('advertiser_id'),
                'name' => $request->string('name')->toString(),
                'start_date' => $request->date('start_date'),
                'end_date' => $request->date('end_date'),
                'status' => $request->string('status')->toString(),
                'priority_weight' => $request->integer('priority_weight'),
                'notes' => $request->filled('notes') ? $request->string('notes')->toString() : null,
            ]);

            $campaign->slotTargets()->delete();

            foreach ($request->input('slot_ids', []) as $slotId) {
                CampaignSlotTarget::query()->create([
                    'campaign_id' => $campaign->id,
                    'ad_slot_id' => (int) $slotId,
                    'is_active' => true,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Campana actualizada correctamente.');
    }

    public function toggleStatus(Campaign $campaign): RedirectResponse
    {
        $nextStatus = $campaign->status->value === 'active' ? 'paused' : 'active';

        $campaign->update([
            'status' => $nextStatus,
        ]);

        return redirect()->back()->with('success', 'Estado de campana actualizado correctamente.');
    }
}
