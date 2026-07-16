<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create root categories
        $electronics = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Electronic devices and accessories',
            'sort' => 1,
            'status' => 'active',
        ]);

        $clothing = Category::create([
            'name' => 'Clothing',
            'slug' => 'clothing',
            'description' => 'Fashion and apparel',
            'sort' => 2,
            'status' => 'active',
        ]);

        $home = Category::create([
            'name' => 'Home & Garden',
            'slug' => 'home-garden',
            'description' => 'Home decor and garden supplies',
            'sort' => 3,
            'status' => 'active',
        ]);

        // Create Electronics subcategories
        $mobile = Category::create([
            'parent_id' => $electronics->id,
            'name' => 'Mobile Phones',
            'slug' => 'mobile-phones',
            'description' => 'Smartphones and mobile devices',
            'sort' => 1,
            'status' => 'active',
        ]);

        $laptop = Category::create([
            'parent_id' => $electronics->id,
            'name' => 'Laptops',
            'slug' => 'laptops',
            'description' => 'Laptops and computers',
            'sort' => 2,
            'status' => 'active',
        ]);

        $accessories = Category::create([
            'parent_id' => $electronics->id,
            'name' => 'Accessories',
            'slug' => 'accessories',
            'description' => 'Electronic accessories',
            'sort' => 3,
            'status' => 'active',
        ]);

        // Create Mobile subcategories
        Category::create([
            'parent_id' => $mobile->id,
            'name' => 'Android',
            'slug' => 'android',
            'description' => 'Android smartphones',
            'sort' => 1,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $mobile->id,
            'name' => 'iPhone',
            'slug' => 'iphone',
            'description' => 'Apple iPhones',
            'sort' => 2,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $mobile->id,
            'name' => 'Feature Phone',
            'slug' => 'feature-phone',
            'description' => 'Basic feature phones',
            'sort' => 3,
            'status' => 'inactive',
        ]);

        // Create Laptop subcategories
        Category::create([
            'parent_id' => $laptop->id,
            'name' => 'Gaming Laptop',
            'slug' => 'gaming-laptop',
            'description' => 'High-performance gaming laptops',
            'sort' => 1,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $laptop->id,
            'name' => 'Ultrabook',
            'slug' => 'ultrabook',
            'description' => 'Thin and light laptops',
            'sort' => 2,
            'status' => 'active',
        ]);

        // Create Clothing subcategories
        Category::create([
            'parent_id' => $clothing->id,
            'name' => 'Men',
            'slug' => 'men',
            'description' => 'Men\'s clothing',
            'sort' => 1,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $clothing->id,
            'name' => 'Women',
            'slug' => 'women',
            'description' => 'Women\'s clothing',
            'sort' => 2,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $clothing->id,
            'name' => 'Kids',
            'slug' => 'kids',
            'description' => 'Kids clothing',
            'sort' => 3,
            'status' => 'active',
        ]);

        // Create Home & Garden subcategories
        Category::create([
            'parent_id' => $home->id,
            'name' => 'Furniture',
            'slug' => 'furniture',
            'description' => 'Home furniture',
            'sort' => 1,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $home->id,
            'name' => 'Garden',
            'slug' => 'garden',
            'description' => 'Garden supplies',
            'sort' => 2,
            'status' => 'active',
        ]);

        Category::create([
            'parent_id' => $home->id,
            'name' => 'Decor',
            'slug' => 'decor',
            'description' => 'Home decoration',
            'sort' => 3,
            'status' => 'inactive',
        ]);
    }
}
