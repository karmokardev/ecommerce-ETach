<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $return_id
 * @property int $product_variant_id
 * @property int $quantity
 * @property float $refund_price
 * @property string $condition
 * @property string $restock_status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ProductReturn $productReturn
 * @property-read \App\Models\ProductVariant $variant
 */
#[Fillable([
    'return_id',
    'product_variant_id',
    'quantity',
    'refund_price',
    'condition',
    'restock_status',
    'notes',
])]
class ReturnItem extends Model
{
    use HasFactory;

    protected $table = 'return_items';

    protected function casts(): array
    {
        return [
            'refund_price' => 'decimal:2',
        ];
    }

    /**
     * Get the return that owns the item.
     */
    public function productReturn(): BelongsTo
    {
        return $this->belongsTo(ProductReturn::class, 'return_id');
    }

    /**
     * Get the product variant for the item.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Scope to get only pending restock items.
     */
    public function scopePendingRestock($query)
    {
        return $query->where('restock_status', 'pending');
    }

    /**
     * Scope to get only completed restock items.
     */
    public function scopeCompletedRestock($query)
    {
        return $query->where('restock_status', 'completed');
    }

    /**
     * Scope to get only rejected restock items.
     */
    public function scopeRejectedRestock($query)
    {
        return $query->where('restock_status', 'rejected');
    }

    /**
     * Check if item can be restocked.
     */
    public function canBeRestocked(): bool
    {
        return $this->restock_status === 'pending' && $this->condition !== 'damaged';
    }

    /**
     * Mark as restocked.
     */
    public function markAsRestocked(): void
    {
        $this->restock_status = 'completed';
        $this->save();
    }

    /**
     * Mark as restock rejected.
     */
    public function markAsRestockRejected(): void
    {
        $this->restock_status = 'rejected';
        $this->save();
    }
}
