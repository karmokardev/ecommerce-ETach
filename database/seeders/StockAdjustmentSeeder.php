<?php

namespace Database\Seeders;

use App\Models\StockAdjustment;
use App\Models\Warehouse;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StockAdjustmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = Warehouse::where('status', 'active')->pluck('id')->toArray();
        $productVariants = ProductVariant::pluck('id')->toArray();

        if (empty($warehouses) || empty($productVariants)) {
            $this->command->warn('Warehouses or product variants not found. Skipping stock adjustment seeding.');
            return;
        }

        $reasons = [
            'Damaged goods',
            'Lost items',
            'Found items',
            'Quality control failure',
            'Theft',
            'Counting error correction',
            'Expired items',
            'Return from customer',
            'Sample usage',
            'Promotional giveaway',
        ];

        // Create 20 stock adjustments
        for ($i = 1; $i <= 20; $i++) {
            $warehouse = $warehouses[array_rand($warehouses)];
            $variant = $productVariants[array_rand($productVariants)];
            $adjustmentType = rand(0, 1) ? 'increase' : 'decrease';
            $quantity = rand(1, 50);
            $reason = $reasons[array_rand($reasons)];
            
            // Calculate before and after stock
            $beforeStock = rand(0, 200);
            $afterStock = $adjustmentType === 'increase' 
                ? $beforeStock + $quantity 
                : max(0, $beforeStock - $quantity);

            StockAdjustment::create([
                'warehouse_id' => $warehouse,
                'product_variant_id' => $variant,
                'adjustment_type' => $adjustmentType,
                'quantity' => $quantity,
                'before_stock' => $beforeStock,
                'after_stock' => $afterStock,
                'reason' => $reason,
                'notes' => 'Stock adjustment #' . $i . ' - ' . $reason,
            ]);

            $this->command->info("Created stock adjustment #{$i}: {$adjustmentType} of {$quantity} units (Before: {$beforeStock}, After: {$afterStock})");
        }

        $this->command->info('Successfully seeded 20 stock adjustments.');
    }
}
