<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use App\Models\News;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    $latestNews = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->orderByDesc('published_at')
        ->orderByDesc('id')
        ->take(6)
        ->get();

    $toPublicArticle = static function (News $item): array {
        $coverUrl = Storage::disk(config('media.disk', 'public'))->url($item->cover_image);

        return [
            'id' => (string) $item->id,
            'title' => $item->title,
            'slug' => $item->slug,
            'summary' => $item->excerpt ?? '',
            'body' => $item->content,
            'image' => $coverUrl,
            'images' => collect($item->images ?? [])->map(fn (string $path) => Storage::disk(config('media.disk', 'public'))->url($path))->values()->all(),
            'videoUrl' => collect($item->videos ?? [])->map(fn (string $path) => Storage::disk(config('media.disk', 'public'))->url($path))->first(),
            'audioUrl' => $item->audio_path ? Storage::disk(config('media.disk', 'public'))->url($item->audio_path) : null,
            'category' => [
                'id' => (string) $item->category_id,
                'name' => $item->category?->name ?? 'Sin categoria',
                'slug' => Str::slug($item->category?->name ?? 'sin-categoria'),
            ],
            'subcategory' => $item->subCategory ? [
                'id' => (string) $item->subCategory->id,
                'name' => $item->subCategory->name,
                'slug' => Str::slug($item->subCategory->name),
                'categoryId' => (string) $item->category_id,
            ] : null,
            'author' => $item->author?->name ?? 'Redaccion',
            'publishedAt' => ($item->published_at ?? $item->created_at)?->toIso8601String(),
            'views' => $item->views_count,
            'likes' => $item->likes_count,
            'isBreaking' => $item->is_breaking,
        ];
    };

    return Inertia::render('inicio', [
        'latestNews' => $latestNews->map($toPublicArticle)->values(),
    ]);
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
        $news = News::query()
            ->with([
                'author:id,name',
                'category:id,name',
                'subCategory:id,name,category_id',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard', [
            'news' => $news->getCollection()->map(fn (News $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'excerpt' => $item->excerpt,
                'is_breaking' => $item->is_breaking,
                'is_featured' => $item->is_featured,
                'is_published' => $item->is_published,
                'views_count' => $item->views_count,
                'likes_count' => $item->likes_count,
                'published_at' => $item->published_at?->toDateTimeString(),
                'created_at' => $item->created_at?->toDateTimeString(),
                'author' => $item->author ? [
                    'id' => $item->author->id,
                    'name' => $item->author->name,
                ] : null,
                'category' => $item->category ? [
                    'id' => $item->category->id,
                    'name' => $item->category->name,
                ] : null,
                'sub_category' => $item->subCategory ? [
                    'id' => $item->subCategory->id,
                    'name' => $item->subCategory->name,
                ] : null,
            ])->values(),
            'newsPagination' => [
                'page' => $news->currentPage(),
                'limit' => $news->perPage(),
                'total' => $news->total(),
            ],
        ]);
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

        Route::get('dashboard/news', [NewsController::class, 'index'])->name('dashboard.news.index');
        Route::get('dashboard/news/{news:slug}/edit', [NewsController::class, 'edit'])->name('dashboard.news.edit');
        Route::post('dashboard/news', [NewsController::class, 'store'])->name('dashboard.news.store');
        Route::patch('dashboard/news/{news:slug}', [NewsController::class, 'update'])->name('dashboard.news.update');
        Route::patch('dashboard/news/{news:slug}/toggle-status', [NewsController::class, 'toggleStatus'])->name('dashboard.news.toggle-status');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
