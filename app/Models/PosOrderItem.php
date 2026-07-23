<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $pos_order_id
 * @property int $product_variant_id
 * @property int $quantity
 * @property float $unit_price
 * @property float $subtotal
 * @property float $discount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PosOrder $posOrder
 * @property-read \App\Models\ProductVariant $variant
 */
#[Fillable([
    'pos_order_id',
    'product_variant_id',
    'quantity',
    'unit_price',
    'subtotal',
    'discount',
])]
class PosOrderItem extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
        ];
    }

    /**
     * Get the POS order that owns the item.
     */
    public function posOrder(): BelongsTo
    {
        return $this->belongsTo(PosOrder::class);
    }

    /**
     * Get the product variant for the item.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
