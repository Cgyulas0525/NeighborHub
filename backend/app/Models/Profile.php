<?php

namespace App\Models;

use App\Support\ProfileAvatarGenerator;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'display_name',
        'phone',
        'city_id',
        'address_optional',
        'introduction',
        'profile_image',
        'website',
        'facebook_url',
        'public_email',
        'is_service_provider',
        'approval_status',
    ];

    protected $appends = ['profile_image_url', 'profile_image_generated'];

    protected function casts(): array
    {
        return ['is_service_provider' => 'boolean'];
    }

    protected function profileImageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->profile_image ? '/api/profiles/'.$this->id.'/avatar' : null,
        );
    }

    protected function profileImageGenerated(): Attribute
    {
        return Attribute::get(
            fn () => ProfileAvatarGenerator::isGeneratedPath($this->profile_image),
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'profile_skill');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(Recommendation::class, 'recommended_profile_id');
    }
}
