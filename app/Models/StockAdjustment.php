<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $warehouse_id
 * @property int $product_variant_id
 * @property string $adjustment_type
 * @property int $quantity
 * @property string|null $reason
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Warehouse $warehouse
 * @property-read \App\Models\ProductVariant $variant
 */
#[Fillable([
    'warehouse_id',
    'product_variant_id',
    'adjustment_type',
    'quantity',
    'reason',
    'notes',
])]
class StockAdjustment extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    /**
     * Get the warehouse that owns the adjustment.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the variant that owns the adjustment.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
