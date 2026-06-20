<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'active',
        'approval_status',
        'requested_by_user_id',
    ];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class);
    }
}
