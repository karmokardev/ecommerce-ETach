<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Brand;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample product data
        $productNames = [
            'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'MacBook Pro 16"', 'Dell XPS 15',
            'Sony WH-1000XM5', 'Nike Air Max 270', 'Adidas Ultraboost', 'Apple Watch Series 9',
            'iPad Pro 12.9"', 'Samsung Galaxy Tab S9', 'PlayStation 5', 'Xbox Series X',
            'Nintendo Switch OLED', 'Canon EOS R5', 'Sony A7 IV', 'GoPro Hero 12',
            'DJI Mavic 3 Pro', 'Bose QuietComfort 45', 'JBL Charge 5', 'Sonos Move',
            'Kindle Paperwhite', 'Kobo Clara 2E', 'Surface Pro 9', 'Lenovo ThinkPad X1',
            'HP Spectre x360', 'ASUS ROG Zephyrus', 'Razer Blade 16', 'Logitech MX Master 3S',
            'Keychron K2 Pro', 'Das Keyboard 4 Professional', 'Dell UltraSharp U2723QE',
            'LG UltraGear 27GP850', 'Samsung Odyssey G9', 'BenQ PD3200U', 'Ergotron LX',
            'Herman Miller Aeron', 'Steelcase Leap', 'Secretlab TITAN', 'Humanscale Freedom',
            'Yeti Tundra 45', 'Hydro Flask 32oz', 'Stanley Classic 40oz', 'Ooni Karu 16',
            'Traeger Timberline 1302', 'Weber Genesis E-325s', 'Big Green Egg Large',
            'Ninja Foodi Smart XL', 'Instant Pot Duo Plus', 'Vitamix A3500', 'Breville Barista Express',
            'Nespresso Vertuo Next', 'Breville Smart Oven Air', 'KitchenAid Stand Mixer',
            'Dyson V15 Detect', 'iRobot Roomba j7+', 'Shark Navigator Lift-Away',
            'Philips Sonicare DiamondClean', 'Oral-B iO Series 9', 'Waterpik Aquarius',
            'Fitbit Charge 6', 'Garmin Forerunner 265', 'Polar Vantage V3', 'Whoop Strap 4.0',
        ];

        $descriptions = [
            'Experience premium quality with our latest product. Designed for excellence and built to last.',
            'Revolutionary design meets cutting-edge technology. The perfect choice for modern lifestyles.',
            'Unmatched performance and reliability. Engineered for those who demand the best.',
            'Innovative features that redefine the category. A game-changer in every sense.',
            'Premium craftsmanship meets advanced functionality. The ultimate upgrade for your needs.',
        ];

        $categories = Category::pluck('id')->toArray();
        $brands = Brand::pluck('id')->toArray();
        $attributeValues = AttributeValue::pluck('id')->toArray();

        foreach ($productNames as $index => $productName) {
            $category = $categories[array_rand($categories)];
            $brand = $brands[array_rand($brands)];
            $description = $descriptions[array_rand($descriptions)];
            $slug = Str::slug($productName) . '-' . rand(1000, 9999);

            // Create product
            $product = Product::create([
                'category_id' => $category,
                'brand_id' => $brand,
                'name' => $productName,
                'slug' => $slug,
                'short_description' => substr($description, 0, 100) . '...',
                'description' => $description . ' This product features advanced technology, premium materials, and exceptional build quality. Perfect for both personal and professional use.',
                'status' => 'active',
                'is_featured' => rand(0, 1) ? true : false,
            ]);

            // Add random attribute values (2-4 per product) if attribute values exist
            if (!empty($attributeValues)) {
                $count = min(rand(2, 4), count($attributeValues));
                $selectedKeys = array_rand($attributeValues, $count);
                
                if (is_array($selectedKeys)) {
                    foreach ($selectedKeys as $key) {
                        $product->attributeValues()->attach($attributeValues[$key]);
                    }
                } elseif (is_int($selectedKeys)) {
                    $product->attributeValues()->attach($attributeValues[$selectedKeys]);
                }
            }

            // Create product images with random placeholder images
            $imageCount = rand(2, 5);
            for ($i = 0; $i < $imageCount; $i++) {
                $imageUrl = "https://picsum.photos/800/800?random=" . rand(1, 1000) . "&sig=" . $product->id . $i;
                
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $imageUrl,
                    'sort' => $i + 1,
                ]);
            }

            // Create product variants (1-3 per product)
            $variantCount = rand(1, 3);
            $colors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green'];
            $sizes = ['S', 'M', 'L', 'XL', 'One Size'];

            for ($i = 0; $i < $variantCount; $i++) {
                $color = $colors[array_rand($colors)];
                $size = $sizes[array_rand($sizes)];
                $sku = 'SKU-' . strtoupper(Str::random(8)) . '-' . strtoupper(substr($color, 0, 3)) . '-' . strtoupper($size);
                $dimensions = rand(10, 50) . 'x' . rand(10, 50) . 'x' . rand(10, 50) . ' cm';
                $price = rand(99, 1999);

                ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => $sku,
                    'barcode' => 'VAR-' . rand(1000000000, 9999999999),
                    'price' => $price,
                    'compare_price' => $price + rand(10, 100),
                    'cost_price' => $price * 0.6,
                    'weight' => rand(100, 5000) / 100,
                    'dimensions' => $dimensions,
                    'current_stock' => rand(0, 100),
                    'low_stock_alert' => rand(5, 15),
                    'status' => 'active',
                ]);
            }

            $this->command->info("Created product: {$productName}");
        }

        $this->command->info('Successfully seeded 50 products with images and variants.');
    }
}
