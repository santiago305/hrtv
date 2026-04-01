<?php

namespace App\Http\Controllers;

use App\Http\Requests\News\StoreNewsRequest;
use App\Models\Category;
use App\Models\News;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->with(['subCategories' => fn ($query) => $query->where('is_active', true)->orderBy('name')])
            ->orderBy('name')
            ->get();

        $news = News::query()
            ->with([
                'author:id,name',
                'category:id,name',
                'subCategory:id,name,category_id',
            ])
            ->latest()
            ->get();

        return Inertia::render('news', [
            'categoryOptions' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'sub_categories' => $category->subCategories->map(fn (SubCategory $subCategory) => [
                    'id' => $subCategory->id,
                    'name' => $subCategory->name,
                    'category_id' => $subCategory->category_id,
                ])->values(),
            ])->values(),
            'news' => $news->map(fn (News $item) => [
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
        ]);
    }

    public function store(StoreNewsRequest $request): RedirectResponse
    {
        News::query()->create([
            'category_id' => $request->integer('category_id'),
            'sub_category_id' => $request->integer('sub_category_id'),
            'user_id' => $request->user()->id,
            'title' => $request->string('title')->toString(),
            'excerpt' => $request->filled('excerpt') ? $request->string('excerpt')->toString() : null,
            'content' => $request->string('content')->toString(),
            'cover_image' => $request->filled('cover_image') ? $request->string('cover_image')->toString() : null,
            'audio_path' => $request->filled('audio_path') ? $request->string('audio_path')->toString() : null,
            'images' => $request->input('images'),
            'videos' => $request->input('videos'),
            'video_thumbnail' => $request->filled('video_thumbnail') ? $request->string('video_thumbnail')->toString() : null,
            'is_breaking' => $request->boolean('is_breaking'),
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'views_count' => $request->integer('views_count'),
            'likes_count' => $request->integer('likes_count'),
            'published_at' => $request->filled('published_at') ? $request->date('published_at') : null,
        ]);

        return redirect()
            ->route('dashboard.news.index')
            ->with('success', 'Noticia creada correctamente.');
    }
}
