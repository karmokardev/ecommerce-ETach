<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property int $warehouse_id
 * @property int $product_variant_id
 * @property string $type
 * @property int $quantity
 * @property int $before_stock
 * @property int $after_stock
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property string|null $remarks
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Warehouse $warehouse
 * @property-read \App\Models\ProductVariant $variant
 * @property-read Model|null $reference
 */
#[Fillable([
    'warehouse_id',
    'product_variant_id',
    'type',
    'quantity',
    'before_stock',
    'after_stock',
    'reference_type',
    'reference_id',
    'remarks',
])]
class StockMovement extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'before_stock' => 'integer',
            'after_stock' => 'integer',
        ];
    }

    /**
     * Get the warehouse that owns the movement.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the variant that owns the movement.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Get the reference model (polymorphic).
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope to filter by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
