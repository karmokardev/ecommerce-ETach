<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'SUMMER2024',
                'type' => 'percentage',
                'value' => 20.00,
                'minimum_order_amount' => 100.00,
                'maximum_discount_amount' => 50.00,
                'usage_limit' => 1000,
                'used_count' => 150,
                'per_user_limit' => 5,
                'starts_at' => now()->subDays(10),
                'expires_at' => now()->addDays(20),
                'is_active' => true,
                'description' => 'Summer sale discount - 20% off on orders above $100',
            ],
            [
                'code' => 'FLASH50',
                'type' => 'fixed',
                'value' => 50.00,
                'minimum_order_amount' => 200.00,
                'maximum_discount_amount' => null,
                'usage_limit' => 500,
                'used_count' => 75,
                'per_user_limit' => 2,
                'starts_at' => now()->subDays(5),
                'expires_at' => now()->addDays(10),
                'is_active' => true,
                'description' => 'Flash sale - $50 off on orders above $200',
            ],
            [
                'code' => 'WELCOME10',
                'type' => 'percentage',
                'value' => 10.00,
                'minimum_order_amount' => 50.00,
                'maximum_discount_amount' => 25.00,
                'usage_limit' => null,
                'used_count' => 320,
                'per_user_limit' => 1,
                'starts_at' => now()->subDays(30),
                'expires_at' => null,
                'is_active' => true,
                'description' => 'Welcome discount for new customers',
            ],
            [
                'code' => 'EXPIRED20',
                'type' => 'percentage',
                'value' => 20.00,
                'minimum_order_amount' => 100.00,
                'maximum_discount_amount' => null,
                'usage_limit' => 200,
                'used_count' => 200,
                'per_user_limit' => 3,
                'starts_at' => now()->subDays(60),
                'expires_at' => now()->subDays(1),
                'is_active' => false,
                'description' => 'Expired coupon - 20% discount',
            ],
            [
                'code' => 'FUTURE25',
                'type' => 'percentage',
                'value' => 25.00,
                'minimum_order_amount' => 150.00,
                'maximum_discount_amount' => 75.00,
                'usage_limit' => 300,
                'used_count' => 0,
                'per_user_limit' => 4,
                'starts_at' => now()->addDays(5),
                'expires_at' => now()->addDays(35),
                'is_active' => true,
                'description' => 'Upcoming holiday sale - 25% off',
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }

        $this->command->info('Coupons seeded successfully!');
    }
}
