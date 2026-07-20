<?php

namespace Database\Seeders;

use App\Models\StockTransfer;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StockTransferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = Warehouse::where('status', 'active')->pluck('id')->toArray();

        if (count($warehouses) < 2) {
            $this->command->warn('Need at least 2 active warehouses for stock transfers. Skipping.');
            return;
        }

        // Create 10 stock transfers between different warehouses
        for ($i = 1; $i <= 10; $i++) {
            // Pick two different warehouses
            $fromIndex = array_rand($warehouses);
            $toIndex = ($fromIndex + 1) % count($warehouses);

            $fromWarehouse = $warehouses[$fromIndex];
            $toWarehouse = $warehouses[$toIndex];

            // Generate random date within last 60 days
            $transferDate = Carbon::now()->subDays(rand(0, 60));
            $status = rand(0, 1) ? 'completed' : 'pending';

            // Generate unique transfer number
            $transferNo = 'TR-' . date('Y') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);

            StockTransfer::create([
                'transfer_no' => $transferNo,
                'from_warehouse_id' => $fromWarehouse,
                'to_warehouse_id' => $toWarehouse,
                'transfer_date' => $transferDate,
                'notes' => 'Stock transfer #' . $i . ' between warehouses',
                'status' => $status,
            ]);

            $this->command->info("Created stock transfer #{$i} with number: {$transferNo}");
        }

        $this->command->info('Successfully seeded 10 stock transfers.');
    }
}
