<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubCategories\StoreSubCategoryRequest;
use App\Http\Requests\SubCategories\UpdateSubCategoryRequest;
use App\Models\SubCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $subCategories = SubCategory::query()
            ->with('category:id,name')
            ->orderBy('name')
            ->get();

        return response()->json($subCategories);
    }

    public function store(StoreSubCategoryRequest $request): RedirectResponse
    {
        SubCategory::query()->create([
            'category_id' => $request->integer('category_id'),
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'is_active' => true,
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Subcategoria creada correctamente.');
    }

    public function show(SubCategory $subCategory): JsonResponse
    {
        $subCategory->load('category:id,name');

        return response()->json($subCategory);
    }

    public function update(UpdateSubCategoryRequest $request, SubCategory $subCategory, Request $httpRequest): RedirectResponse
    {
        $subCategory->update([
            'category_id' => $request->integer('category_id'),
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
        ]);

        return redirect()
            ->route('categories.index', ['panel' => $httpRequest->query('panel')])
            ->with('success', 'Subcategoria actualizada correctamente.');
    }

    public function toggleStatus(SubCategory $subCategory, Request $request): RedirectResponse
    {
        $subCategory->update([
            'is_active' => ! $subCategory->is_active,
        ]);

        return redirect()
            ->route('categories.index', ['panel' => $request->query('panel')])
            ->with('success', $subCategory->is_active ? 'Subcategoria activada correctamente.' : 'Subcategoria desactivada correctamente.');
    }
}
