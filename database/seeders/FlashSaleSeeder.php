<?php

namespace Database\Seeders;

use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update or create Summer Flash Sale with 30% discount for 4 days 12 hours
        $summerFlashSale = FlashSale::updateOrCreate(
            ['slug' => 'summer-flash-sale'],
            [
                'name' => 'Summer Flash Sale',
                'description' => 'Massive discounts on summer collection',
                'discount_type' => 'percentage',
                'discount_value' => 30.00,
                'starts_at' => now()->subDays(2),
                'ends_at' => now()->addDays(4)->addHours(12),
                'is_active' => true,
                'priority' => 1,
            ]
        );

        // Add products to the active flash sale
        $products = Product::active()->take(3)->get();
        
        foreach ($products as $product) {
            $firstVariant = $product->variants->first();
            $originalPrice = $firstVariant ? $firstVariant->price : 249.99;
            
            // Calculate sale price based on flash sale discount (30%)
            $salePrice = $originalPrice * (1 - ($summerFlashSale->discount_value / 100));

            FlashSaleProduct::updateOrCreate(
                [
                    'flash_sale_id' => $summerFlashSale->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $firstVariant?->id,
                ],
                [
                    'original_price' => $originalPrice,
                    'sale_price' => $salePrice,
                    'stock_limit' => 50,
                    'sold_count' => rand(5, 20),
                ]
            );
        }

        $this->command->info('Flash sales seeded successfully!');
    }
}
