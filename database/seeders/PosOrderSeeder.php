<?php

namespace Database\Seeders;

use App\Models\PosOrder;
use App\Models\PosOrderItem;
use App\Models\PosPayment;
use App\Models\User;
use App\Models\ProductVariant;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PosOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Get users
            $users = User::limit(10)->get();
            if ($users->isEmpty()) {
                $this->command->warn('No users found. Skipping PosOrderSeeder.');
                return;
            }

            // Get product variants
            $variants = ProductVariant::where('current_stock', '>', 0)->limit(20)->get();
            if ($variants->isEmpty()) {
                $this->command->warn('No product variants with stock found. Skipping PosOrderSeeder.');
                return;
            }

            // Get warehouse
            $warehouse = Warehouse::first();
            if (!$warehouse) {
                $this->command->warn('No warehouse found. Skipping PosOrderSeeder.');
                return;
            }

            $paymentMethods = ['cash', 'card', 'bkash', 'nagad'];
            $statuses = ['completed', 'pending', 'cancelled', 'held'];

            // Create sample POS orders
            for ($i = 1; $i <= 20; $i++) {
                $user = $users[$i % $users->count()];
                $status = $statuses[array_rand($statuses)];
                
                // Select random items for the order
                $orderItems = [];
                $total = 0;
                $itemCount = rand(1, 5);
                
                for ($j = 0; $j < $itemCount; $j++) {
                    $variant = $variants[($i + $j) % $variants->count()];
                    $quantity = rand(1, 3);
                    $subtotal = $variant->price * $quantity;
                    $total += $subtotal;
                    
                    $orderItems[] = [
                        'product_variant_id' => $variant->id,
                        'quantity' => $quantity,
                        'unit_price' => $variant->price,
                        'subtotal' => $subtotal,
                        'discount' => 0,
                    ];
                }

                // Calculate payment
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
                $paidAmount = $status === 'completed' ? $total : rand(0, $total);
                $dueAmount = $total - $paidAmount;

                $order = PosOrder::create([
                    'order_number' => 'POS-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                    'user_id' => $user->id,
                    'warehouse_id' => $warehouse->id,
                    'customer_name' => $user->name,
                    'customer_phone' => $user->phone,
                    'subtotal' => $total,
                    'discount' => 0,
                    'tax' => 0,
                    'total' => $total,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'payment_status' => $dueAmount > 0 ? 'partial' : 'paid',
                    'status' => $status,
                    'notes' => $status === 'held' ? 'Order placed on hold' : null,
                    'created_by' => 1,
                ]);

                // Create order items
                foreach ($orderItems as $item) {
                    PosOrderItem::create([
                        'pos_order_id' => $order->id,
                        'product_variant_id' => $item['product_variant_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal' => $item['subtotal'],
                        'discount' => $item['discount'],
                    ]);
                }

                // Create payment if there's a paid amount
                if ($paidAmount > 0) {
                    PosPayment::create([
                        'pos_order_id' => $order->id,
                        'amount' => $paidAmount,
                        'payment_method' => $paymentMethod,
                        'transaction_id' => $paymentMethod !== 'cash' ? 'TXN-' . strtoupper(substr(md5($i), 0, 8)) : null,
                        'received_by' => 1, // Assuming admin user has ID 1
                    ]);
                }
            }

            DB::commit();
            $this->command->info('PosOrderSeeder completed successfully. Created 20 POS orders.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('PosOrderSeeder failed: ' . $e->getMessage());
        }
    }
}
