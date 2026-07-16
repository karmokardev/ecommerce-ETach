<?php

namespace Database\Seeders;

use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = Supplier::pluck('id')->toArray();
        $warehouses = Warehouse::where('status', 'active')->pluck('id')->toArray();

        if (empty($suppliers) || empty($warehouses)) {
            $this->command->warn('Suppliers or warehouses not found. Skipping purchase seeding.');
            return;
        }

        // Create 15 purchases
        for ($i = 1; $i <= 15; $i++) {
            $supplier = $suppliers[array_rand($suppliers)];
            $warehouse = $warehouses[array_rand($warehouses)];
            
            // Generate random date within last 90 days
            $purchaseDate = Carbon::now()->subDays(rand(0, 90));
            $invoiceNo = 'PO-' . date('Ymd', strtotime($purchaseDate)) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT);
            
            $status = rand(0, 1) ? 'completed' : 'draft';

            Purchase::create([
                'supplier_id' => $supplier,
                'warehouse_id' => $warehouse,
                'invoice_no' => $invoiceNo,
                'purchase_date' => $purchaseDate,
                'notes' => 'Purchase order #' . $i . ' for inventory replenishment',
                'status' => $status,
            ]);

            $this->command->info("Created purchase: {$invoiceNo}");
        }

        $this->command->info('Successfully seeded 15 purchases.');
    }
}
