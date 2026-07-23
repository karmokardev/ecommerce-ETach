<?php

namespace App\Services\Couriers;

use Illuminate\Support\Facades\Http;

class PathaoService implements CourierServiceInterface
{
    protected array $settings;
    protected string $baseUrl;
    protected string $accessToken;

    public function __construct(array $settings = [])
    {
        $this->settings = $settings;
        $this->baseUrl = $settings['base_url'] ?? 'https://api-hermes.pathao.com';
        $this->accessToken = $settings['access_token'] ?? config('services.pathao.access_token');
    }

    /**
     * Create a shipment with Pathao.
     */
    public function createShipment(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v1/orders', [
                'store_id' => $this->settings['store_id'] ?? null,
                'merchant_order_id' => $data['order_id'] ?? null,
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'recipient_address' => $data['shipping_address'],
                'recipient_city' => $data['city'] ?? 'Dhaka',
                'recipient_zone' => $data['zone'] ?? null,
                'recipient_area' => $data['area'] ?? null,
                'delivery_type' => $data['delivery_type'] ?? '48',
                'item_type' => $data['item_type'] ?? 'parcel',
                'special_instruction' => $data['notes'] ?? null,
                'item_quantity' => $data['item_quantity'] ?? 1,
                'item_weight' => $data['weight'] ?? 0.5,
                'amount_to_collect' => $data['cod_amount'] ?? 0,
                'item_description' => $data['item_description'] ?? 'Package',
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
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->get($this->baseUrl . '/v1/orders/track/' . $trackingNumber);

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
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->post($this->baseUrl . '/v1/orders/cancel/' . $trackingNumber);

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
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->post($this->baseUrl . '/v1/price-estimate', [
                'store_id' => $this->settings['store_id'] ?? null,
                'item_type' => $data['item_type'] ?? 'parcel',
                'delivery_type' => $data['delivery_type'] ?? '48',
                'item_weight' => $data['weight'] ?? 0.5,
                'recipient_city' => $data['city'] ?? 'Dhaka',
                'recipient_zone' => $data['zone'] ?? null,
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
        return !empty($this->accessToken) && !empty($this->settings['store_id']);
    }

    /**
     * Map Pathao status to internal status.
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
