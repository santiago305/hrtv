<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PublicNewsEngagementController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use App\Models\News;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

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

Route::get('/', function () use ($toPublicArticle) {
    $latestNews = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->orderByDesc('published_at')
        ->orderByDesc('id')
        ->take(6)
        ->get();

    return Inertia::render('inicio', [
        'latestNews' => $latestNews->map($toPublicArticle)->values(),
    ]);
})->name('home');

Route::get('/noticias/{page?}', function (?int $page = 1) use ($toPublicArticle) {
    $page = max($page ?? 1, 1);
    $activeCategory = request()->string('categoria')->toString();
    $activeSubcategory = request()->string('subcategoria')->toString();

    $categories = Category::query()
        ->where('is_active', true)
        ->with([
            'subCategories' => fn ($query) => $query->where('is_active', true)->orderBy('name'),
            'news' => fn ($query) => $query->where('is_published', true),
        ])
        ->orderBy('name')
        ->get()
        ->map(fn (Category $category) => [
            'id' => (string) $category->id,
            'name' => $category->name,
            'slug' => Str::slug($category->name),
            'newsCount' => $category->news->count(),
            'subcategories' => $category->subCategories->map(fn ($subCategory) => [
                'id' => (string) $subCategory->id,
                'name' => $subCategory->name,
                'slug' => Str::slug($subCategory->name),
                'categoryId' => (string) $category->id,
            ])->values(),
        ])->values();

    $newsQuery = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->orderByDesc('published_at')
        ->orderByDesc('id');

    if ($activeCategory !== '') {
        $newsQuery->whereHas('category', fn ($query) => $query->whereRaw('LOWER(name) = ?', [strtolower(str_replace('-', ' ', $activeCategory))]));
    }

    if ($activeSubcategory !== '') {
        $newsQuery->whereHas('subCategory', fn ($query) => $query->whereRaw('LOWER(name) = ?', [strtolower(str_replace('-', ' ', $activeSubcategory))]));
    }

    $news = $newsQuery->paginate(10, ['*'], 'page', $page);

    return Inertia::render('noticias/NewsListing', [
        'categories' => $categories,
        'articles' => $news->getCollection()->map($toPublicArticle)->values(),
        'pagination' => [
            'page' => $news->currentPage(),
            'limit' => $news->perPage(),
            'total' => $news->total(),
        ],
        'activeCategory' => $activeCategory,
        'activeSubcategory' => $activeSubcategory,
    ]);
})->whereNumber('page')->name('news.index');

Route::get('/noticias/{slug}', function (string $slug) use ($toPublicArticle) {
    $article = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->where('slug', $slug)
        ->firstOrFail();

    $relatedArticles = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->whereKeyNot($article->id)
        ->where('category_id', $article->category_id)
        ->orderByDesc('published_at')
        ->orderByDesc('id')
        ->take(5)
        ->get();

    if ($relatedArticles->count() < 5) {
        $fallbackIds = $relatedArticles->pluck('id')->push($article->id);
        $fallback = News::query()
            ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
            ->where('is_published', true)
            ->whereNotIn('id', $fallbackIds)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->take(5 - $relatedArticles->count())
            ->get();

        $relatedArticles = $relatedArticles->concat($fallback);
    }

    return Inertia::render('noticias/NewDetail', [
        'article' => $toPublicArticle($article),
        'sidebarArticles' => $relatedArticles->map($toPublicArticle)->values(),
    ]);
})->name('news.show');

Route::post('/noticias/{news:slug}/views', [PublicNewsEngagementController::class, 'storeView'])->name('news.views.store');
Route::post('/noticias/{news:slug}/likes', [PublicNewsEngagementController::class, 'storeLike'])->name('news.likes.store');

Route::get('/radio', function () use ($toPublicArticle) {
    $latestRadioNews = News::query()
        ->with(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id'])
        ->where('is_published', true)
        ->orderByDesc('published_at')
        ->orderByDesc('id')
        ->take(6)
        ->get();

    return Inertia::render('radio', [
        'latestNews' => $latestRadioNews->map($toPublicArticle)->values(),
    ]);
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
