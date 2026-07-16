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
 * @property int $supplier_id
 * @property int $warehouse_id
 * @property string $invoice_no
 * @property \Illuminate\Support\Carbon $purchase_date
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Supplier $supplier
 * @property-read \App\Models\Warehouse $warehouse
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PurchaseItem> $items
 */
#[Fillable([
    'supplier_id',
    'warehouse_id',
    'invoice_no',
    'purchase_date',
    'notes',
    'status',
])]
class Purchase extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
        ];
    }

    /**
     * Get the supplier that owns the purchase.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the warehouse that owns the purchase.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the items for the purchase.
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Scope to get only completed purchases.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to get only draft purchases.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope to search by invoice no.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('invoice_no', 'like', "%{$search}%");
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get total amount of the purchase.
     */
    public function getTotalAmountAttribute(): float
    {
        return $this->items()->sum('subtotal');
    }
}
