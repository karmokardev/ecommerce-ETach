<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and products
        $users = User::all();
        $products = Product::active()->with('variants')->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found. Skipping cart seeding.');
            return;
        }

        // Create carts for 70% of users
        $usersWithCarts = $users->random((int)($users->count() * 0.7));

        foreach ($usersWithCarts as $user) {
            // Create cart for user
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'subtotal' => 0,
                    'discount' => 0,
                    'tax' => 0,
                    'total' => 0,
                ]
            );

            // Add 1-5 random products to cart
            $itemCount = rand(1, 5);
            $selectedProducts = $products->random(min($itemCount, $products->count()));

            foreach ($selectedProducts as $product) {
                // 70% chance to include a variant if product has variants
                $variant = null;
                if ($product->variants->isNotEmpty() && rand(1, 10) <= 7) {
                    $variant = $product->variants->random();
                }

                // Get price
                $price = $variant ? $variant->price : ($product->getMinPriceAttribute() ?? 0);
                $quantity = rand(1, 3);
                $subtotal = $price * $quantity;

                // Create cart item
                CartItem::firstOrCreate(
                    [
                        'cart_id' => $cart->id,
                        'product_id' => $product->id,
                        'product_variant_id' => $variant ? $variant->id : null,
                    ],
                    [
                        'quantity' => $quantity,
                        'subtotal' => $subtotal,
                    ]
                );
            }

            // Update cart totals
            $cart->updateTotals();

            $this->command->info("Created cart for user: {$user->name} with {$cart->items->count()} items");
        }

        // Create some guest carts (session-based)
        $guestCartCount = rand(3, 8);
        for ($i = 0; $i < $guestCartCount; $i++) {
            $sessionId = Str::random(40);
            
            $cart = Cart::create([
                'session_id' => $sessionId,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
            ]);

            // Add 1-3 random products to guest cart
            $itemCount = rand(1, 3);
            $selectedProducts = $products->random(min($itemCount, $products->count()));

            foreach ($selectedProducts as $product) {
                // 60% chance to include a variant if product has variants
                $variant = null;
                if ($product->variants->isNotEmpty() && rand(1, 10) <= 6) {
                    $variant = $product->variants->random();
                }

                // Get price
                $price = $variant ? $variant->price : ($product->getMinPriceAttribute() ?? 0);
                $quantity = rand(1, 2);
                $subtotal = $price * $quantity;

                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variant ? $variant->id : null,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);
            }

            // Update cart totals
            $cart->updateTotals();

            $this->command->info("Created guest cart with {$cart->items->count()} items");
        }

        // Create some empty carts
        $emptyCartCount = rand(2, 5);
        for ($i = 0; $i < $emptyCartCount; $i++) {
            $sessionId = Str::random(40);
            
            Cart::create([
                'session_id' => $sessionId,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
            ]);
        }

        $this->command->info("Created {$emptyCartCount} empty carts");
        $this->command->info('Cart seeding completed successfully.');
    }
}
