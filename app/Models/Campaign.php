<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'advertiser_id',
        'name',
        'start_date',
        'end_date',
        'status',
        'priority_weight',
        'impressions_count',
        'clicks_count',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => CampaignStatus::class,
    ];

    public function advertiser(): BelongsTo
    {
        return $this->belongsTo(Advertiser::class);
    }

    public function slotTargets(): HasMany
    {
        return $this->hasMany(CampaignSlotTarget::class);
    }

    public function creatives(): HasMany
    {
        return $this->hasMany(AdCreative::class);
    }

    public function scopeEligible(Builder $query): Builder
    {
        return $query
            ->where('status', CampaignStatus::Active->value)
            ->whereDate('start_date', '<=', now()->toDateString())
            ->whereDate('end_date', '>=', now()->toDateString())
            ->whereHas('advertiser', fn (Builder $builder) => $builder->where('is_active', true));
    }
}
