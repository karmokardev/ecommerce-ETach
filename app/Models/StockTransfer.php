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
 * @property string $transfer_no
 * @property int $from_warehouse_id
 * @property int $to_warehouse_id
 * @property \Illuminate\Support\Carbon $transfer_date
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Warehouse $fromWarehouse
 * @property-read \App\Models\Warehouse $toWarehouse
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockTransferItem> $items
 */
#[Fillable([
    'transfer_no',
    'from_warehouse_id',
    'to_warehouse_id',
    'transfer_date',
    'notes',
    'status',
])]
class StockTransfer extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'transfer_date' => 'date',
        ];
    }

    /**
     * Get the source warehouse.
     */
    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    /**
     * Get the destination warehouse.
     */
    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    /**
     * Get the items for the transfer.
     */
    public function items(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
    }

    /**
     * Scope to get only completed transfers.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to get only pending transfers.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
