<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create popular brands
        $brands = [
            [
                'name' => 'Apple',
                'slug' => 'apple',
                'description' => 'Apple Inc. is an American multinational technology company',
                'sort' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'Samsung',
                'slug' => 'samsung',
                'description' => 'Samsung Electronics is a South Korean multinational electronics company',
                'sort' => 2,
                'status' => 'active',
            ],
            [
                'name' => 'Sony',
                'slug' => 'sony',
                'description' => 'Sony Corporation is a Japanese multinational conglomerate corporation',
                'sort' => 3,
                'status' => 'active',
            ],
            [
                'name' => 'Nike',
                'slug' => 'nike',
                'description' => 'Nike is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing of footwear, apparel, equipment, accessories, and services',
                'sort' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'Adidas',
                'slug' => 'adidas',
                'description' => 'Adidas is a German multinational corporation, founded and headquartered in Herzogenaurach, that designs and manufactures shoes, clothing and accessories',
                'sort' => 5,
                'status' => 'active',
            ],
            [
                'name' => 'Dell',
                'slug' => 'dell',
                'description' => 'Dell is an American multinational computer technology company',
                'sort' => 6,
                'status' => 'active',
            ],
            [
                'name' => 'HP',
                'slug' => 'hp',
                'description' => 'HP is an American multinational information technology company',
                'sort' => 7,
                'status' => 'active',
            ],
            [
                'name' => 'LG',
                'slug' => 'lg',
                'description' => 'LG Corporation is a South Korean multinational conglomerate corporation',
                'sort' => 8,
                'status' => 'active',
            ],
            [
                'name' => 'Microsoft',
                'slug' => 'microsoft',
                'description' => 'Microsoft is an American multinational technology corporation',
                'sort' => 9,
                'status' => 'active',
            ],
            [
                'name' => 'Google',
                'slug' => 'google',
                'description' => 'Google is an American multinational technology company',
                'sort' => 10,
                'status' => 'active',
            ],
            [
                'name' => 'Amazon',
                'slug' => 'amazon',
                'description' => 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence',
                'sort' => 11,
                'status' => 'active',
            ],
            [
                'name' => 'Meta',
                'slug' => 'meta',
                'description' => 'Meta Platforms is an American multinational technology conglomerate based in Menlo Park, California',
                'sort' => 12,
                'status' => 'active',
            ],
            [
                'name' => 'Tesla',
                'slug' => 'tesla',
                'description' => 'Tesla is an American electric vehicle and clean energy company based in Austin, Texas',
                'sort' => 13,
                'status' => 'active',
            ],
            [
                'name' => 'Intel',
                'slug' => 'intel',
                'description' => 'Intel is an American multinational corporation and technology company headquartered in Santa Clara, California',
                'sort' => 14,
                'status' => 'active',
            ],
            [
                'name' => 'AMD',
                'slug' => 'amd',
                'description' => 'AMD is an American multinational semiconductor company based in Santa Clara, California',
                'sort' => 15,
                'status' => 'active',
            ],
            [
                'name' => 'NVIDIA',
                'slug' => 'nvidia',
                'description' => 'NVIDIA is an American multinational technology company incorporated in Delaware and based in Santa Clara, California',
                'sort' => 16,
                'status' => 'active',
            ],
            [
                'name' => 'Panasonic',
                'slug' => 'panasonic',
                'description' => 'Panasonic is a Japanese multinational electronics corporation headquartered in Kadoma, Osaka',
                'sort' => 17,
                'status' => 'active',
            ],
            [
                'name' => 'Philips',
                'slug' => 'philips',
                'description' => 'Philips is a Dutch multinational conglomerate corporation headquartered in Amsterdam, Netherlands',
                'sort' => 18,
                'status' => 'active',
            ],
            [
                'name' => 'Canon',
                'slug' => 'canon',
                'description' => 'Canon is a Japanese multinational corporation specializing in the manufacture of imaging and optical products',
                'sort' => 19,
                'status' => 'active',
            ],
            [
                'name' => 'Puma',
                'slug' => 'puma',
                'description' => 'Puma is a German multinational corporation that designs and manufactures athletic and casual footwear, apparel, and accessories',
                'sort' => 20,
                'status' => 'active',
            ],
            [
                'name' => 'Under Armour',
                'slug' => 'under-armour',
                'description' => 'Under Armour is an American sports equipment company that manufactures footwear, sports, and casual apparel',
                'sort' => 21,
                'status' => 'active',
            ],
            [
                'name' => 'Reebok',
                'slug' => 'reebok',
                'description' => 'Reebok is an American footwear and clothing company founded in 1958 as a companion company to J.W. Foster and Sons',
                'sort' => 22,
                'status' => 'active',
            ],
            [
                'name' => 'ASUS',
                'slug' => 'asus',
                'description' => 'ASUS is a Taiwanese multinational computer hardware and electronics company headquartered in Beitou District, Taipei, Taiwan',
                'sort' => 23,
                'status' => 'active',
            ],
            [
                'name' => 'Acer',
                'slug' => 'acer',
                'description' => 'Acer is a Taiwanese multinational hardware and electronics corporation specializing in advanced electronics technology',
                'sort' => 24,
                'status' => 'active',
            ],
            [
                'name' => 'Lenovo',
                'slug' => 'lenovo',
                'description' => 'Lenovo is a Chinese multinational technology company specializing in personal computers, tablets, smartphones, and smart televisions',
                'sort' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Xiaomi',
                'slug' => 'xiaomi',
                'description' => 'Xiaomi is a Chinese multinational electronics company founded in April 2010 and headquartered in Beijing',
                'sort' => 26,
                'status' => 'active',
            ],
            [
                'name' => 'OnePlus',
                'slug' => 'oneplus',
                'description' => 'OnePlus is a Chinese consumer electronics manufacturer headquartered in Shenzhen, Guangdong province',
                'sort' => 27,
                'status' => 'active',
            ],
            [
                'name' => 'Oppo',
                'slug' => 'oppo',
                'description' => 'OPPO is a Chinese consumer electronics and mobile communications company headquartered in Dongguan, Guangdong',
                'sort' => 28,
                'status' => 'active',
            ],
            [
                'name' => 'Vivo',
                'slug' => 'vivo',
                'description' => 'Vivo is a Chinese technology company headquartered in Dongguan, Guangdong, that designs and develops smartphones',
                'sort' => 29,
                'status' => 'active',
            ],
            [
                'name' => 'Realme',
                'slug' => 'realme',
                'description' => 'Realme is a Chinese smartphone manufacturer based in Shenzhen, Guangdong, founded in 2018',
                'sort' => 30,
                'status' => 'active',
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(
                ['slug' => $brand['slug']],
                $brand
            );
        }
    }
}
