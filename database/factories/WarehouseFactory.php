<?php

namespace Database\Factories;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Warehouse',
            'code' => strtoupper(fake()->unique()->lexify('WH-????')),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'manager_name' => fake()->name(),
            'status' => 'active',
        ];
    }
}
