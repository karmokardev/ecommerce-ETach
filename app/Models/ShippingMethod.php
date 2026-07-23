<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $courier
 * @property float $base_cost
 * @property float $cost_per_weight
 * @property float $cost_per_item
 * @property float|null $min_order_amount
 * @property float|null $max_order_amount
 * @property int $estimated_delivery_days
 * @property bool $is_active
 * @property int $sort_order
 * @property array|null $settings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Shipment> $shipments
 */
#[Fillable([
    'name',
    'slug',
    'description',
    'courier',
    'base_cost',
    'cost_per_weight',
    'cost_per_item',
    'min_order_amount',
    'max_order_amount',
    'estimated_delivery_days',
    'is_active',
    'sort_order',
    'settings',
])]
class ShippingMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'base_cost' => 'decimal:2',
            'cost_per_weight' => 'decimal:2',
            'cost_per_item' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'max_order_amount' => 'decimal:2',
            'is_active' => 'boolean',
            'settings' => 'array',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($method) {
            if (empty($method->slug)) {
                $method->slug = str($method->name)->slug()->toString();
            }
        });
    }

    /**
     * Get the orders for the shipping method.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the shipments for the shipping method.
     */
    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    /**
     * Scope to get only active shipping methods.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by courier.
     */
    public function scopeByCourier($query, $courier)
    {
        return $query->where('courier', $courier);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Calculate shipping cost for an order.
     */
    public function calculateCost(float $orderAmount, float $weight = 0, int $itemCount = 0): float
    {
        $cost = $this->base_cost;

        // Check order amount limits
        if ($this->min_order_amount && $orderAmount < $this->min_order_amount) {
            return 0; // Not eligible for this method
        }

        if ($this->max_order_amount && $orderAmount > $this->max_order_amount) {
            return 0; // Not eligible for this method
        }

        // Add weight-based cost
        $cost += $weight * $this->cost_per_weight;

        // Add item-based cost
        $cost += $itemCount * $this->cost_per_item;

        return max(0, $cost);
    }

    /**
     * Get courier display name.
     */
    public function getCourierDisplayNameAttribute(): string
    {
        return match($this->courier) {
            'pathao' => 'Pathao',
            'redx' => 'RedX',
            'steadfast' => 'Steadfast',
            'sundarban' => 'Sundarban',
            'custom' => 'Custom',
            default => ucfirst($this->courier),
        };
    }

    /**
     * Get courier API service class.
     */
    public function getCourierServiceAttribute(): ?object
    {
        return match($this->courier) {
            'pathao' => new \App\Services\Couriers\PathaoService($this->settings ?? []),
            'redx' => new \App\Services\Couriers\RedXService($this->settings ?? []),
            'steadfast' => new \App\Services\Couriers\SteadfastService($this->settings ?? []),
            'sundarban' => new \App\Services\Couriers\SundarbanService(),
            default => null,
        };
    }
}
