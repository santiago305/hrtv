<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role_id',
        'email_verified_at',
        'is_active',
        'password',
        'profile_photo_path',
    ];

    protected $appends = [
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }

    public function roleHierarchyLevel(): int
    {
        return $this->role?->hierarchyLevel() ?? 0;
    }

    public function canManageRole(Role $role): bool
    {
        return $role->hierarchyLevel() < $this->roleHierarchyLevel();
    }

    public function hasRole(string $role): bool
    {
        return $this->role?->slug === $role;
    }

    /**
     * @param  array<int, string>  $roles
     */
    public function hasAnyRole(array $roles): bool
    {
        if ($roles === []) {
            return true;
        }

        $userRole = $this->role?->slug;

        if ($userRole === null) {
            return false;
        }

        return in_array($userRole, $roles, true);
    }

    public function scopeExcludeUser(Builder $query, ?int $userId): Builder
    {
        if ($userId === null) {
            return $query;
        }

        return $query->whereKeyNot($userId);
    }

    public function getAvatarAttribute(): ?string
    {
        if (! $this->profile_photo_path) {
            return null;
        }

        return Storage::disk(config('media.disk', 'public'))->url($this->profile_photo_path);
    }
}
