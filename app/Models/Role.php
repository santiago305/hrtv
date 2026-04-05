<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    public const HIERARCHY = [
        'admin' => 100,
        'moderator' => 50,
        'writer' => 20,
        'streamer' => 10,
    ];

    protected $fillable = [
        'name',
        'slug',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function hierarchyLevel(): int
    {
        return self::HIERARCHY[$this->slug] ?? 0;
    }
}
