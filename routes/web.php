<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('inicio');
})->name('home');

Route::get('/noticias', function () {
    $categories = Category::query()
        ->where('is_active', true)
        ->with(['subCategories' => fn ($query) => $query->where('is_active', true)->orderBy('name')])
        ->orderBy('name')
        ->get()
        ->map(fn (Category $category) => [
            'id' => (string) $category->id,
            'name' => $category->name,
            'slug' => Str::slug($category->name),
            'subcategories' => $category->subCategories->map(fn ($subCategory) => [
                'id' => (string) $subCategory->id,
                'name' => $subCategory->name,
                'slug' => Str::slug($subCategory->name),
                'categoryId' => (string) $category->id,
            ])->values(),
        ])->values();

    return Inertia::render('noticias/NewsListing', [
        'categories' => $categories,
    ]);
})->name('news.index');

Route::get('/noticias/{slug}', function (string $slug) {
    return Inertia::render('noticias/NewDetail', [
        'slug' => $slug,
    ]);
})->name('news.show');

Route::get('/radio', function () {
    return Inertia::render('radio');
})->name('radio');

Route::get('/conocenos', function () {
    return Inertia::render('conocenos');
})->name('about');

Route::get('/contacto', function () {
    return Inertia::render('contacto');
})->name('contact');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware('role:admin')->group(function () {
        Route::get('dashboard/users', [UserController::class, 'index'])->name('users.index');
        Route::post('dashboard/users', [UserController::class, 'store'])->name('users.store');
        Route::patch('dashboard/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::patch('dashboard/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

        Route::get('dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('dashboard/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('dashboard/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
        Route::patch('dashboard/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::patch('dashboard/categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');

        Route::get('dashboard/sub-categories', [SubCategoryController::class, 'index'])->name('sub-categories.index');
        Route::post('dashboard/sub-categories', [SubCategoryController::class, 'store'])->name('sub-categories.store');
        Route::get('dashboard/sub-categories/{subCategory}', [SubCategoryController::class, 'show'])->name('sub-categories.show');
        Route::patch('dashboard/sub-categories/{subCategory}', [SubCategoryController::class, 'update'])->name('sub-categories.update');
        Route::patch('dashboard/sub-categories/{subCategory}/toggle-status', [SubCategoryController::class, 'toggleStatus'])->name('sub-categories.toggle-status');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
