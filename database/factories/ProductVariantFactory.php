<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => 'SKU-' . fake()->unique()->numerify('######'),
            'barcode' => fake()->unique()->numerify('############'),
            'price' => fake()->randomFloat(2, 10, 1000),
            'compare_price' => fake()->optional()->randomFloat(2, 100, 2000),
            'cost_price' => fake()->randomFloat(2, 5, 500),
            'weight' => fake()->randomFloat(2, 0.1, 10),
            'dimensions' => null,
            'current_stock' => fake()->numberBetween(0, 100),
            'low_stock_alert' => 5,
            'status' => 'active',
        ];
    }
}
