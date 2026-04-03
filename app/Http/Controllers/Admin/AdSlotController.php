<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ads\StoreAdSlotRequest;
use App\Http\Requests\Ads\UpdateAdSlotRequest;
use App\Models\AdSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AdSlotController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            AdSlot::query()->withCount('creatives')->orderBy('page_type')->orderBy('name')->get()
        );
    }

    public function store(StoreAdSlotRequest $request): RedirectResponse
    {
        AdSlot::query()->create([
            'code' => $request->string('code')->toString(),
            'name' => $request->string('name')->toString(),
            'page_type' => $request->string('page_type')->toString(),
            'size' => $request->string('size')->toString(),
            'banner_width' => $request->integer('banner_width'),
            'banner_height' => $request->integer('banner_height'),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Espacio publicitario creado correctamente.');
    }

    public function show(AdSlot $adSlot): JsonResponse
    {
        return response()->json($adSlot->load(['campaignTargets', 'creatives']));
    }

    public function update(UpdateAdSlotRequest $request, AdSlot $adSlot): RedirectResponse
    {
        $adSlot->update([
            'code' => $request->string('code')->toString(),
            'name' => $request->string('name')->toString(),
            'page_type' => $request->string('page_type')->toString(),
            'size' => $request->string('size')->toString(),
            'banner_width' => $request->integer('banner_width'),
            'banner_height' => $request->integer('banner_height'),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
        ]);

        return redirect()->back()->with('success', 'Espacio publicitario actualizado correctamente.');
    }

    public function toggleStatus(AdSlot $adSlot): RedirectResponse
    {
        $adSlot->update([
            'is_active' => ! $adSlot->is_active,
        ]);

        return redirect()->back()->with('success', $adSlot->is_active
            ? 'Espacio publicitario activado correctamente.'
            : 'Espacio publicitario desactivado correctamente.');
    }
}
