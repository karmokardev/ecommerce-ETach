<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wishlist>
 */
class WishlistFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Wishlist::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'product_id' => 1, // Will be overridden in tests
            'product_variant_id' => null,
        ];
    }

    /**
     * Indicate that the wishlist has a variant.
     */
    public function withVariant(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_variant_id' => ProductVariant::inRandomOrder()->first()->id ?? ProductVariant::factory()->create()->id,
        ]);
    }

    /**
     * Indicate that the wishlist has no variant.
     */
    public function withoutVariant(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_variant_id' => null,
        ]);
    }
}
