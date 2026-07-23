<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $flash_sale_id
 * @property int $product_id
 * @property int|null $product_variant_id
 * @property float $original_price
 * @property float $sale_price
 * @property int|null $stock_limit
 * @property int $sold_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FlashSale $flashSale
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\ProductVariant|null $variant
 */
#[Fillable([
    'flash_sale_id',
    'product_id',
    'product_variant_id',
    'original_price',
    'sale_price',
    'stock_limit',
    'sold_count',
])]
class FlashSaleProduct extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'original_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'stock_limit' => 'integer',
            'sold_count' => 'integer',
        ];
    }

    /**
     * Get the flash sale that owns the product.
     */
    public function flashSale(): BelongsTo
    {
        return $this->belongsTo(FlashSale::class);
    }

    /**
     * Get the product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Check if product is still available.
     */
    public function isAvailable(): bool
    {
        if ($this->stock_limit === null) {
            return true;
        }

        return $this->sold_count < $this->stock_limit;
    }

    /**
     * Get remaining stock.
     */
    public function getRemainingStockAttribute(): int
    {
        if ($this->stock_limit === null) {
            return PHP_INT_MAX;
        }

        return max(0, $this->stock_limit - $this->sold_count);
    }

    /**
     * Get discount percentage.
     */
    public function getDiscountPercentageAttribute(): float
    {
        if ($this->original_price == 0) {
            return 0;
        }

        return round((($this->original_price - $this->sale_price) / $this->original_price) * 100, 2);
    }

    /**
     * Increment sold count.
     */
    public function incrementSoldCount(int $quantity = 1): void
    {
        $this->increment('sold_count', $quantity);
    }
}
