<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $status
 * @property int $sort
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AttributeValue> $values
 */
#[Fillable([
    'name',
    'slug',
    'status',
    'sort',
])]
class Attribute extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'sort' => 'integer',
        ];
    }

    /**
     * Get the attribute values for this attribute.
     */
    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class)->orderBy('sort');
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($attribute) {
            if (empty($attribute->slug) && !empty($attribute->name)) {
                $attribute->slug = Str::slug($attribute->name);
            }
            if (empty($attribute->sort)) {
                $attribute->sort = self::max('sort') + 1;
            }
        });

        static::updating(function ($attribute) {
            if (empty($attribute->slug) && !empty($attribute->name)) {
                $attribute->slug = Str::slug($attribute->name);
            }
        });
    }

    /**
     * Scope to get only active attributes.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search by name or slug.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
