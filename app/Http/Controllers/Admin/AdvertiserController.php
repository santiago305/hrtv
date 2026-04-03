<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ads\StoreAdvertiserRequest;
use App\Http\Requests\Ads\UpdateAdvertiserRequest;
use App\Models\Advertiser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AdvertiserController extends Controller
{
    public function index(): JsonResponse
    {
        $advertisers = Advertiser::query()
            ->withCount('campaigns')
            ->orderBy('name')
            ->get();

        return response()->json($advertisers);
    }

    public function store(StoreAdvertiserRequest $request): RedirectResponse
    {
        Advertiser::query()->create([
            'name' => $request->string('name')->toString(),
            'company_name' => $request->filled('company_name') ? $request->string('company_name')->toString() : null,
            'document_type' => $request->filled('document_type') ? $request->string('document_type')->toString() : null,
            'document_number' => $request->filled('document_number') ? $request->string('document_number')->toString() : null,
            'contact_name' => $request->filled('contact_name') ? $request->string('contact_name')->toString() : null,
            'contact_phone' => $request->filled('contact_phone') ? $request->string('contact_phone')->toString() : null,
            'contact_email' => $request->filled('contact_email') ? $request->string('contact_email')->toString() : null,
            'notes' => $request->filled('notes') ? $request->string('notes')->toString() : null,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Anunciante creado correctamente.');
    }

    public function show(Advertiser $advertiser): JsonResponse
    {
        $advertiser->load(['campaigns' => fn ($query) => $query->latest()]);

        return response()->json($advertiser);
    }

    public function update(UpdateAdvertiserRequest $request, Advertiser $advertiser): RedirectResponse
    {
        $advertiser->update([
            'name' => $request->string('name')->toString(),
            'company_name' => $request->filled('company_name') ? $request->string('company_name')->toString() : null,
            'document_type' => $request->filled('document_type') ? $request->string('document_type')->toString() : null,
            'document_number' => $request->filled('document_number') ? $request->string('document_number')->toString() : null,
            'contact_name' => $request->filled('contact_name') ? $request->string('contact_name')->toString() : null,
            'contact_phone' => $request->filled('contact_phone') ? $request->string('contact_phone')->toString() : null,
            'contact_email' => $request->filled('contact_email') ? $request->string('contact_email')->toString() : null,
            'notes' => $request->filled('notes') ? $request->string('notes')->toString() : null,
        ]);

        return redirect()->back()->with('success', 'Anunciante actualizado correctamente.');
    }

    public function toggleStatus(Advertiser $advertiser): RedirectResponse
    {
        $advertiser->update([
            'is_active' => ! $advertiser->is_active,
        ]);

        return redirect()->back()->with('success', $advertiser->is_active
            ? 'Anunciante activado correctamente.'
            : 'Anunciante desactivado correctamente.');
    }
}
