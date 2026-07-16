<?php

namespace Database\Seeders;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class PurchaseItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchases = Purchase::pluck('id')->toArray();
        $productVariants = ProductVariant::pluck('id')->toArray();

        if (empty($purchases) || empty($productVariants)) {
            $this->command->warn('Purchases or product variants not found. Skipping purchase item seeding.');
            return;
        }

        // Add 3-8 items to each purchase
        foreach ($purchases as $purchaseId) {
            $itemCount = rand(3, 8);
            $selectedVariants = array_rand($productVariants, min($itemCount, count($productVariants)));
            
            if (!is_array($selectedVariants)) {
                $selectedVariants = [$selectedVariants];
            }

            foreach ($selectedVariants as $variantKey) {
                $variantId = $productVariants[$variantKey];
                $quantity = rand(5, 100);
                $unitCost = rand(20, 500) + (rand(0, 99) / 100);
                $subtotal = $quantity * $unitCost;

                PurchaseItem::create([
                    'purchase_id' => $purchaseId,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'subtotal' => $subtotal,
                ]);
            }

            $this->command->info("Created {$itemCount} items for purchase #{$purchaseId}");
        }

        $this->command->info('Successfully seeded purchase items.');
    }
}
