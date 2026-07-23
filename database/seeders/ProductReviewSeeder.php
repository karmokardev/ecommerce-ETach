<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users and products for relationships
        $users = User::take(5)->get();
        $products = Product::take(10)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found. Skipping review seeding.');
            return;
        }

        $reviews = [
            [
                'rating' => 5,
                'title' => 'Excellent product!',
                'review' => 'Absolutely love this product. Great quality and fast delivery. Will definitely buy again!',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 12,
            ],
            [
                'rating' => 4,
                'title' => 'Good value for money',
                'review' => 'Product is good quality for the price. Minor issues with packaging but overall satisfied.',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 8,
            ],
            [
                'rating' => 5,
                'title' => 'Highly recommended',
                'review' => 'Best purchase I\'ve made this year. The quality exceeded my expectations.',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 15,
            ],
            [
                'rating' => 3,
                'title' => 'Average product',
                'review' => 'It\'s okay for the price. Not amazing but does the job.',
                'is_approved' => true,
                'is_verified_purchase' => false,
                'helpful_count' => 3,
            ],
            [
                'rating' => 2,
                'title' => 'Disappointed',
                'review' => 'Expected better quality. The material feels cheap and it doesn\'t look like the pictures.',
                'is_approved' => false,
                'is_verified_purchase' => true,
                'helpful_count' => 1,
            ],
            [
                'rating' => 5,
                'title' => 'Perfect!',
                'review' => 'Exactly what I was looking for. Fast shipping and great customer service.',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 20,
            ],
            [
                'rating' => 4,
                'title' => 'Very good',
                'review' => 'Nice product, good quality. Would recommend to others.',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 6,
            ],
            [
                'rating' => 1,
                'title' => 'Not worth it',
                'review' => 'Poor quality, broke after first use. Very disappointed.',
                'is_approved' => false,
                'is_verified_purchase' => true,
                'helpful_count' => 0,
            ],
            [
                'rating' => 5,
                'title' => 'Amazing quality',
                'review' => 'The quality is outstanding. Worth every penny!',
                'is_approved' => true,
                'is_verified_purchase' => true,
                'helpful_count' => 18,
            ],
            [
                'rating' => 4,
                'title' => 'Good purchase',
                'review' => 'Happy with my purchase. Good value for money.',
                'is_approved' => true,
                'is_verified_purchase' => false,
                'helpful_count' => 5,
            ],
        ];

        foreach ($reviews as $index => $reviewData) {
            $user = $users->random();
            $product = $products->random();

            ProductReview::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'order_id' => null,
                'rating' => $reviewData['rating'],
                'title' => $reviewData['title'],
                'review' => $reviewData['review'],
                'is_approved' => $reviewData['is_approved'],
                'is_verified_purchase' => $reviewData['is_verified_purchase'],
                'helpful_count' => $reviewData['helpful_count'],
            ]);
        }

        $this->command->info('Product reviews seeded successfully!');
    }
}
