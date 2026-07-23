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
 * @property string $code
 * @property array $districts
 * @property array|null $areas
 * @property float $base_rate
 * @property float $additional_rate
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Shipment> $shipments
 */
#[Fillable([
    'name',
    'code',
    'districts',
    'areas',
    'base_rate',
    'additional_rate',
    'is_active',
])]
class ShippingZone extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'districts' => 'array',
            'areas' => 'array',
            'base_rate' => 'decimal:2',
            'additional_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the orders for the shipping zone.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the shipments for the shipping zone.
     */
    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    /**
     * Scope to get only active zones.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to find zone by district.
     */
    public function scopeByDistrict($query, string $district)
    {
        return $query->whereJsonContains('districts', $district);
    }

    /**
     * Scope to find zone by area.
     */
    public function scopeByArea($query, string $area)
    {
        return $query->whereJsonContains('areas', $area);
    }

    /**
     * Check if zone covers a specific district.
     */
    public function coversDistrict(string $district): bool
    {
        return in_array($district, $this->districts ?? []);
    }

    /**
     * Check if zone covers a specific area.
     */
    public function coversArea(string $area): bool
    {
        return in_array($area, $this->areas ?? []);
    }

    /**
     * Calculate shipping rate for this zone.
     */
    public function calculateRate(float $baseCost = 0): float
    {
        return $this->base_rate + $this->additional_rate + $baseCost;
    }

    /**
     * Get zone display name with districts count.
     */
    public function getDisplayNameAttribute(): string
    {
        $districtCount = count($this->districts ?? []);
        return "{$this->name} ({$districtCount} districts)";
    }
}
