<?php

namespace App\Services\Couriers;

interface CourierServiceInterface
{
    /**
     * Create a shipment with the courier.
     */
    public function createShipment(array $data): ?array;

    /**
     * Track a shipment by tracking number.
     */
    public function trackShipment(string $trackingNumber): ?array;

    /**
     * Cancel a shipment.
     */
    public function cancelShipment(string $trackingNumber): bool;

    /**
     * Get shipping rates for a destination.
     */
    public function getShippingRates(array $data): ?array;

    /**
     * Validate courier credentials/settings.
     */
    public function validateCredentials(): bool;
}
