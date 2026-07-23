<?php

namespace App\Services;

use App\Models\CustomerAccount;
use App\Models\CustomerTransaction;
use App\Models\PosOrder;
use App\Models\ProductReturn;
use App\Models\ReturnItem;
use App\Models\ProductVariant;
use App\Models\Warehouse;
use Exception;
use Illuminate\Support\Facades\DB;

class ReturnService
{
    protected StockService $stockService;
    protected PosService $posService;

    public function __construct(StockService $stockService, PosService $posService)
    {
        $this->stockService = $stockService;
        $this->posService = $posService;
    }

    /**
     * Create a new return request.
     */
    public function createReturn(array $data, int $userId): ProductReturn
    {
        return DB::transaction(function () use ($data, $userId) {
            // Calculate total refund amount
            $totalRefund = 0;
            foreach ($data['items'] as $item) {
                $totalRefund += $item['quantity'] * $item['refund_price'];
            }

            $return = ProductReturn::create([
                'order_type' => $data['order_type'],
                'order_id' => $data['order_id'],
                'user_id' => $data['user_id'] ?? null,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'reason' => $data['reason'] ?? null,
                'status' => 'pending',
                'return_type' => $data['return_type'] ?? 'refund',
                'refund_method' => $data['refund_method'] ?? 'original',
                'refund_amount' => $totalRefund,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Add return items
            foreach ($data['items'] as $item) {
                ReturnItem::create([
                    'return_id' => $return->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                    'refund_price' => $item['refund_price'],
                    'condition' => $item['condition'] ?? 'new',
                    'restock_status' => 'pending',
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            return $return;
        });
    }

    /**
     * Approve a return request.
     */
    public function approveReturn(ProductReturn $return, int $approvedBy): void
    {
        DB::transaction(function () use ($return, $approvedBy) {
            if (!$return->canBeApproved()) {
                throw new Exception('This return cannot be approved.');
            }

            $return->approve($approvedBy);

            // Process restock for all items
            $warehouse = Warehouse::firstOrFail();
            
            foreach ($return->items as $item) {
                if ($item->canBeRestocked()) {
                    $variant = ProductVariant::findOrFail($item->product_variant_id);
                    
                    // Increase stock
                    $this->stockService->processReturn(
                        $variant,
                        $item->quantity,
                        $warehouse,
                        $return
                    );

                    // Mark as restocked
                    $item->markAsRestocked();
                }
            }

            // Process refund to customer account if applicable
            if ($return->user_id && $return->refund_amount > 0) {
                $this->processRefundToCustomer($return);
            }
        });
    }

    /**
     * Reject a return request.
     */
    public function rejectReturn(ProductReturn $return, int $approvedBy, ?string $reason = null): void
    {
        DB::transaction(function () use ($return, $approvedBy, $reason) {
            if (!$return->canBeRejected()) {
                throw new Exception('This return cannot be rejected.');
            }

            $return->reject($approvedBy);

            // Mark all items as restock rejected
            foreach ($return->items as $item) {
                $item->markAsRestockRejected();
            }

            // Update notes with rejection reason
            if ($reason) {
                $return->notes = ($return->notes ? $return->notes . "\n" : '') . "Rejected: {$reason}";
                $return->save();
            }
        });
    }

    /**
     * Complete a return (process refund).
     */
    public function completeReturn(ProductReturn $return): void
    {
        DB::transaction(function () use ($return) {
            if (!$return->canBeCompleted()) {
                throw new Exception('This return cannot be completed.');
            }

            $return->complete();

            // Additional refund processing based on refund method
            // This would integrate with payment gateways in production
        });
    }

    /**
     * Process refund to customer account.
     */
    protected function processRefundToCustomer(ProductReturn $return): void
    {
        $account = CustomerAccount::where('user_id', $return->user_id)->first();
        
        if (!$account) {
            return;
        }

        // Create credit transaction
        $this->posService->createTransaction(
            $account,
            'refund',
            $return->refund_amount,
            'product_return',
            $return->id,
            "Return #{$return->return_number}"
        );

        // Update account balance
        $account->balance += $return->refund_amount;
        $account->total_due = max(0, $account->total_due - $return->refund_amount);
        $account->save();
    }

    /**
     * Get return statistics.
     */
    public function getReturnStatistics(): array
    {
        return [
            'total_returns' => ProductReturn::count(),
            'pending_returns' => ProductReturn::pending()->count(),
            'approved_returns' => ProductReturn::approved()->count(),
            'rejected_returns' => ProductReturn::rejected()->count(),
            'completed_returns' => ProductReturn::completed()->count(),
            'total_refund_amount' => ProductReturn::where('status', 'completed')->sum('refund_amount'),
            'pending_refund_amount' => ProductReturn::approved()->sum('refund_amount'),
        ];
    }

    /**
     * Get returns by order.
     */
    public function getReturnsByOrder(string $orderType, int $orderId): \Illuminate\Database\Eloquent\Collection
    {
        return ProductReturn::where('order_type', $orderType)
            ->where('order_id', $orderId)
            ->with('items.variant')
            ->ordered()
            ->get();
    }
}
