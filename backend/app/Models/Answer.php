<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Answer extends Model
{
    protected $fillable = ['question_id', 'parent_id', 'user_id', 'body', 'recommended_profile_id'];

    /** @return array<string, mixed> */
    public static function eagerReplyTree(int $depth = 10): array
    {
        $with = ['user:id,name'];
        if ($depth > 0) {
            $with['replies'] = fn ($q) => $q->latest()->with(self::eagerReplyTree($depth - 1));
        }

        return $with;
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Answer::class, 'parent_id')->latest();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
