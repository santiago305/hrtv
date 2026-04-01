<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';

    protected $fillable = [
        'category_id',
        'sub_category_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'audio_path',
        'images',
        'videos',
        'is_breaking',
        'is_featured',
        'is_published',
        'views_count',
        'likes_count',
        'published_at',
    ];

    protected $casts = [
        'images' => 'array',
        'videos' => 'array',
        'is_breaking' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $news): void {
            if (blank($news->slug)) {
                $news->slug = static::generateUniqueSlug($news->title);
            }

            if ($news->is_published && $news->published_at === null) {
                $news->published_at = now();
            }
        });

        static::updating(function (self $news): void {
            if ($news->isDirty('title') && ! $news->isDirty('slug')) {
                $news->slug = static::generateUniqueSlug($news->title, $news->id);
            }

            if ($news->is_published && $news->published_at === null) {
                $news->published_at = now();
            }
        });
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : 'noticia';
        $originalSlug = $slug;
        $counter = 2;

        while (static::query()
            ->when($ignoreId !== null, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
