<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdClick extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'creative_id',
        'campaign_id',
        'advertiser_id',
        'ad_slot_id',
        'page_type',
        'clicked_at',
        'session_id',
        'ip_hash',
        'user_agent_hash',
        'referrer_url',
    ];

    protected $casts = [
        'clicked_at' => 'datetime',
    ];

    public function creative(): BelongsTo
    {
        return $this->belongsTo(AdCreative::class, 'creative_id');
    }
}
