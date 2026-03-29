<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubCategories\StoreSubCategoryRequest;
use App\Http\Requests\SubCategories\UpdateSubCategoryRequest;
use App\Models\SubCategory;
use Illuminate\Http\JsonResponse;

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

    public function store(StoreSubCategoryRequest $request): JsonResponse
    {
        $subCategory = SubCategory::query()->create([
            'category_id' => $request->integer('category_id'),
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Subcategoria creada correctamente.',
            'data' => $subCategory->fresh('category:id,name'),
        ], 201);
    }

    public function show(SubCategory $subCategory): JsonResponse
    {
        $subCategory->load('category:id,name');

        return response()->json($subCategory);
    }

    public function update(UpdateSubCategoryRequest $request, SubCategory $subCategory): JsonResponse
    {
        $subCategory->update([
            'category_id' => $request->integer('category_id'),
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
        ]);

        return response()->json([
            'message' => 'Subcategoria actualizada correctamente.',
            'data' => $subCategory->fresh('category:id,name'),
        ]);
    }

    public function toggleStatus(SubCategory $subCategory): JsonResponse
    {
        $subCategory->update([
            'is_active' => ! $subCategory->is_active,
        ]);

        return response()->json([
            'message' => $subCategory->is_active ? 'Subcategoria activada correctamente.' : 'Subcategoria desactivada correctamente.',
            'data' => $subCategory->fresh('category:id,name'),
        ]);
    }
}
