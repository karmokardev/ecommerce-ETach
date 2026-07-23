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
 * @property int|null $shipping_method_id
 * @property int|null $shipping_zone_id
 * @property string|null $tracking_number
 * @property string $courier
 * @property string $status
 * @property string|null $tracking_url
 * @property array|null $tracking_history
 * @property float $shipping_cost
 * @property string $recipient_name
 * @property string $recipient_phone
 * @property string $shipping_address
 * @property string|null $pickup_address
 * @property float $weight
 * @property float|null $length
 * @property float|null $width
 * @property float|null $height
 * @property string $package_type
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $picked_up_at
 * @property \Illuminate\Support\Carbon|null $delivered_at
 * @property \Illuminate\Support\Carbon|null $estimated_delivery_at
 * @property array|null $courier_response
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\ShippingMethod|null $shippingMethod
 * @property-read \App\Models\ShippingZone|null $shippingZone
 */
#[Fillable([
    'order_id',
    'shipping_method_id',
    'shipping_zone_id',
    'tracking_number',
    'courier',
    'status',
    'tracking_url',
    'tracking_history',
    'shipping_cost',
    'recipient_name',
    'recipient_phone',
    'shipping_address',
    'pickup_address',
    'weight',
    'length',
    'width',
    'height',
    'package_type',
    'notes',
    'picked_up_at',
    'delivered_at',
    'estimated_delivery_at',
    'courier_response',
])]
class Shipment extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'shipping_cost' => 'decimal:2',
            'weight' => 'decimal:2',
            'length' => 'decimal:2',
            'width' => 'decimal:2',
            'height' => 'decimal:2',
            'tracking_history' => 'array',
            'courier_response' => 'array',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
            'estimated_delivery_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($shipment) {
            if (empty($shipment->tracking_number)) {
                $shipment->tracking_number = self::generateTrackingNumber();
            }
        });
    }

    /**
     * Generate a unique tracking number.
     */
    public static function generateTrackingNumber(): string
    {
        $prefix = 'TRK';
        $date = now()->format('Ymd');
        $lastShipment = self::where('tracking_number', 'like', "{$prefix}{$date}%")
            ->orderBy('id', 'desc')
            ->first();

        if ($lastShipment) {
            $lastNumber = (int) substr($lastShipment->tracking_number, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "{$prefix}{$date}{$newNumber}";
    }

    /**
     * Get the order for the shipment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the shipping method for the shipment.
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * Get the shipping zone for the shipment.
     */
    public function shippingZone(): BelongsTo
    {
        return $this->belongsTo(ShippingZone::class);
    }

    /**
     * Scope to get only pending shipments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get only in-transit shipments.
     */
    public function scopeInTransit($query)
    {
        return $query->whereIn('status', ['picked_up', 'in_transit', 'out_for_delivery']);
    }

    /**
     * Scope to get only delivered shipments.
     */
    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    /**
     * Scope to filter by courier.
     */
    public function scopeByCourier($query, $courier)
    {
        return $query->where('courier', $courier);
    }

    /**
     * Scope to search by tracking number.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('tracking_number', 'like', "%{$search}%");
    }

    /**
     * Add tracking event to history.
     */
    public function addTrackingEvent(string $status, string $description, ?string $location = null): void
    {
        $history = $this->tracking_history ?? [];
        $history[] = [
            'status' => $status,
            'description' => $description,
            'location' => $location,
            'timestamp' => now()->toISOString(),
        ];
        $this->tracking_history = $history;
        $this->save();
    }

    /**
     * Mark shipment as picked up.
     */
    public function markAsPickedUp(): void
    {
        $this->status = 'picked_up';
        $this->picked_up_at = now();
        $this->addTrackingEvent('picked_up', 'Package picked up by courier');
        $this->save();
    }

    /**
     * Mark shipment as in transit.
     */
    public function markAsInTransit(?string $location = null): void
    {
        $this->status = 'in_transit';
        $this->addTrackingEvent('in_transit', 'Package is in transit', $location);
        $this->save();
    }

    /**
     * Mark shipment as out for delivery.
     */
    public function markAsOutForDelivery(): void
    {
        $this->status = 'out_for_delivery';
        $this->addTrackingEvent('out_for_delivery', 'Package is out for delivery');
        $this->save();
    }

    /**
     * Mark shipment as delivered.
     */
    public function markAsDelivered(): void
    {
        $this->status = 'delivered';
        $this->delivered_at = now();
        $this->addTrackingEvent('delivered', 'Package delivered successfully');
        $this->save();
    }

    /**
     * Mark shipment as failed.
     */
    public function markAsFailed(string $reason): void
    {
        $this->status = 'failed';
        $this->addTrackingEvent('failed', 'Delivery failed: ' . $reason);
        $this->save();
    }

    /**
     * Mark shipment as returned.
     */
    public function markAsReturned(string $reason): void
    {
        $this->status = 'returned';
        $this->addTrackingEvent('returned', 'Package returned: ' . $reason);
        $this->save();
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'picked_up' => 'bg-blue-100 text-blue-800',
            'in_transit' => 'bg-indigo-100 text-indigo-800',
            'out_for_delivery' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'failed' => 'bg-red-100 text-red-800',
            'returned' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
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
            'custom' => 'Custom',
            default => ucfirst($this->courier),
        };
    }

    /**
     * Sync with courier API to update tracking status.
     */
    public function syncWithCourier(): bool
    {
        if (!$this->shippingMethod) {
            return false;
        }

        $service = $this->shippingMethod->courier_service;
        if (!$service) {
            return false;
        }

        try {
            $trackingData = $service->trackShipment($this->tracking_number);
            
            if ($trackingData) {
                $this->status = $trackingData['status'] ?? $this->status;
                $this->tracking_history = $trackingData['history'] ?? $this->tracking_history;
                $this->save();
                return true;
            }
        } catch (\Exception $e) {
            // Log error but don't fail
        }

        return false;
    }
}
