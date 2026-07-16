<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = [
            [
                'name' => 'Main Warehouse',
                'code' => 'WH-MAIN',
                'address' => '100 Warehouse Blvd, Distribution Center, CA 94025',
                'phone' => '+1-555-0201',
                'manager_name' => 'John Smith',
                'status' => 'active',
            ],
            [
                'name' => 'East Coast Distribution',
                'code' => 'WH-EAST',
                'address' => '200 East Coast Drive, Newark, NJ 07102',
                'phone' => '+1-555-0202',
                'manager_name' => 'Sarah Johnson',
                'status' => 'active',
            ],
            [
                'name' => 'West Coast Hub',
                'code' => 'WH-WEST',
                'address' => '300 Pacific Highway, Los Angeles, CA 90001',
                'phone' => '+1-555-0203',
                'manager_name' => 'Michael Chen',
                'status' => 'active',
            ],
            [
                'name' => 'Central Storage',
                'code' => 'WH-CENTRAL',
                'address' => '400 Central Avenue, Dallas, TX 75201',
                'phone' => '+1-555-0204',
                'manager_name' => 'Emily Davis',
                'status' => 'active',
            ],
            [
                'name' => 'Backup Facility',
                'code' => 'WH-BACKUP',
                'address' => '500 Reserve Road, Phoenix, AZ 85001',
                'phone' => '+1-555-0205',
                'manager_name' => 'Robert Wilson',
                'status' => 'inactive',
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
            $this->command->info("Created warehouse: {$warehouse['name']}");
        }

        $this->command->info('Successfully seeded 5 warehouses.');
    }
}
