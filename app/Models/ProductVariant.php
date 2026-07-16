<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $product_id
 * @property string $sku
 * @property string|null $barcode
 * @property float $price
 * @property float|null $compare_price
 * @property float|null $cost_price
 * @property float|null $weight
 * @property string|null $dimensions
 * @property int $current_stock
 * @property int|null $low_stock_alert
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Product $product
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockMovement> $stockMovements
 */
#[Fillable([
    'product_id',
    'sku',
    'barcode',
    'price',
    'compare_price',
    'cost_price',
    'weight',
    'dimensions',
    'current_stock',
    'low_stock_alert',
    'status',
])]
class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'current_stock' => 'integer',
            'low_stock_alert' => 'integer',
        ];
    }

    /**
     * Get the product that owns the variant.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the stock movements for the variant.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Scope to get only active variants.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search by SKU or barcode.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('sku', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%");
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
     * Check if stock is low.
     */
    public function isLowStock(): bool
    {
        $threshold = $this->low_stock_alert ?? config('inventory.low_stock_threshold', 5);
        return $this->current_stock <= $threshold;
    }

    /**
     * Check if variant is out of stock.
     */
    public function isOutOfStock(): bool
    {
        return $this->current_stock <= 0;
    }
}
