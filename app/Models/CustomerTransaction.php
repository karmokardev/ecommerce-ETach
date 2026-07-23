<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $customer_account_id
 * @property string $type
 * @property float $amount
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property string|null $description
 * @property float $balance_after
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CustomerAccount $customerAccount
 */
#[Fillable([
    'customer_account_id',
    'type',
    'amount',
    'reference_type',
    'reference_id',
    'description',
    'balance_after',
])]
class CustomerTransaction extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    /**
     * Get the customer account that owns the transaction.
     */
    public function customerAccount(): BelongsTo
    {
        return $this->belongsTo(CustomerAccount::class);
    }

    /**
     * Scope to get only credit transactions.
     */
    public function scopeCredit($query)
    {
        return $query->where('type', 'credit');
    }

    /**
     * Scope to get only debit transactions.
     */
    public function scopeDebit($query)
    {
        return $query->where('type', 'debit');
    }

    /**
     * Scope to get only payment transactions.
     */
    public function scopePayment($query)
    {
        return $query->where('type', 'payment');
    }

    /**
     * Scope to get only refund transactions.
     */
    public function scopeRefund($query)
    {
        return $query->where('type', 'refund');
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
