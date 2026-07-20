<?php

namespace App\Services;

use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Increase stock for a variant.
     */
    public function increaseStock(
        ProductVariant $variant,
        int $quantity,
        Warehouse $warehouse,
        string $type,
        ?Model $reference = null,
        ?string $remarks = null
    ): StockMovement {
        return $this->recordStockMovement($variant, $quantity, $warehouse, $type, $reference, $remarks);
    }

    /**
     * Decrease stock for a variant.
     */
    public function decreaseStock(
        ProductVariant $variant,
        int $quantity,
        Warehouse $warehouse,
        string $type,
        ?Model $reference = null,
        ?string $remarks = null
    ): StockMovement {
        return $this->recordStockMovement($variant, -$quantity, $warehouse, $type, $reference, $remarks);
    }

    /**
     * Record a stock movement with transaction safety.
     */
    protected function recordStockMovement(
        ProductVariant $variant,
        int $quantity,
        Warehouse $warehouse,
        string $type,
        ?Model $reference = null,
        ?string $remarks = null
    ): StockMovement {
        return DB::transaction(function () use ($variant, $quantity, $warehouse, $type, $reference, $remarks) {
            $beforeStock = $variant->current_stock;
            $afterStock = $beforeStock + $quantity;

            // Prevent negative stock
            if ($afterStock < 0) {
                throw new Exception('Insufficient stock. Cannot go below zero.');
            }

            // Update variant stock
            $variant->update(['current_stock' => $afterStock]);

            // Create stock movement record
            $movement = StockMovement::create([
                'warehouse_id' => $warehouse->id,
                'product_variant_id' => $variant->id,
                'type' => $type,
                'quantity' => $quantity,
                'before_stock' => $beforeStock,
                'after_stock' => $afterStock,
                'reference_type' => $reference ? get_class($reference) : null,
                'reference_id' => $reference?->id,
                'remarks' => $remarks,
            ]);

            return $movement;
        });
    }

    /**
     * Process a purchase - increase stock for all items.
     */
    public function processPurchase($purchase): void
    {
        DB::transaction(function () use ($purchase) {
            foreach ($purchase->items as $item) {
                $this->increaseStock(
                    $item->variant,
                    $item->quantity,
                    $purchase->warehouse,
                    'PURCHASE',
                    $purchase,
                    "Purchase #{$purchase->invoice_no}"
                );
            }
        });
    }

    /**
     * Process a sale - decrease stock for variants.
     */
    public function processSale(
        ProductVariant $variant,
        int $quantity,
        Warehouse $warehouse,
        ?Model $order = null
    ): StockMovement {
        return $this->decreaseStock(
            $variant,
            $quantity,
            $warehouse,
            'SALE',
            $order,
            $order ? "Order #{$order->id}" : 'Sale'
        );
    }

    /**
     * Process a return - increase stock.
     */
    public function processReturn(
        ProductVariant $variant,
        int $quantity,
        Warehouse $warehouse,
        ?Model $order = null
    ): StockMovement {
        return $this->increaseStock(
            $variant,
            $quantity,
            $warehouse,
            'RETURN',
            $order,
            $order ? "Return for Order #{$order->id}" : 'Return'
        );
    }

    /**
     * Process a stock adjustment.
     */
    public function processAdjustment(
        ProductVariant $variant,
        int $quantity,
        string $adjustmentType,
        Warehouse $warehouse,
        ?string $reason = null,
        ?string $notes = null
    ): StockMovement {
        $actualQuantity = $adjustmentType === 'increase' ? $quantity : -$quantity;
        
        return $this->recordStockMovement(
            $variant,
            $actualQuantity,
            $warehouse,
            'ADJUSTMENT',
            null,
            $reason ? "{$reason}: {$notes}" : $notes
        );
    }

    /**
     * Process a stock transfer between warehouses.
     */
    public function processTransfer($transfer): void
    {
        DB::transaction(function () use ($transfer) {
            foreach ($transfer->items as $item) {
                // Decrease from source warehouse
                $this->decreaseStock(
                    $item->variant,
                    $item->quantity,
                    $transfer->fromWarehouse,
                    'TRANSFER_OUT',
                    $transfer,
                    "Transfer #{$transfer->id} to {$transfer->toWarehouse->name}"
                );

                // Increase to destination warehouse
                $this->increaseStock(
                    $item->variant,
                    $item->quantity,
                    $transfer->toWarehouse,
                    'TRANSFER_IN',
                    $transfer,
                    "Transfer #{$transfer->id} from {$transfer->fromWarehouse->name}"
                );
            }
        });
    }

    /**
     * Get low stock variants.
     */
    public function getLowStockVariants(?int $threshold = null): \Illuminate\Database\Eloquent\Collection
    {
        $threshold = $threshold ?? config('inventory.low_stock_threshold', 5);
        
        return ProductVariant::with(['product', 'product.category'])
            ->where('current_stock', '<=', $threshold)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Get out of stock variants.
     */
    public function getOutOfStockVariants(): \Illuminate\Database\Eloquent\Collection
    {
        return ProductVariant::with(['product', 'product.category'])
            ->where('current_stock', '<=', 0)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Get stock movements for a variant.
     */
    public function getVariantMovements(ProductVariant $variant, ?int $limit = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = StockMovement::with(['warehouse'])
            ->where('product_variant_id', $variant->id)
            ->ordered();

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }
}
