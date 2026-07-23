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
 * @property int|null $user_id
 * @property string $order_no
 * @property string $customer_name
 * @property string $customer_email
 * @property string|null $customer_phone
 * @property string $shipping_address
 * @property string|null $billing_address
 * @property float $subtotal
 * @property float $shipping_cost
 * @property float $tax
 * @property float $discount
 * @property float $total
 * @property string $payment_method
 * @property string $payment_status
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $order_date
 * @property \Illuminate\Support\Carbon|null $shipped_date
 * @property \Illuminate\Support\Carbon|null $delivered_date
 * @property \Illuminate\Support\Carbon|null $cancelled_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\User|null $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $items
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderReturn> $returns
 */
#[Fillable([
    'user_id',
    'order_no',
    'customer_name',
    'customer_email',
    'customer_phone',
    'shipping_address',
    'billing_address',
    'subtotal',
    'shipping_cost',
    'tax',
    'discount',
    'total',
    'payment_method',
    'payment_status',
    'status',
    'notes',
    'order_date',
    'shipped_date',
    'delivered_date',
    'cancelled_date',
])]
class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'tax' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'order_date' => 'datetime',
            'shipped_date' => 'datetime',
            'delivered_date' => 'datetime',
            'cancelled_date' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_no)) {
                $order->order_no = self::generateOrderNo();
            }
            if (empty($order->order_date)) {
                $order->order_date = now();
            }
        });
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNo(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $lastOrder = self::where('order_no', 'like', "{$prefix}{$date}%")
            ->orderBy('id', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_no, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "{$prefix}{$date}{$newNumber}";
    }

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the returns for the order.
     */
    public function returns(): HasMany
    {
        return $this->hasMany(OrderReturn::class);
    }

    /**
     * Scope to get only pending orders.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get only processing orders.
     */
    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    /**
     * Scope to get only shipped orders.
     */
    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    /**
     * Scope to get only delivered orders.
     */
    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    /**
     * Scope to get only cancelled orders.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope to search by order no or customer name/email.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('order_no', 'like', "%{$search}%")
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('customer_email', 'like', "%{$search}%")
                ->orWhere('customer_phone', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to filter by status.
     */
    public function scopeFilterByStatus($query, $status)
    {
        if ($status && $status !== 'all') {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope to filter by payment status.
     */
    public function scopeFilterByPaymentStatus($query, $paymentStatus)
    {
        if ($paymentStatus && $paymentStatus !== 'all') {
            return $query->where('payment_status', $paymentStatus);
        }
        return $query;
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeFilterByDateRange($query, $startDate, $endDate)
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('order_date', [$startDate, $endDate]);
        }
        return $query;
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get total items count.
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items()->sum('quantity');
    }

    /**
     * Check if order can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Check if order can be shipped.
     */
    public function canBeShipped(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Check if order can be delivered.
     */
    public function canBeDelivered(): bool
    {
        return $this->status === 'shipped';
    }

    /**
     * Mark order as shipped.
     */
    public function markAsShipped(): void
    {
        $this->status = 'shipped';
        $this->shipped_date = now();
        $this->save();
    }

    /**
     * Mark order as delivered.
     */
    public function markAsDelivered(): void
    {
        $this->status = 'delivered';
        $this->delivered_date = now();
        $this->save();
    }

    /**
     * Mark order as cancelled.
     */
    public function markAsCancelled(): void
    {
        $this->status = 'cancelled';
        $this->cancelled_date = now();
        $this->save();
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'processing' => 'bg-blue-100 text-blue-800',
            'shipped' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get payment status badge color.
     */
    public function getPaymentStatusBadgeColorAttribute(): string
    {
        return match($this->payment_status) {
            'paid' => 'bg-green-100 text-green-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            'failed' => 'bg-red-100 text-red-800',
            'refunded' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
