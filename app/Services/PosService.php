<?php

namespace App\Services;

use App\Models\CustomerAccount;
use App\Models\CustomerTransaction;
use App\Models\PosOrder;
use App\Models\PosOrderItem;
use App\Models\PosPayment;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Warehouse;
use Exception;
use Illuminate\Support\Facades\DB;

class PosService
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new POS order.
     */
    public function createOrder(array $data, int $userId): PosOrder
    {
        return DB::transaction(function () use ($data, $userId) {
            $warehouse = Warehouse::firstOrFail();
            
            $order = PosOrder::create([
                'user_id' => $data['user_id'] ?? null,
                'warehouse_id' => $warehouse->id,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'subtotal' => $data['subtotal'],
                'tax' => $data['tax'] ?? 0,
                'discount' => $data['discount'] ?? 0,
                'total' => $data['total'],
                'paid_amount' => $data['paid_amount'] ?? 0,
                'due_amount' => $data['due_amount'] ?? 0,
                'payment_status' => $this->calculatePaymentStatus($data['paid_amount'] ?? 0, $data['total']),
                'status' => 'completed',
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Add items to order
            foreach ($data['items'] as $item) {
                $this->addOrderItem($order, $item, $warehouse);
            }

            // Process payments
            if (isset($data['payments']) && count($data['payments']) > 0) {
                foreach ($data['payments'] as $payment) {
                    $this->addPayment($order, $payment, $userId);
                }
            }

            // Handle due sales (credit)
            if ($order->due_amount > 0 && $order->user_id) {
                $this->processDueSale($order);
            }

            return $order;
        });
    }

    /**
     * Add item to POS order.
     */
    protected function addOrderItem(PosOrder $order, array $item, Warehouse $warehouse): void
    {
        $variant = ProductVariant::findOrFail($item['product_variant_id']);
        
        $subtotal = $item['quantity'] * $item['unit_price'];
        
        PosOrderItem::create([
            'pos_order_id' => $order->id,
            'product_variant_id' => $variant->id,
            'quantity' => $item['quantity'],
            'unit_price' => $item['unit_price'],
            'subtotal' => $subtotal,
            'discount' => $item['discount'] ?? 0,
        ]);

        // Decrease stock
        $this->stockService->processSale(
            $variant,
            $item['quantity'],
            $warehouse,
            $order
        );
    }

    /**
     * Add payment to POS order.
     */
    protected function addPayment(PosOrder $order, array $payment, int $userId): void
    {
        PosPayment::create([
            'pos_order_id' => $order->id,
            'amount' => $payment['amount'],
            'payment_method' => $payment['payment_method'],
            'transaction_id' => $payment['transaction_id'] ?? null,
            'notes' => $payment['notes'] ?? null,
            'received_by' => $userId,
        ]);
    }

    /**
     * Process due sale (credit purchase).
     */
    protected function processDueSale(PosOrder $order): void
    {
        $customer = User::findOrFail($order->user_id);
        $account = $this->getOrCreateCustomerAccount($customer->id);

        // Create debit transaction
        $this->createTransaction(
            $account,
            'debit',
            $order->due_amount,
            'pos_order',
            $order->id,
            "POS Order #{$order->order_number}"
        );

        // Update account balance and total due
        $account->balance -= $order->due_amount;
        $account->total_due += $order->due_amount;
        $account->save();
    }

    /**
     * Get or create customer account.
     */
    public function getOrCreateCustomerAccount(int $userId): CustomerAccount
    {
        $account = CustomerAccount::firstOrCreate(
            ['user_id' => $userId],
            [
                'balance' => 0,
                'credit_limit' => 10000, // Default credit limit
                'total_due' => 0,
                'is_active' => true,
            ]
        );

        return $account;
    }

    /**
     * Create customer transaction.
     */
    public function createTransaction(
        CustomerAccount $account,
        string $type,
        float $amount,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $description = null
    ): CustomerTransaction {
        $balanceAfter = $account->balance;

        if ($type === 'debit' || $type === 'payment') {
            $balanceAfter -= $amount;
        } else {
            $balanceAfter += $amount;
        }

        return CustomerTransaction::create([
            'customer_account_id' => $account->id,
            'type' => $type,
            'amount' => $amount,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'description' => $description,
            'balance_after' => $balanceAfter,
        ]);
    }

    /**
     * Process customer payment.
     */
    public function processPayment(int $userId, float $amount, string $paymentMethod, int $receivedBy, ?string $notes = null): CustomerTransaction
    {
        return DB::transaction(function () use ($userId, $amount, $paymentMethod, $receivedBy, $notes) {
            $account = CustomerAccount::where('user_id', $userId)->firstOrFail();

            if ($account->balance >= 0) {
                throw new Exception('Customer has no due balance.');
            }

            $paymentAmount = min($amount, abs($account->balance));

            // Create payment transaction
            $transaction = $this->createTransaction(
                $account,
                'payment',
                $paymentAmount,
                null,
                null,
                "Payment received via {$paymentMethod}"
            );

            // Update account balance and total due
            $account->balance += $paymentAmount;
            $account->total_due -= $paymentAmount;
            $account->last_payment_date = now();
            $account->save();

            return $transaction;
        });
    }

    /**
     * Process return for POS order.
     */
    public function processReturn(PosOrder $order, array $returnData): void
    {
        DB::transaction(function () use ($order, $returnData) {
            $warehouse = $order->warehouse;
            
            foreach ($returnData['items'] as $item) {
                $variant = ProductVariant::findOrFail($item['product_variant_id']);
                
                // Increase stock
                $this->stockService->processReturn(
                    $variant,
                    $item['quantity'],
                    $warehouse,
                    $order
                );

                // If customer account exists, process refund
                if ($order->user_id) {
                    $account = CustomerAccount::where('user_id', $order->user_id)->first();
                    if ($account) {
                        $refundAmount = $item['quantity'] * $item['refund_price'] ?? $item['unit_price'];
                        
                        $this->createTransaction(
                            $account,
                            'refund',
                            $refundAmount,
                            'pos_order',
                            $order->id,
                            "Return for POS Order #{$order->order_number}"
                        );

                        $account->balance += $refundAmount;
                        $account->save();
                    }
                }
            }
        });
    }

    /**
     * Calculate payment status.
     */
    protected function calculatePaymentStatus(float $paidAmount, float $total): string
    {
        if ($paidAmount >= $total) {
            return 'paid';
        } elseif ($paidAmount > 0) {
            return 'partial';
        } else {
            return 'due';
        }
    }

    /**
     * Get today's POS sales summary.
     */
    public function getTodaySalesSummary(): array
    {
        $today = now()->startOfDay();

        $orders = PosOrder::where('created_at', '>=', $today)->with('payments')->get();

        $cashSales = $orders->filter(function ($order) {
            return $order->payments->contains('payment_method', 'cash');
        })->sum('total');

        $cardSales = $orders->filter(function ($order) {
            return $order->payments->contains('payment_method', 'card');
        })->sum('total');

        $bkashSales = $orders->filter(function ($order) {
            return $order->payments->contains('payment_method', 'bkash');
        })->sum('total');

        $nagadSales = $orders->filter(function ($order) {
            return $order->payments->contains('payment_method', 'nagad');
        })->sum('total');

        return [
            'total_orders' => $orders->count(),
            'total_sales' => $orders->sum('total'),
            'total_paid' => $orders->sum('paid_amount'),
            'total_due' => $orders->sum('due_amount'),
            'cash_sales' => $cashSales,
            'card_sales' => $cardSales,
            'bkash_sales' => $bkashSales,
            'nagad_sales' => $nagadSales,
        ];
    }

    /**
     * Get due customers summary.
     */
    public function getDueCustomersSummary(): array
    {
        $accounts = CustomerAccount::withDue()->with('user')->get();
        
        return [
            'total_due_customers' => $accounts->count(),
            'total_due_amount' => $accounts->sum('total_due'),
            'customers' => $accounts->map(function ($account) {
                return [
                    'id' => $account->user->id,
                    'name' => $account->user->name,
                    'phone' => $account->user->phone ?? null,
                    'balance' => $account->balance,
                    'total_due' => $account->total_due,
                    'credit_limit' => $account->credit_limit,
                    'available_credit' => $account->available_credit,
                ];
            }),
        ];
    }

    /**
     * Hold POS order.
     */
    public function holdOrder(PosOrder $order): void
    {
        if (!$order->canBeHeld()) {
            throw new Exception('This order cannot be held.');
        }

        $order->markAsHeld();
    }

    /**
     * Resume held POS order.
     */
    public function resumeOrder(PosOrder $order): void
    {
        if (!$order->isHeld()) {
            throw new Exception('This order is not on hold.');
        }

        $order->markAsResumed();
    }

    /**
     * Cancel POS order.
     */
    public function cancelOrder(PosOrder $order): void
    {
        DB::transaction(function () use ($order) {
            if (!$order->canBeCancelled()) {
                throw new Exception('This order cannot be cancelled.');
            }

            $warehouse = $order->warehouse;

            // Restore stock for all items
            foreach ($order->items as $item) {
                $this->stockService->processReturn(
                    $item->variant,
                    $item->quantity,
                    $warehouse,
                    $order
                );
            }

            // If it was a due sale, revert customer account
            if ($order->due_amount > 0 && $order->user_id) {
                $account = CustomerAccount::where('user_id', $order->user_id)->first();
                if ($account) {
                    $this->createTransaction(
                        $account,
                        'refund',
                        $order->due_amount,
                        'pos_order',
                        $order->id,
                        "Cancelled POS Order #{$order->order_number}"
                    );

                    $account->balance += $order->due_amount;
                    $account->total_due -= $order->due_amount;
                    $account->save();
                }
            }

            $order->markAsCancelled();
        });
    }
}
