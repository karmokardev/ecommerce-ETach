<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property float $balance
 * @property float $credit_limit
 * @property float $total_due
 * @property \Illuminate\Support\Carbon|null $last_payment_date
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomerTransaction> $transactions
 */
#[Fillable([
    'user_id',
    'balance',
    'credit_limit',
    'total_due',
    'last_payment_date',
    'is_active',
])]
class CustomerAccount extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
            'credit_limit' => 'decimal:2',
            'total_due' => 'decimal:2',
            'last_payment_date' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the account.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(CustomerTransaction::class);
    }

    /**
     * Scope to get only active accounts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get accounts with due balance.
     */
    public function scopeWithDue($query)
    {
        return $query->where('balance', '<', 0);
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Check if customer can make credit purchase.
     */
    public function canMakeCreditPurchase(float $amount): bool
    {
        $availableCredit = $this->credit_limit + $this->balance;
        return $this->is_active && $availableCredit >= $amount;
    }

    /**
     * Get available credit.
     */
    public function getAvailableCreditAttribute(): float
    {
        return $this->credit_limit + $this->balance;
    }
}
