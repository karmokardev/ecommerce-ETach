<?php

namespace Database\Seeders;

use App\Models\ProductReturn;
use App\Models\ReturnItem;
use App\Models\User;
use App\Models\ProductVariant;
use App\Models\PosOrder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductReturnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Get some users for returns
            $users = User::limit(5)->get();
            if ($users->isEmpty()) {
                $this->command->warn('No users found. Skipping ProductReturnSeeder.');
                return;
            }

            // Get some product variants
            $variants = ProductVariant::limit(10)->get();
            if ($variants->isEmpty()) {
                $this->command->warn('No product variants found. Skipping ProductReturnSeeder.');
                return;
            }

            // Get some POS orders
            $orders = PosOrder::limit(5)->get();
            if ($orders->isEmpty()) {
                $this->command->warn('No POS orders found. Skipping ProductReturnSeeder.');
                return;
            }

            $returnReasons = [
                'Defective product',
                'Wrong item received',
                'Damaged during shipping',
                'Not as described',
                'Changed mind',
                'Size not fitting',
                'Quality issues',
                'Missing parts',
            ];

            $returnTypes = ['refund', 'exchange', 'store_credit'];
            $refundMethods = ['cash', 'card', 'bkash', 'nagad', 'original_payment'];

            // Create sample returns
            foreach ($orders as $index => $order) {
                $user = $users[$index % $users->count()];
                $variant = $variants[$index % $variants->count()];
                
                $returnType = $returnTypes[array_rand($returnTypes)];
                $refundMethod = $refundMethods[array_rand($refundMethods)];
                $reason = $returnReasons[array_rand($returnReasons)];
                
                $refundAmount = $variant->price * rand(1, 3);
                
                $return = ProductReturn::create([
                    'return_number' => 'RET-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT),
                    'order_type' => 'pos_order',
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'customer_name' => $user->name,
                    'customer_phone' => $user->phone,
                    'reason' => $reason,
                    'status' => $this->getRandomStatus(),
                    'return_type' => $returnType,
                    'refund_method' => $refundMethod,
                    'refund_amount' => $refundAmount,
                    'created_by' => 1, // Assuming admin user has ID 1
                ]);

                // Create return items
                $itemCount = rand(1, 3);
                for ($i = 0; $i < $itemCount; $i++) {
                    $itemVariant = $variants[($index + $i) % $variants->count()];
                    
                    ReturnItem::create([
                        'return_id' => $return->id,
                        'product_variant_id' => $itemVariant->id,
                        'quantity' => rand(1, 2),
                        'refund_price' => $itemVariant->price,
                        'condition' => $this->getRandomCondition(),
                        'restock_status' => $this->getRandomRestockStatus(),
                        'notes' => $i === 0 ? 'Item condition as described by customer' : null,
                    ]);
                }

                // Simulate approval for some returns
                if ($return->status === 'approved' && !$return->approved_by) {
                    $return->update([
                        'approved_by' => 1,
                        'approved_at' => now()->subHours(rand(1, 24)),
                    ]);
                }

                // Simulate completion for some approved returns
                if ($return->status === 'completed' && !$return->completed_at) {
                    $return->update([
                        'completed_at' => now()->subHours(rand(1, 12)),
                    ]);
                }
            }

            DB::commit();
            $this->command->info('ProductReturnSeeder completed successfully.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('ProductReturnSeeder failed: ' . $e->getMessage());
        }
    }

    private function getRandomStatus(): string
    {
        $statuses = ['pending', 'approved', 'rejected', 'completed'];
        $weights = [40, 30, 15, 15]; // Higher weight for pending and approved
        
        $rand = rand(1, 100);
        $cumulative = 0;
        
        foreach ($statuses as $index => $status) {
            $cumulative += $weights[$index];
            if ($rand <= $cumulative) {
                return $status;
            }
        }
        
        return 'pending';
    }

    private function getRandomCondition(): string
    {
        $conditions = ['new', 'used', 'damaged', 'defective'];
        return $conditions[array_rand($conditions)];
    }

    private function getRandomRestockStatus(): string
    {
        $statuses = ['pending', 'restocked', 'cannot_restock'];
        return $statuses[array_rand($statuses)];
    }
}
