<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string|null $session_id
 * @property float $subtotal
 * @property float $discount
 * @property float $tax
 * @property float $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CartItem> $items
 */
#[Fillable([
    'user_id',
    'session_id',
    'subtotal',
    'discount',
    'tax',
    'total',
])]
class Cart extends Model
{
    use HasFactory;

    public $timestamps = true;

    /**
     * Get the user that owns the cart.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the cart items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Calculate and update cart totals.
     */
    public function updateTotals(): void
    {
        $this->subtotal = $this->items()->sum('subtotal');
        $this->discount = 0; // Can be updated with coupon logic
        $this->tax = $this->subtotal * 0.15; // 15% tax, can be configurable
        $this->total = $this->subtotal - $this->discount + $this->tax;
        $this->save();
    }

    /**
     * Get or create cart for user.
     */
    public static function getOrCreateForUser(int $userId): self
    {
        $cart = self::where('user_id', $userId)->first();
        
        if (!$cart) {
            $cart = self::create(['user_id' => $userId]);
        }
        
        return $cart;
    }

    /**
     * Get or create cart for session.
     */
    public static function getOrCreateForSession(string $sessionId): self
    {
        $cart = self::where('session_id', $sessionId)->first();
        
        if (!$cart) {
            $cart = self::create(['session_id' => $sessionId]);
        }
        
        return $cart;
    }
}
