<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsDailyEngagementStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'news_id',
        'date',
        'views_count',
        'likes_count',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}
