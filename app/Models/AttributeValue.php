<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $attribute_id
 * @property string $value
 * @property string $slug
 * @property string $status
 * @property int $sort
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Attribute $attribute
 */
#[Fillable([
    'attribute_id',
    'value',
    'slug',
    'status',
    'sort',
])]
class AttributeValue extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'sort' => 'integer',
        ];
    }

    /**
     * Get the attribute that owns the value.
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($value) {
            if (empty($value->slug) && !empty($value->value)) {
                $value->slug = Str::slug($value->value);
            }
            if (empty($value->sort)) {
                $maxSort = self::where('attribute_id', $value->attribute_id)->max('sort');
                $value->sort = ($maxSort ?? 0) + 1;
            }
        });

        static::updating(function ($value) {
            if (empty($value->slug) && !empty($value->value)) {
                $value->slug = Str::slug($value->value);
            }
        });
    }

    /**
     * Scope to get only active values.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search by value or slug.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('value', 'like', "%{$search}%")
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

    /**
     * Scope to filter by attribute.
     */
    public function scopeByAttribute($query, $attributeId)
    {
        return $query->where('attribute_id', $attributeId);
    }
}
