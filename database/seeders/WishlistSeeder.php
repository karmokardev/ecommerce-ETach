<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
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
            $this->command->warn('No users or products found. Skipping wishlist seeding.');
            return;
        }

        // Create wishlist items for each user
        foreach ($users as $user) {
            // Add 3-8 random products to each user's wishlist
            $wishlistCount = rand(3, 8);
            $selectedProducts = $products->random(min($wishlistCount, $products->count()));

            foreach ($selectedProducts as $product) {
                // 60% chance to include a variant if product has variants
                $variant = null;
                if ($product->variants->isNotEmpty() && rand(1, 10) <= 6) {
                    $variant = $product->variants->random();
                }

                Wishlist::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'product_variant_id' => $variant ? $variant->id : null,
                    ]
                );
            }

            $this->command->info("Created wishlist for user: {$user->name}");
        }

        $this->command->info('Wishlist seeding completed successfully.');
    }
}
