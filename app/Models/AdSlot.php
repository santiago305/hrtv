<?php

namespace App\Models;

use App\Enums\AdPageType;
use App\Enums\AdSize;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'page_type',
        'size',
        'banner_width',
        'banner_height',
        'description',
        'is_active',
    ];

    protected $casts = [
        'page_type' => AdPageType::class,
        'size' => AdSize::class,
        'is_active' => 'boolean',
    ];

    public function campaignTargets(): HasMany
    {
        return $this->hasMany(CampaignSlotTarget::class);
    }

    public function creatives(): HasMany
    {
        return $this->hasMany(AdCreative::class);
    }
}
