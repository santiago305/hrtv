<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with(['subCategories' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        $subCategories = SubCategory::query()
            ->with('category:id,name')
            ->orderBy('name')
            ->get();

        return Inertia::render('categories', [
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'is_active' => $category->is_active,
                'created_at' => $category->created_at?->toDateTimeString(),
                'sub_categories_count' => $category->subCategories->count(),
                'sub_categories' => $category->subCategories->map(fn (SubCategory $subCategory) => [
                    'id' => $subCategory->id,
                    'category_id' => $subCategory->category_id,
                    'name' => $subCategory->name,
                    'description' => $subCategory->description,
                    'is_active' => $subCategory->is_active,
                    'created_at' => $subCategory->created_at?->toDateTimeString(),
                ])->values(),
            ])->values(),
            'subCategories' => $subCategories->map(fn (SubCategory $subCategory) => [
                'id' => $subCategory->id,
                'category_id' => $subCategory->category_id,
                'name' => $subCategory->name,
                'description' => $subCategory->description,
                'is_active' => $subCategory->is_active,
                'created_at' => $subCategory->created_at?->toDateTimeString(),
                'category' => $subCategory->category ? [
                    'id' => $subCategory->category->id,
                    'name' => $subCategory->category->name,
                ] : null,
            ])->values(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::query()->create([
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'is_active' => true,
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Categoria creada correctamente.');
    }

    public function show(Category $category): JsonResponse
    {
        $category->load(['subCategories' => fn ($query) => $query->orderBy('name')]);

        return response()->json($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category, Request $httpRequest): RedirectResponse
    {
        $category->update([
            'name' => $request->string('name')->toString(),
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
        ]);

        return redirect()
            ->route('categories.index', ['panel' => $httpRequest->query('panel')])
            ->with('success', 'Categoria actualizada correctamente.');
    }

    public function toggleStatus(Category $category, Request $request): RedirectResponse
    {
        $category->update([
            'is_active' => ! $category->is_active,
        ]);

        return redirect()
            ->route('categories.index', ['panel' => $request->query('panel')])
            ->with('success', $category->is_active ? 'Categoria activada correctamente.' : 'Categoria desactivada correctamente.');
    }
}
