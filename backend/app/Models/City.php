<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $fillable = ['name', 'county', 'postal_code', 'active'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function profiles(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
}
