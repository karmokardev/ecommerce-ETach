<?php

namespace App\Services\Couriers;

use Illuminate\Support\Facades\Http;

class RedXService implements CourierServiceInterface
{
    protected array $settings;
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct(array $settings = [])
    {
        $this->settings = $settings;
        $this->baseUrl = $settings['base_url'] ?? 'https://api.redx.com.bd';
        $this->apiKey = $settings['api_key'] ?? config('services.redx.api_key');
    }

    /**
     * Create a shipment with RedX.
     */
    public function createShipment(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'API-Key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v1/parcel', [
                'customer_name' => $data['recipient_name'],
                'customer_phone' => $data['recipient_phone'],
                'customer_address' => $data['shipping_address'],
                'merchant_order_id' => $data['order_id'] ?? null,
                'area_id' => $data['area_id'] ?? null,
                'warehouse_id' => $this->settings['warehouse_id'] ?? null,
                'package_type' => $data['package_type'] ?? 'standard',
                'weight' => $data['weight'] ?? 0.5,
                'price' => $data['cod_amount'] ?? 0,
                'description' => $data['item_description'] ?? 'Package',
                'instruction' => $data['notes'] ?? null,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Track a shipment by tracking number.
     */
    public function trackShipment(string $trackingNumber): ?array
    {
        try {
            $response = Http::withHeaders([
                'API-Key' => $this->apiKey,
            ])->get($this->baseUrl . '/v1/parcel/track/' . $trackingNumber);

            if ($response->successful()) {
                $data = $response->json();
                
                return [
                    'status' => $this->mapStatus($data['status'] ?? 'pending'),
                    'history' => $this->formatTrackingHistory($data['tracking'] ?? []),
                ];
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Cancel a shipment.
     */
    public function cancelShipment(string $trackingNumber): bool
    {
        try {
            $response = Http::withHeaders([
                'API-Key' => $this->apiKey,
            ])->post($this->baseUrl . '/v1/parcel/cancel/' . $trackingNumber);

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get shipping rates for a destination.
     */
    public function getShippingRates(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'API-Key' => $this->apiKey,
            ])->post($this->baseUrl . '/v1/price-estimate', [
                'area_id' => $data['area_id'] ?? null,
                'weight' => $data['weight'] ?? 0.5,
                'package_type' => $data['package_type'] ?? 'standard',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Validate courier credentials/settings.
     */
    public function validateCredentials(): bool
    {
        return !empty($this->apiKey) && !empty($this->settings['warehouse_id']);
    }

    /**
     * Map RedX status to internal status.
     */
    protected function mapStatus(string $status): string
    {
        return match($status) {
            'pending' => 'pending',
            'picked_up' => 'picked_up',
            'in_transit' => 'in_transit',
            'out_for_delivery' => 'out_for_delivery',
            'delivered' => 'delivered',
            'cancelled' => 'cancelled',
            'returned' => 'returned',
            default => 'pending',
        };
    }

    /**
     * Format tracking history.
     */
    protected function formatTrackingHistory(array $tracking): array
    {
        return collect($tracking)->map(function ($item) {
            return [
                'status' => $this->mapStatus($item['status'] ?? 'pending'),
                'description' => $item['status'] ?? '',
                'location' => $item['location'] ?? null,
                'timestamp' => $item['timestamp'] ?? now()->toISOString(),
            ];
        })->toArray();
    }
}
