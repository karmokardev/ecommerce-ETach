<?php

namespace Database\Seeders;

use App\Models\ShippingZone;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $zones = [
            [
                'name' => 'Dhaka Metro',
                'code' => 'dhaka_metro',
                'districts' => ['Dhaka'],
                'areas' => ['Gulshan', 'Banani', 'Baridhara', 'Uttara', 'Dhanmondi', 'Mirpur', 'Mohammadpur', 'Paltan', 'Motijheel', 'Badda', 'Rampura', 'Malibagh'],
                'base_rate' => 0,
                'additional_rate' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Dhaka District',
                'code' => 'dhaka_district',
                'districts' => ['Dhaka'],
                'areas' => ['Savar', 'Keraniganj', 'Narsingdi', 'Gazipur', 'Tongi', 'Narayanganj'],
                'base_rate' => 20,
                'additional_rate' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Chittagong',
                'code' => 'chittagong',
                'districts' => ['Chittagong'],
                'areas' => ['Agrabad', 'GEC Circle', 'Halishahar', 'Khulshi', 'Nasirabad', 'Pahartali', 'Port Area'],
                'base_rate' => 30,
                'additional_rate' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Sylhet',
                'code' => 'sylhet',
                'districts' => ['Sylhet'],
                'areas' => ['Ambarkhana', 'Bondor', 'Kumarpara', 'Zindabazar', 'Akhalia'],
                'base_rate' => 40,
                'additional_rate' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Rajshahi',
                'code' => 'rajshahi',
                'districts' => ['Rajshahi'],
                'areas' => ['Saheb Bazar', 'Uposhahar', 'Borobazar', 'Lakkhanpur'],
                'base_rate' => 45,
                'additional_rate' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Khulna',
                'code' => 'khulna',
                'districts' => ['Khulna'],
                'areas' => ['Shibbari', 'KDA Avenue', 'Daulatpur', 'Khalishpur'],
                'base_rate' => 45,
                'additional_rate' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Rangpur',
                'code' => 'rangpur',
                'districts' => ['Rangpur', 'Dinajpur', 'Bogra', 'Pabna'],
                'areas' => null,
                'base_rate' => 50,
                'additional_rate' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Barisal',
                'code' => 'barisal',
                'districts' => ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur'],
                'areas' => null,
                'base_rate' => 50,
                'additional_rate' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Mymensingh',
                'code' => 'mymensingh',
                'districts' => ['Mymensingh', 'Jamalpur', 'Sherpur', 'Netrokona'],
                'areas' => null,
                'base_rate' => 45,
                'additional_rate' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Nationwide',
                'code' => 'nationwide',
                'districts' => ['Comilla', 'Coxs Bazar', 'Noakhali', 'Feni', 'Brahmanbaria', 'Chandpur', 'Lakshmipur', 'Jessore', 'Satkhira', 'Meherpur', 'Narail', 'Magura', 'Jhenaidah', 'Chuadanga', 'Kushtia', 'Naogaon', 'Natore', 'Sirajganj', 'Pabna', 'Joypurhat', 'Bogra', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Thakurgaon', 'Panchagarh'],
                'areas' => null,
                'base_rate' => 60,
                'additional_rate' => 30,
                'is_active' => true,
            ],
        ];

        foreach ($zones as $zone) {
            ShippingZone::updateOrCreate(
                ['code' => $zone['code']],
                $zone
            );
        }
    }
}
