<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::pluck('id', 'id')->toArray();
        $products = Product::where('status', 'active')->pluck('id', 'id')->toArray();
        $productVariants = ProductVariant::pluck('id', 'id')->toArray();

        if (empty($orders) || empty($products)) {
            $this->command->warn('Orders or products not found. Skipping order item seeding.');
            return;
        }

        // Add 1-5 items to each order
        foreach ($orders as $orderId) {
            $itemCount = rand(1, 5);
            
            for ($i = 0; $i < $itemCount; $i++) {
                $productId = $products[array_rand($products)];
                $product = Product::find($productId);
                
                // Try to get a variant, otherwise use null
                $variantId = null;
                $sku = null;
                $attributes = null;
                
                if (!empty($productVariants)) {
                    $variant = ProductVariant::where('product_id', $productId)->inRandomOrder()->first();
                    if ($variant) {
                        $variantId = $variant->id;
                        $sku = $variant->sku;
                        $attributes = $variant->attributes;
                    }
                }

                $quantity = rand(1, 5);
                $unitPrice = !empty($variant) ? $variant->price : rand(20, 200) + (rand(0, 99) / 100);
                $subtotal = $quantity * $unitPrice;

                OrderItem::create([
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'product_variant_id' => $variantId,
                    'product_name' => $product->name,
                    'product_sku' => $sku,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'product_attributes' => $attributes,
                ]);
            }

            $this->command->info("Created {$itemCount} items for order #{$orderId}");
        }

        $this->command->info('Successfully seeded order items.');
    }
}
