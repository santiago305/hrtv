<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->with(['subCategories' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::query()->create([
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Categoria creada correctamente.',
            'data' => $category,
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        $category->load(['subCategories' => fn ($query) => $query->orderBy('name')]);

        return response()->json($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update([
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
        ]);

        return response()->json([
            'message' => 'Categoria actualizada correctamente.',
            'data' => $category->fresh('subCategories'),
        ]);
    }

    public function toggleStatus(Category $category): JsonResponse
    {
        $category->update([
            'is_active' => ! $category->is_active,
        ]);

        return response()->json([
            'message' => $category->is_active ? 'Categoria activada correctamente.' : 'Categoria desactivada correctamente.',
            'data' => $category,
        ]);
    }
}
