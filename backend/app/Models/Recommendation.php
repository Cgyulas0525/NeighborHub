<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recommendation extends Model
{
    protected $fillable = [
        'recommender_user_id',
        'recommended_profile_id',
        'service_id',
        'product_id',
        'rating',
        'text',
        'status',
    ];

    protected function casts(): array
    {
        return ['rating' => 'integer'];
    }

    public function recommender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recommender_user_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'recommended_profile_id');
    }
}
