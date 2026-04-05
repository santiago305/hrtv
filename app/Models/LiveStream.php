<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class LiveStream extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_LIVE = 'live';
    public const STATUS_ENDED = 'ended';

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'short_description',
        'description',
        'platform',
        'youtube_url',
        'youtube_video_id',
        'embed_url',
        'iframe_html',
        'thumbnail_url',
        'status',
        'is_active',
        'is_featured',
        'scheduled_at',
        'started_at',
        'ended_at',
        'sort_order',
        'views_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'views_count' => 'integer',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $stream): void {
            if (blank($stream->slug)) {
                $stream->slug = static::generateUniqueSlug($stream->title);
            }

            static::syncStatusTimestamps($stream);
        });

        static::updating(function (self $stream): void {
            if ($stream->isDirty('title') && ! $stream->isDirty('slug')) {
                $stream->slug = static::generateUniqueSlug($stream->title, $stream->id);
            }

            static::syncStatusTimestamps($stream);
        });
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : 'transmision';
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

    public static function validStatuses(): array
    {
        return [
            self::STATUS_DRAFT,
            self::STATUS_SCHEDULED,
            self::STATUS_LIVE,
            self::STATUS_ENDED,
        ];
    }

    private static function syncStatusTimestamps(self $stream): void
    {
        if ($stream->status === self::STATUS_LIVE && $stream->started_at === null) {
            $stream->started_at = now();
        }

        if ($stream->status === self::STATUS_ENDED) {
            if ($stream->started_at === null) {
                $stream->started_at = now();
            }

            if ($stream->ended_at === null) {
                $stream->ended_at = now();
            }
        }
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
