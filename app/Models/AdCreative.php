<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class AdCreative extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'ad_slot_id',
        'title',
        'file_path',
        'target_url',
        'width',
        'height',
        'mime_type',
        'file_size',
        'alt_text',
        'display_weight',
        'impressions_count',
        'clicks_count',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'file_url',
        'size',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function adSlot(): BelongsTo
    {
        return $this->belongsTo(AdSlot::class);
    }

    public function impressions(): HasMany
    {
        return $this->hasMany(AdImpression::class, 'creative_id');
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(AdClick::class, 'creative_id');
    }

    public function getFileUrlAttribute(): string
    {
        return Storage::disk(config('media.disk', 'public'))->url($this->file_path);
    }

    public function getSizeAttribute(): ?string
    {
        return $this->adSlot?->size?->value;
    }
}
