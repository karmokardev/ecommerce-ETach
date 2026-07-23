<?php

namespace App\Services\Couriers;

use Illuminate\Support\Facades\Http;

class SundarbanService implements CourierServiceInterface
{
    protected array $settings;
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(array $settings = [])
    {
        $this->settings = $settings;
        $this->apiKey = $settings['api_key'] ?? config('couriers.sundarban.api_key', '');
        $this->baseUrl = $settings['base_url'] ?? config('couriers.sundarban.base_url', 'https://api.sundarbancourier.com/v1');
    }

    /**
     * Create a shipment with Sundarban courier.
     */
    public function createShipment(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/shipments', [
                'order_id' => $data['order_id'] ?? null,
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'shipping_address' => $data['shipping_address'],
                'pickup_address' => $data['pickup_address'] ?? null,
                'weight' => $data['weight'] ?? 1,
                'cod_amount' => $data['cod_amount'] ?? 0,
                'item_description' => $data['item_description'] ?? 'Package',
                'package_type' => $data['package_type'] ?? 'standard',
            ]);

            if ($response->successful()) {
                return [
                    'tracking_number' => $response->json('tracking_number'),
                    'tracking_url' => $response->json('tracking_url'),
                    'courier_response' => $response->json(),
                ];
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Track a shipment with Sundarban courier.
     */
    public function trackShipment(string $trackingNumber): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/shipments/' . $trackingNumber . '/track');

            if ($response->successful()) {
                $data = $response->json();
                
                // Map Sundarban status to our system status
                $statusMap = [
                    'pending' => 'pending',
                    'picked_up' => 'picked_up',
                    'in_transit' => 'in_transit',
                    'out_for_delivery' => 'out_for_delivery',
                    'delivered' => 'delivered',
                    'failed' => 'failed',
                    'returned' => 'returned',
                ];

                $status = $statusMap[$data['status']] ?? 'pending';

                return [
                    'status' => $status,
                    'current_location' => $data['current_location'] ?? null,
                    'estimated_delivery' => $data['estimated_delivery'] ?? null,
                    'tracking_history' => $this->formatTrackingHistory($data['history'] ?? []),
                    'courier_response' => $data,
                ];
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Cancel a shipment with Sundarban courier.
     */
    public function cancelShipment(string $trackingNumber): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post($this->baseUrl . '/shipments/' . $trackingNumber . '/cancel');

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get shipping rates from Sundarban courier.
     */
    public function getRates(array $data): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/rates', [
                'destination' => $data['destination'],
                'weight' => $data['weight'] ?? 1,
                'cod_amount' => $data['cod_amount'] ?? 0,
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
     * Validate Sundarban API credentials.
     */
    public function validateCredentials(): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/validate');

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Format tracking history from Sundarban format.
     */
    protected function formatTrackingHistory(array $history): array
    {
        return array_map(function ($event) {
            return [
                'status' => $event['status'] ?? 'unknown',
                'description' => $event['description'] ?? 'Status update',
                'location' => $event['location'] ?? null,
                'timestamp' => $event['timestamp'] ?? now()->toIso8601String(),
            ];
        }, $history);
    }
}
