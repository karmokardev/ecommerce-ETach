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
 * @property string|null $description
 * @property string $discount_type
 * @property float $discount_value
 * @property \Illuminate\Support\Carbon $starts_at
 * @property \Illuminate\Support\Carbon $ends_at
 * @property bool $is_active
 * @property int $priority
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FlashSaleProduct> $products
 */
#[Fillable([
    'name',
    'slug',
    'description',
    'discount_type',
    'discount_value',
    'starts_at',
    'ends_at',
    'is_active',
    'priority',
])]
class FlashSale extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($flashSale) {
            if (empty($flashSale->slug) && !empty($flashSale->name)) {
                $flashSale->slug = self::generateUniqueSlug($flashSale->name);
            }
        });

        static::updating(function ($flashSale) {
            if ($flashSale->isDirty('name') && empty($flashSale->slug)) {
                $flashSale->slug = self::generateUniqueSlug($flashSale->name);
            }
        });
    }

    /**
     * Generate a unique slug.
     */
    public static function generateUniqueSlug($name, $id = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (self::where('slug', $slug)->when($id, fn($q) => $q->where('id', '!=', $id))->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }

    /**
     * Get the products for the flash sale.
     */
    public function products(): HasMany
    {
        return $this->hasMany(FlashSaleProduct::class);
    }

    /**
     * Scope to get only active flash sales.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>', now());
    }

    /**
     * Scope to get only upcoming flash sales.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('is_active', true)
            ->where('starts_at', '>', now());
    }

    /**
     * Scope to get only expired flash sales.
     */
    public function scopeExpired($query)
    {
        return $query->where('ends_at', '<', now());
    }

    /**
     * Check if flash sale is currently active.
     */
    public function isActive(): bool
    {
        return $this->is_active && 
               $this->starts_at->isPast() && 
               $this->ends_at->isFuture();
    }

    /**
     * Get remaining time in seconds.
     */
    public function getRemainingTimeAttribute(): int
    {
        return max(0, $this->ends_at->diffInSeconds(now()));
    }
}
