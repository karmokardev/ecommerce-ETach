<?php

namespace Database\Seeders;

use App\Models\FlashSale;
use Illuminate\Database\Seeder;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flashSales = [
            [
                'name' => 'Summer Flash Sale',
                'slug' => 'summer-flash-sale',
                'description' => 'Massive discounts on summer collection',
                'discount_type' => 'percentage',
                'discount_value' => 30.00,
                'starts_at' => now()->subDays(2),
                'ends_at' => now()->addDays(5),
                'is_active' => true,
                'priority' => 1,
            ],
            [
                'name' => 'Weekend Special',
                'slug' => 'weekend-special',
                'description' => 'Special weekend deals',
                'discount_type' => 'fixed',
                'discount_value' => 25.00,
                'starts_at' => now()->addDays(3),
                'ends_at' => now()->addDays(5),
                'is_active' => true,
                'priority' => 2,
            ],
            [
                'name' => 'Black Friday Preview',
                'slug' => 'black-friday-preview',
                'description' => 'Early Black Friday deals',
                'discount_type' => 'percentage',
                'discount_value' => 40.00,
                'starts_at' => now()->addDays(10),
                'ends_at' => now()->addDays(15),
                'is_active' => true,
                'priority' => 3,
            ],
            [
                'name' => 'Expired Flash Sale',
                'slug' => 'expired-flash-sale',
                'description' => 'This sale has ended',
                'discount_type' => 'percentage',
                'discount_value' => 25.00,
                'starts_at' => now()->subDays(10),
                'ends_at' => now()->subDays(1),
                'is_active' => false,
                'priority' => 0,
            ],
        ];

        foreach ($flashSales as $flashSale) {
            FlashSale::create($flashSale);
        }

        $this->command->info('Flash sales seeded successfully!');
    }
}
