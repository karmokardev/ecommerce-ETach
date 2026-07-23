<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $order_id
 * @property int $order_item_id
 * @property int|null $user_id
 * @property string $return_no
 * @property string $reason
 * @property string|null $description
 * @property string $status
 * @property int $quantity
 * @property float|null $refund_amount
 * @property string $refund_status
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $requested_date
 * @property \Illuminate\Support\Carbon|null $processed_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\OrderItem $orderItem
 * @property-read \App\Models\User|null $user
 */
#[Fillable([
    'order_id',
    'order_item_id',
    'user_id',
    'return_no',
    'reason',
    'description',
    'status',
    'quantity',
    'refund_amount',
    'refund_status',
    'admin_notes',
    'requested_date',
    'processed_date',
])]
class OrderReturn extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'refund_amount' => 'decimal:2',
            'requested_date' => 'datetime',
            'processed_date' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($return) {
            if (empty($return->return_no)) {
                $return->return_no = self::generateReturnNo();
            }
            if (empty($return->requested_date)) {
                $return->requested_date = now();
            }
        });
    }

    /**
     * Generate a unique return number.
     */
    public static function generateReturnNo(): string
    {
        $prefix = 'RET';
        $date = now()->format('Ymd');
        $lastReturn = self::where('return_no', 'like', "{$prefix}{$date}%")
            ->orderBy('id', 'desc')
            ->first();

        if ($lastReturn) {
            $lastNumber = (int) substr($lastReturn->return_no, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "{$prefix}{$date}{$newNumber}";
    }

    /**
     * Get the order that owns the return.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the order item that owns the return.
     */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * Get the user that owns the return.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only pending returns.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get only approved returns.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get only rejected returns.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope to get only completed returns.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to search by return no.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('return_no', 'like', "%{$search}%");
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-blue-100 text-blue-800',
            'rejected' => 'bg-red-100 text-red-800',
            'completed' => 'bg-green-100 text-green-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get refund status badge color.
     */
    public function getRefundStatusBadgeColorAttribute(): string
    {
        return match($this->refund_status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-blue-100 text-blue-800',
            'processed' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Check if return can be approved.
     */
    public function canBeApproved(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if return can be rejected.
     */
    public function canBeRejected(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if return can be completed.
     */
    public function canBeCompleted(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Approve the return.
     */
    public function approve(): void
    {
        $this->status = 'approved';
        $this->processed_date = now();
        $this->save();
    }

    /**
     * Reject the return.
     */
    public function reject(): void
    {
        $this->status = 'rejected';
        $this->processed_date = now();
        $this->save();
    }

    /**
     * Complete the return.
     */
    public function complete(): void
    {
        $this->status = 'completed';
        $this->refund_status = 'processed';
        $this->processed_date = now();
        $this->save();
    }
}
