<?php

namespace Database\Seeders;

use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class StockTransferItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stockTransfers = StockTransfer::pluck('id')->toArray();
        $productVariants = ProductVariant::pluck('id')->toArray();

        if (empty($stockTransfers) || empty($productVariants)) {
            $this->command->warn('Stock transfers or product variants not found. Skipping stock transfer item seeding.');
            return;
        }

        // Add 2-5 items to each stock transfer
        foreach ($stockTransfers as $transferId) {
            $itemCount = rand(2, 5);
            $selectedVariants = array_rand($productVariants, min($itemCount, count($productVariants)));
            
            if (!is_array($selectedVariants)) {
                $selectedVariants = [$selectedVariants];
            }

            foreach ($selectedVariants as $variantKey) {
                $variantId = $productVariants[$variantKey];
                $quantity = rand(5, 50);

                StockTransferItem::create([
                    'stock_transfer_id' => $transferId,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                ]);
            }

            $this->command->info("Created {$itemCount} items for stock transfer #{$transferId}");
        }

        $this->command->info('Successfully seeded stock transfer items.');
    }
}
