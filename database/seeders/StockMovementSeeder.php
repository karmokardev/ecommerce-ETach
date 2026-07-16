<?php

namespace Database\Seeders;

use App\Models\StockMovement;
use App\Models\Warehouse;
use App\Models\ProductVariant;
use App\Models\Purchase;
use App\Models\StockAdjustment;
use App\Models\StockTransfer;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = Warehouse::where('status', 'active')->pluck('id')->toArray();
        $productVariants = ProductVariant::pluck('id')->toArray();
        $purchases = Purchase::where('status', 'completed')->pluck('id')->toArray();
        $stockAdjustments = StockAdjustment::pluck('id')->toArray();
        $stockTransfers = StockTransfer::pluck('id')->toArray();

        if (empty($warehouses) || empty($productVariants)) {
            $this->command->warn('Warehouses or product variants not found. Skipping stock movement seeding.');
            return;
        }

        $movementTypes = ['PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT'];
        $remarks = [
            'Initial stock entry',
            'Regular inventory update',
            'Batch processing',
            'Manual adjustment',
            'System update',
            'Quality check',
            'Restock',
        ];

        // Create 50 stock movements
        for ($i = 1; $i <= 50; $i++) {
            $warehouse = $warehouses[array_rand($warehouses)];
            $variant = $productVariants[array_rand($productVariants)];
            $type = $movementTypes[array_rand($movementTypes)];
            $quantity = rand(1, 100);
            $beforeStock = rand(0, 200);
            $afterStock = $beforeStock + $quantity;
            
            // Set reference based on type
            $referenceType = null;
            $referenceId = null;
            
            switch ($type) {
                case 'PURCHASE':
                    if (!empty($purchases)) {
                        $referenceType = 'Purchase';
                        $referenceId = $purchases[array_rand($purchases)];
                    }
                    break;
                case 'ADJUSTMENT':
                    if (!empty($stockAdjustments)) {
                        $referenceType = 'StockAdjustment';
                        $referenceId = $stockAdjustments[array_rand($stockAdjustments)];
                        $afterStock = $beforeStock + ($quantity * (rand(0, 1) ? 1 : -1));
                    }
                    break;
                case 'TRANSFER_IN':
                case 'TRANSFER_OUT':
                    if (!empty($stockTransfers)) {
                        $referenceType = 'StockTransfer';
                        $referenceId = $stockTransfers[array_rand($stockTransfers)];
                    }
                    break;
            }

            StockMovement::create([
                'warehouse_id' => $warehouse,
                'product_variant_id' => $variant,
                'type' => $type,
                'quantity' => $quantity,
                'before_stock' => $beforeStock,
                'after_stock' => $afterStock,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'remarks' => $remarks[array_rand($remarks)],
            ]);

            $this->command->info("Created stock movement #{$i}: {$type} of {$quantity} units");
        }

        $this->command->info('Successfully seeded 50 stock movements.');
    }
}
