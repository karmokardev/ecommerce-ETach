<?php

namespace Database\Seeders;

use App\Models\Attribute;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Size',
                'slug' => 'size',
                'status' => 'active',
                'sort' => 1,
            ],
            [
                'name' => 'Color',
                'slug' => 'color',
                'status' => 'active',
                'sort' => 2,
            ],
            [
                'name' => 'Storage',
                'slug' => 'storage',
                'status' => 'active',
                'sort' => 3,
            ],
            [
                'name' => 'Material',
                'slug' => 'material',
                'status' => 'active',
                'sort' => 4,
            ],
            [
                'name' => 'Weight',
                'slug' => 'weight',
                'status' => 'active',
                'sort' => 5,
            ],
        ];

        foreach ($attributes as $attribute) {
            Attribute::create($attribute);
        }
    }
}
