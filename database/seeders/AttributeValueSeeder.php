<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;

class AttributeValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get attributes
        $sizeAttribute = Attribute::where('slug', 'size')->first();
        $colorAttribute = Attribute::where('slug', 'color')->first();
        $storageAttribute = Attribute::where('slug', 'storage')->first();
        $materialAttribute = Attribute::where('slug', 'material')->first();
        $weightAttribute = Attribute::where('slug', 'weight')->first();

        // Size values
        if ($sizeAttribute) {
            $sizeValues = [
                ['value' => 'XS', 'slug' => 'xs', 'sort' => 1],
                ['value' => 'S', 'slug' => 's', 'sort' => 2],
                ['value' => 'M', 'slug' => 'm', 'sort' => 3],
                ['value' => 'L', 'slug' => 'l', 'sort' => 4],
                ['value' => 'XL', 'slug' => 'xl', 'sort' => 5],
                ['value' => 'XXL', 'slug' => 'xxl', 'sort' => 6],
            ];

            foreach ($sizeValues as $value) {
                AttributeValue::create([
                    'attribute_id' => $sizeAttribute->id,
                    'value' => $value['value'],
                    'slug' => $value['slug'],
                    'sort' => $value['sort'],
                    'status' => 'active',
                ]);
            }
        }

        // Color values
        if ($colorAttribute) {
            $colorValues = [
                ['value' => 'Black', 'slug' => 'black', 'sort' => 1],
                ['value' => 'White', 'slug' => 'white', 'sort' => 2],
                ['value' => 'Red', 'slug' => 'red', 'sort' => 3],
                ['value' => 'Blue', 'slug' => 'blue', 'sort' => 4],
                ['value' => 'Green', 'slug' => 'green', 'sort' => 5],
                ['value' => 'Yellow', 'slug' => 'yellow', 'sort' => 6],
                ['value' => 'Pink', 'slug' => 'pink', 'sort' => 7],
                ['value' => 'Gray', 'slug' => 'gray', 'sort' => 8],
            ];

            foreach ($colorValues as $value) {
                AttributeValue::create([
                    'attribute_id' => $colorAttribute->id,
                    'value' => $value['value'],
                    'slug' => $value['slug'],
                    'sort' => $value['sort'],
                    'status' => 'active',
                ]);
            }
        }

        // Storage values
        if ($storageAttribute) {
            $storageValues = [
                ['value' => '64GB', 'slug' => '64gb', 'sort' => 1],
                ['value' => '128GB', 'slug' => '128gb', 'sort' => 2],
                ['value' => '256GB', 'slug' => '256gb', 'sort' => 3],
                ['value' => '512GB', 'slug' => '512gb', 'sort' => 4],
                ['value' => '1TB', 'slug' => '1tb', 'sort' => 5],
                ['value' => '2TB', 'slug' => '2tb', 'sort' => 6],
            ];

            foreach ($storageValues as $value) {
                AttributeValue::create([
                    'attribute_id' => $storageAttribute->id,
                    'value' => $value['value'],
                    'slug' => $value['slug'],
                    'sort' => $value['sort'],
                    'status' => 'active',
                ]);
            }
        }

        // Material values
        if ($materialAttribute) {
            $materialValues = [
                ['value' => 'Cotton', 'slug' => 'cotton', 'sort' => 1],
                ['value' => 'Polyester', 'slug' => 'polyester', 'sort' => 2],
                ['value' => 'Leather', 'slug' => 'leather', 'sort' => 3],
                ['value' => 'Denim', 'slug' => 'denim', 'sort' => 4],
                ['value' => 'Silk', 'slug' => 'silk', 'sort' => 5],
                ['value' => 'Wool', 'slug' => 'wool', 'sort' => 6],
            ];

            foreach ($materialValues as $value) {
                AttributeValue::create([
                    'attribute_id' => $materialAttribute->id,
                    'value' => $value['value'],
                    'slug' => $value['slug'],
                    'sort' => $value['sort'],
                    'status' => 'active',
                ]);
            }
        }

        // Weight values
        if ($weightAttribute) {
            $weightValues = [
                ['value' => 'Light', 'slug' => 'light', 'sort' => 1],
                ['value' => 'Medium', 'slug' => 'medium', 'sort' => 2],
                ['value' => 'Heavy', 'slug' => 'heavy', 'sort' => 3],
            ];

            foreach ($weightValues as $value) {
                AttributeValue::create([
                    'attribute_id' => $weightAttribute->id,
                    'value' => $value['value'],
                    'slug' => $value['slug'],
                    'sort' => $value['sort'],
                    'status' => 'active',
                ]);
            }
        }
    }
}
