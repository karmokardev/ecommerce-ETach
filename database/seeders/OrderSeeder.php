<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        $products = Product::where('status', 'active')->pluck('id')->toArray();

        if (empty($products)) {
            $this->command->warn('Products not found. Skipping order seeding.');
            return;
        }

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        $paymentMethods = ['cash', 'card', 'bank_transfer', 'online'];

        // Create 25 orders
        for ($i = 1; $i <= 25; $i++) {
            $userId = !empty($users) ? $users[array_rand($users)] : null;
            
            // Generate random date within last 60 days
            $orderDate = Carbon::now()->subDays(rand(0, 60));
            
            $status = $statuses[array_rand($statuses)];
            $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

            // Calculate random totals
            $subtotal = rand(50, 500);
            $shippingCost = rand(0, 20);
            $tax = round($subtotal * 0.1, 2);
            $discount = rand(0, 50);
            $total = $subtotal + $shippingCost + $tax - $discount;

            // Set timestamps based on status
            $shippedDate = null;
            $deliveredDate = null;
            $cancelledDate = null;

            if ($status === 'shipped') {
                $shippedDate = $orderDate->copy()->addDays(rand(1, 3));
            } elseif ($status === 'delivered') {
                $shippedDate = $orderDate->copy()->addDays(rand(1, 3));
                $deliveredDate = $shippedDate->copy()->addDays(rand(2, 5));
            } elseif ($status === 'cancelled') {
                $cancelledDate = $orderDate->copy()->addDays(rand(1, 2));
            }

            $order = Order::create([
                'user_id' => $userId,
                'order_no' => Order::generateOrderNo(),
                'customer_name' => 'Customer ' . $i,
                'customer_email' => 'customer' . $i . '@example.com',
                'customer_phone' => '+8801' . rand(300000000, 999999999),
                'shipping_address' => "House " . rand(1, 100) . ", Street " . rand(1, 20) . ", Dhaka, Bangladesh",
                'billing_address' => null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'status' => $status,
                'notes' => rand(0, 1) ? 'Special instructions for order #' . $i : null,
                'order_date' => $orderDate,
                'shipped_date' => $shippedDate,
                'delivered_date' => $deliveredDate,
                'cancelled_date' => $cancelledDate,
            ]);

            $this->command->info("Created order: {$order->order_no}");
        }

        $this->command->info('Successfully seeded 25 orders.');
    }
}
