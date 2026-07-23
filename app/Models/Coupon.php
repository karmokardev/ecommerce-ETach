<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $code
 * @property string $type
 * @property float $value
 * @property float|null $minimum_order_amount
 * @property float|null $maximum_discount_amount
 * @property int|null $usage_limit
 * @property int $used_count
 * @property int|null $per_user_limit
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property bool $is_active
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
#[Fillable([
    'code',
    'type',
    'value',
    'minimum_order_amount',
    'maximum_discount_amount',
    'usage_limit',
    'used_count',
    'per_user_limit',
    'starts_at',
    'expires_at',
    'is_active',
    'description',
])]
class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'minimum_order_amount' => 'decimal:2',
            'maximum_discount_amount' => 'decimal:2',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get only active coupons.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope to get only expired coupons.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope to get only upcoming coupons.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>', now());
    }

    /**
     * Check if coupon is valid.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount.
     */
    public function calculateDiscount(float $orderAmount): float
    {
        if ($this->minimum_order_amount && $orderAmount < $this->minimum_order_amount) {
            return 0;
        }

        $discount = $this->type === 'percentage' 
            ? $orderAmount * ($this->value / 100) 
            : $this->value;

        if ($this->maximum_discount_amount && $discount > $this->maximum_discount_amount) {
            $discount = $this->maximum_discount_amount;
        }

        return min($discount, $orderAmount);
    }

    /**
     * Increment used count.
     */
    public function incrementUsedCount(): void
    {
        $this->increment('used_count');
    }
}
