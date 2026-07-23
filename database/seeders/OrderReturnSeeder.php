<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderReturn;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderReturnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::where('status', '!=', 'cancelled')->pluck('id', 'id')->toArray();
        $orderItems = OrderItem::pluck('id', 'id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($orders) || empty($orderItems)) {
            $this->command->warn('Orders or order items not found. Skipping order return seeding.');
            return;
        }

        $statuses = ['pending', 'approved', 'rejected', 'completed'];
        $refundStatuses = ['pending', 'approved', 'processed', 'rejected'];
        $reasons = [
            'Product damaged during shipping',
            'Wrong item received',
            'Product not as described',
            'Changed mind',
            'Defective product',
            'Size/fit issue',
        ];

        // Create 10 return requests
        for ($i = 1; $i <= 10; $i++) {
            $orderId = $orders[array_rand($orders)];
            $orderItem = OrderItem::where('order_id', $orderId)->inRandomOrder()->first();
            
            if (!$orderItem) {
                continue;
            }

            $userId = !empty($users) ? $users[array_rand($users)] : null;
            
            // Generate random date within last 30 days
            $requestedDate = Carbon::now()->subDays(rand(0, 30));
            
            $status = $statuses[array_rand($statuses)];
            $refundStatus = $refundStatuses[array_rand($refundStatuses)];
            $reason = $reasons[array_rand($reasons)];

            // Calculate refund amount (partial refund)
            $refundAmount = $orderItem->subtotal * rand(50, 100) / 100;

            // Set processed date based on status
            $processedDate = null;
            if (in_array($status, ['approved', 'rejected', 'completed'])) {
                $processedDate = $requestedDate->copy()->addDays(rand(1, 3));
            }

            OrderReturn::create([
                'order_id' => $orderId,
                'order_item_id' => $orderItem->id,
                'user_id' => $userId,
                'return_no' => OrderReturn::generateReturnNo(),
                'reason' => $reason,
                'description' => 'Customer requested return for ' . $reason,
                'status' => $status,
                'quantity' => min($orderItem->quantity, rand(1, $orderItem->quantity)),
                'refund_amount' => $refundAmount,
                'refund_status' => $refundStatus,
                'admin_notes' => rand(0, 1) ? 'Reviewed by admin on ' . $processedDate?->format('Y-m-d') : null,
                'requested_date' => $requestedDate,
                'processed_date' => $processedDate,
            ]);

            $this->command->info("Created return request #{$i}");
        }

        $this->command->info('Successfully seeded 10 order returns.');
    }
}
