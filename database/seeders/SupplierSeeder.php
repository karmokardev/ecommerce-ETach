<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'TechSupply Co.',
                'company' => 'TechSupply International',
                'email' => 'contact@techsupply.com',
                'phone' => '+1-555-0101',
                'address' => '123 Tech Street, Silicon Valley, CA 94025',
                'notes' => 'Primary supplier for electronic components',
                'status' => 'active',
            ],
            [
                'name' => 'Global Electronics',
                'company' => 'Global Electronics Ltd',
                'email' => 'sales@globalelectronics.com',
                'phone' => '+1-555-0102',
                'address' => '456 Electronics Blvd, Austin, TX 78701',
                'notes' => 'Bulk electronics supplier',
                'status' => 'active',
            ],
            [
                'name' => 'Premium Parts Inc',
                'company' => 'Premium Parts Corporation',
                'email' => 'orders@premiumparts.com',
                'phone' => '+1-555-0103',
                'address' => '789 Parts Avenue, Seattle, WA 98101',
                'notes' => 'High-quality components supplier',
                'status' => 'active',
            ],
            [
                'name' => 'QuickShip Supplies',
                'company' => 'QuickShip Logistics',
                'email' => 'info@quickship.com',
                'phone' => '+1-555-0104',
                'address' => '321 Shipping Lane, Chicago, IL 60601',
                'notes' => 'Fast shipping supplier',
                'status' => 'active',
            ],
            [
                'name' => 'Wholesale Hub',
                'company' => 'Wholesale Hub International',
                'email' => 'b2b@wholesalehub.com',
                'phone' => '+1-555-0105',
                'address' => '654 Wholesale Drive, Miami, FL 33101',
                'notes' => 'Bulk wholesale supplier',
                'status' => 'active',
            ],
            [
                'name' => 'Direct Manufacturers',
                'company' => 'Direct Manufacturing Co',
                'email' => 'factory@directmfg.com',
                'phone' => '+1-555-0106',
                'address' => '987 Factory Road, Detroit, MI 48201',
                'notes' => 'Direct from manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Asian Imports',
                'company' => 'Asian Import Export',
                'email' => 'import@asianimports.com',
                'phone' => '+1-555-0107',
                'address' => '147 Import Street, Los Angeles, CA 90001',
                'notes' => 'Imported goods supplier',
                'status' => 'inactive',
            ],
            [
                'name' => 'Local Distributors',
                'company' => 'Local Distribution Network',
                'email' => 'sales@localdist.com',
                'phone' => '+1-555-0108',
                'address' => '258 Local Way, Boston, MA 02101',
                'notes' => 'Regional distribution partner',
                'status' => 'active',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
            $this->command->info("Created supplier: {$supplier['name']}");
        }

        $this->command->info('Successfully seeded 8 suppliers.');
    }
}
