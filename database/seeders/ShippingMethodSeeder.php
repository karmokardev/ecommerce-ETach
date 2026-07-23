<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'Pathao Express',
                'slug' => 'pathao-express',
                'description' => 'Fast delivery via Pathao courier service',
                'courier' => 'pathao',
                'base_cost' => 60.00,
                'cost_per_weight' => 10.00,
                'cost_per_item' => 5.00,
                'min_order_amount' => 0,
                'max_order_amount' => null,
                'estimated_delivery_days' => 2,
                'is_active' => true,
                'sort_order' => 1,
                'settings' => [
                    'store_id' => env('PATHAO_STORE_ID', ''),
                    'access_token' => env('PATHAO_ACCESS_TOKEN', ''),
                ],
            ],
            [
                'name' => 'RedX Standard',
                'slug' => 'redx-standard',
                'description' => 'Standard delivery via RedX courier service',
                'courier' => 'redx',
                'base_cost' => 50.00,
                'cost_per_weight' => 8.00,
                'cost_per_item' => 4.00,
                'min_order_amount' => 0,
                'max_order_amount' => null,
                'estimated_delivery_days' => 3,
                'is_active' => true,
                'sort_order' => 2,
                'settings' => [
                    'api_key' => env('REDX_API_KEY', ''),
                    'warehouse_id' => env('REDX_WAREHOUSE_ID', ''),
                ],
            ],
            [
                'name' => 'Steadfast Delivery',
                'slug' => 'steadfast-delivery',
                'description' => 'Reliable delivery via Steadfast courier service',
                'courier' => 'steadfast',
                'base_cost' => 55.00,
                'cost_per_weight' => 9.00,
                'cost_per_item' => 4.50,
                'min_order_amount' => 0,
                'max_order_amount' => null,
                'estimated_delivery_days' => 3,
                'is_active' => true,
                'sort_order' => 3,
                'settings' => [
                    'api_key' => env('STEADFAST_API_KEY', ''),
                    'secret_key' => env('STEADFAST_SECRET_KEY', ''),
                    'hub_id' => env('STEADFAST_HUB_ID', ''),
                ],
            ],
            [
                'name' => 'Sundarban Express',
                'slug' => 'sundarban-express',
                'description' => 'Fast delivery via Sundarban courier service',
                'courier' => 'sundarban',
                'base_cost' => 65.00,
                'cost_per_weight' => 11.00,
                'cost_per_item' => 5.50,
                'min_order_amount' => 0,
                'max_order_amount' => null,
                'estimated_delivery_days' => 3,
                'is_active' => true,
                'sort_order' => 4,
                'settings' => [
                    'api_key' => env('SUNDARBAN_API_KEY', ''),
                ],
            ],
            [
                'name' => 'Custom Delivery',
                'slug' => 'custom-delivery',
                'description' => 'Manual/custom delivery arrangement',
                'courier' => 'custom',
                'base_cost' => 40.00,
                'cost_per_weight' => 5.00,
                'cost_per_item' => 3.00,
                'min_order_amount' => 0,
                'max_order_amount' => null,
                'estimated_delivery_days' => 5,
                'is_active' => true,
                'sort_order' => 5,
                'settings' => null,
            ],
            [
                'name' => 'Free Shipping',
                'slug' => 'free-shipping',
                'description' => 'Free shipping for orders above minimum amount',
                'courier' => 'custom',
                'base_cost' => 0.00,
                'cost_per_weight' => 0.00,
                'cost_per_item' => 0.00,
                'min_order_amount' => 1000.00,
                'max_order_amount' => null,
                'estimated_delivery_days' => 5,
                'is_active' => true,
                'sort_order' => 6,
                'settings' => null,
            ],
        ];

        foreach ($methods as $method) {
            ShippingMethod::updateOrCreate(
                ['slug' => $method['slug']],
                $method
            );
        }
    }
}
