<?php

namespace App\Http\Controllers;

use App\Actions\Media\UploadMediaAction;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Models\Category;
use App\Models\News;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
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
            ->paginate(15)
            ->withQueryString();

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
            'news' => $news->getCollection()->map(fn (News $item) => $this->transformTableItem($item))->values(),
            'newsPagination' => [
                'page' => $news->currentPage(),
                'limit' => $news->perPage(),
                'total' => $news->total(),
            ],
            'editingNews' => null,
        ]);
    }

    public function edit(News $news, Request $request): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->with(['subCategories' => fn ($query) => $query->where('is_active', true)->orderBy('name')])
            ->orderBy('name')
            ->get();

        $items = News::query()
            ->with([
                'author:id,name',
                'category:id,name',
                'subCategory:id,name,category_id',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $news->loadMissing(['author:id,name', 'category:id,name', 'subCategory:id,name,category_id']);

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
            'news' => $items->getCollection()->map(fn (News $item) => $this->transformTableItem($item))->values(),
            'newsPagination' => [
                'page' => $items->currentPage(),
                'limit' => $items->perPage(),
                'total' => $items->total(),
            ],
            'editingNews' => $this->transformEditorItem($news),
        ]);
    }

    public function store(StoreNewsRequest $request, UploadMediaAction $uploadMedia): RedirectResponse
    {
        $coverImagePath = $uploadMedia->execute(
            $request->file('cover_image'),
            config('media.news.covers_directory', 'uploads/news/covers')
        );

        $imagePaths = $this->uploadCollection(
            $request->file('images', []),
            $uploadMedia,
            config('media.news.images_directory', 'uploads/news/images')
        );

        $videoPaths = $this->uploadCollection(
            $request->file('videos', []),
            $uploadMedia,
            config('media.news.videos_directory', 'uploads/news/videos')
        );

        $audioPath = $request->hasFile('audio_path')
            ? $uploadMedia->execute($request->file('audio_path'), config('media.news.audio_directory', 'uploads/news/audio'))
            : null;

        News::query()->create([
            'category_id' => $request->integer('category_id'),
            'sub_category_id' => $request->filled('sub_category_id') ? $request->integer('sub_category_id') : null,
            'user_id' => $request->user()->id,
            'title' => $request->string('title')->toString(),
            'excerpt' => $request->filled('excerpt') ? $request->string('excerpt')->toString() : null,
            'content' => $request->string('content')->toString(),
            'cover_image' => $coverImagePath,
            'audio_path' => $audioPath,
            'images' => $imagePaths === [] ? null : $imagePaths,
            'videos' => $videoPaths === [] ? null : $videoPaths,
            'is_breaking' => $request->boolean('is_breaking'),
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'views_count' => $request->integer('views_count'),
            'likes_count' => $request->integer('likes_count'),
            'published_at' => $request->date('published_at'),
        ]);

        return redirect()
            ->route('dashboard.news.index')
            ->with('success', 'Noticia creada correctamente.');
    }

    public function update(UpdateNewsRequest $request, News $news, UploadMediaAction $uploadMedia): RedirectResponse
    {
        $coverImagePath = $request->hasFile('cover_image')
            ? $uploadMedia->execute($request->file('cover_image'), config('media.news.covers_directory', 'uploads/news/covers'))
            : $news->cover_image;

        $imagePaths = $request->hasFile('images')
            ? $this->uploadCollection($request->file('images', []), $uploadMedia, config('media.news.images_directory', 'uploads/news/images'))
            : ($news->images ?? []);

        $videoPaths = $request->hasFile('videos')
            ? $this->uploadCollection($request->file('videos', []), $uploadMedia, config('media.news.videos_directory', 'uploads/news/videos'))
            : ($news->videos ?? []);

        $audioPath = $request->hasFile('audio_path')
            ? $uploadMedia->execute($request->file('audio_path'), config('media.news.audio_directory', 'uploads/news/audio'))
            : $news->audio_path;

        $news->update([
            'category_id' => $request->integer('category_id'),
            'sub_category_id' => $request->filled('sub_category_id') ? $request->integer('sub_category_id') : null,
            'title' => $request->string('title')->toString(),
            'excerpt' => $request->filled('excerpt') ? $request->string('excerpt')->toString() : null,
            'content' => $request->string('content')->toString(),
            'cover_image' => $coverImagePath,
            'audio_path' => $audioPath,
            'images' => $imagePaths === [] ? null : $imagePaths,
            'videos' => $videoPaths === [] ? null : $videoPaths,
            'is_breaking' => $request->boolean('is_breaking'),
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'views_count' => $request->integer('views_count'),
            'likes_count' => $request->integer('likes_count'),
            'published_at' => $request->date('published_at'),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Noticia actualizada correctamente.');
    }

    public function toggleStatus(News $news): RedirectResponse
    {
        $news->update([
            'is_published' => ! $news->is_published,
        ]);

        return redirect()
            ->back()
            ->with('success', $news->is_published ? 'Noticia activada correctamente.' : 'Noticia desactivada correctamente.');
    }

    /**
     * @param  array<int, UploadedFile>|UploadedFile|null  $files
     * @return array<int, string>
     */
    private function uploadCollection(array|UploadedFile|null $files, UploadMediaAction $uploadMedia, string $directory): array
    {
        if ($files instanceof UploadedFile) {
            return [$uploadMedia->execute($files, $directory)];
        }

        if (! is_array($files)) {
            return [];
        }

        return array_values(array_map(
            fn (UploadedFile $file) => $uploadMedia->execute($file, $directory),
            $files
        ));
    }

    private function transformTableItem(News $item): array
    {
        return [
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
        ];
    }

    private function transformEditorItem(News $news): array
    {
        return [
            'id' => $news->id,
            'slug' => $news->slug,
            'category_id' => $news->category_id,
            'sub_category_id' => $news->sub_category_id,
            'title' => $news->title,
            'excerpt' => $news->excerpt,
            'content' => $news->content,
            'cover_image_url' => $this->mediaUrl($news->cover_image),
            'audio_url' => $this->mediaUrl($news->audio_path),
            'images_urls' => collect($news->images ?? [])->map(fn (string $path) => $this->mediaUrl($path))->filter()->values()->all(),
            'videos_urls' => collect($news->videos ?? [])->map(fn (string $path) => $this->mediaUrl($path))->filter()->values()->all(),
            'views_count' => $news->views_count,
            'likes_count' => $news->likes_count,
            'published_at' => $news->published_at?->format('Y-m-d\TH:i'),
            'is_breaking' => $news->is_breaking,
            'is_featured' => $news->is_featured,
            'is_published' => $news->is_published,
            'author' => $news->author ? [
                'id' => $news->author->id,
                'name' => $news->author->name,
            ] : null,
        ];
    }

    private function mediaUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return Storage::disk(config('media.disk', 'public'))->url($path);
    }
}
