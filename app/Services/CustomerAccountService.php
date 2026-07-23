<?php

namespace App\Services;

use App\Models\CustomerAccount;
use App\Models\CustomerTransaction;
use Exception;
use Illuminate\Support\Facades\DB;

class CustomerAccountService
{
    /**
     * Create a new customer account.
     */
    public function createAccount(array $data): CustomerAccount
    {
        return DB::transaction(function () use ($data) {
            // Check if account already exists
            $existing = CustomerAccount::where('user_id', $data['user_id'])->first();
            if ($existing) {
                throw new Exception('Customer account already exists for this user.');
            }

            return CustomerAccount::create([
                'user_id' => $data['user_id'],
                'balance' => 0,
                'credit_limit' => $data['credit_limit'] ?? 10000,
                'total_due' => 0,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    /**
     * Update customer account.
     */
    public function updateAccount(CustomerAccount $account, array $data): void
    {
        $account->update([
            'credit_limit' => $data['credit_limit'],
            'is_active' => $data['is_active'],
        ]);
    }

    /**
     * Toggle account status.
     */
    public function toggleAccountStatus(CustomerAccount $account): void
    {
        $account->update([
            'is_active' => !$account->is_active,
        ]);
    }

    /**
     * Create a transaction.
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
     * Process credit adjustment.
     */
    public function processCreditAdjustment(CustomerAccount $account, float $amount, string $description): void
    {
        DB::transaction(function () use ($account, $amount, $description) {
            $this->createTransaction(
                $account,
                'credit',
                $amount,
                null,
                null,
                $description
            );

            $account->balance += $amount;
            $account->save();
        });
    }

    /**
     * Process debit adjustment.
     */
    public function processDebitAdjustment(CustomerAccount $account, float $amount, string $description): void
    {
        DB::transaction(function () use ($account, $amount, $description) {
            $this->createTransaction(
                $account,
                'debit',
                $amount,
                null,
                null,
                $description
            );

            $account->balance -= $amount;
            if ($account->balance < 0) {
                $account->total_due = abs($account->balance);
            }
            $account->save();
        });
    }

    /**
     * Check if customer can make credit purchase.
     */
    public function canMakeCreditPurchase(CustomerAccount $account, float $amount): bool
    {
        if (!$account->is_active) {
            return false;
        }

        $availableCredit = $account->credit_limit + $account->balance;
        return $availableCredit >= $amount;
    }

    /**
     * Get account statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total_accounts' => CustomerAccount::count(),
            'active_accounts' => CustomerAccount::active()->count(),
            'due_accounts' => CustomerAccount::withDue()->count(),
            'total_due_amount' => CustomerAccount::withDue()->sum('total_due'),
            'total_credit_limit' => CustomerAccount::sum('credit_limit'),
            'total_balance' => CustomerAccount::sum('balance'),
        ];
    }

    /**
     * Get account details with summary.
     */
    public function getAccountSummary(CustomerAccount $account): array
    {
        $account->load(['user', 'transactions' => function ($q) {
            $q->ordered()->limit(10);
        }]);

        return [
            'account' => $account,
            'available_credit' => $account->available_credit,
            'recent_transactions' => $account->transactions,
            'transaction_count' => $account->transactions()->count(),
        ];
    }

    /**
     * Get accounts with due balance.
     */
    public function getDueAccounts(): \Illuminate\Database\Eloquent\Collection
    {
        return CustomerAccount::withDue()
            ->with('user')
            ->get()
            ->sortByDesc('total_due');
    }

    /**
     * Get overdue accounts (accounts with due for more than 30 days).
     */
    public function getOverdueAccounts(): \Illuminate\Database\Eloquent\Collection
    {
        $thirtyDaysAgo = now()->subDays(30);

        return CustomerAccount::withDue()
            ->whereHas('transactions', function ($q) use ($thirtyDaysAgo) {
                $q->where('type', 'debit')
                    ->where('created_at', '<', $thirtyDaysAgo);
            })
            ->with('user')
            ->get();
    }
}
