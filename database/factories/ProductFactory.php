<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'brand_id' => null,
            'name' => fake()->words(3, true),
            'slug' => null,
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'thumbnail' => null,
            'status' => 'active',
            'is_featured' => false,
            'free_delivery' => false,
        ];
    }
}
