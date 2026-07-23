<?php

namespace App\Services\Couriers;

use Illuminate\Support\Facades\Http;

class SteadfastService implements CourierServiceInterface
{
    protected array $settings;
    protected string $baseUrl;
    protected string $apiKey;
    protected string $secretKey;

    public function __construct(array $settings = [])
    {
        $this->settings = $settings;
        $this->baseUrl = $settings['base_url'] ?? 'https://portal.steadfast.com.bd/api/v1';
        $this->apiKey = $settings['api_key'] ?? config('services.steadfast.api_key');
        $this->secretKey = $settings['secret_key'] ?? config('services.steadfast.secret_key');
    }

    /**
     * Create a shipment with Steadfast.
     */
    public function createShipment(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'Api-Key' => $this->apiKey,
                'Secret-Key' => $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/create-order', [
                'invoice' => $data['order_id'] ?? null,
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'recipient_address' => $data['shipping_address'],
                'cod_amount' => $data['cod_amount'] ?? 0,
                'note' => $data['notes'] ?? null,
                'package_details' => $data['item_description'] ?? 'Package',
                'weight' => $data['weight'] ?? 0.5,
                'hub_id' => $this->settings['hub_id'] ?? null,
                'delivery_type' => $data['delivery_type'] ?? 'regular',
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
                'Api-Key' => $this->apiKey,
                'Secret-Key' => $this->secretKey,
            ])->get($this->baseUrl . '/track-order/' . $trackingNumber);

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
                'Api-Key' => $this->apiKey,
                'Secret-Key' => $this->secretKey,
            ])->post($this->baseUrl . '/cancel-order/' . $trackingNumber);

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
                'Api-Key' => $this->apiKey,
                'Secret-Key' => $this->secretKey,
            ])->post($this->baseUrl . '/price-estimate', [
                'weight' => $data['weight'] ?? 0.5,
                'delivery_type' => $data['delivery_type'] ?? 'regular',
                'hub_id' => $this->settings['hub_id'] ?? null,
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
        return !empty($this->apiKey) && !empty($this->secretKey);
    }

    /**
     * Map Steadfast status to internal status.
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
