<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $query = User::with('customerAccount');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter by account status
        if ($request->filled('account_status') && $request->account_status !== 'all') {
            if ($request->account_status === 'with_account') {
                $query->whereHas('customerAccount');
            } elseif ($request->account_status === 'without_account') {
                $query->whereDoesntHave('customerAccount');
            } elseif ($request->account_status === 'due') {
                $query->whereHas('customerAccount', function ($q) {
                    $q->where('balance', '<', 0);
                });
            }
        }

        $customers = $query->ordered()->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/customer/index', [
            'customers' => [
                'data' => $customers->items(),
                'links' => $customers->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $customers->currentPage(),
                    'from' => $customers->firstItem(),
                    'to' => $customers->lastItem(),
                    'total' => $customers->total(),
                    'per_page' => $customers->perPage(),
                ],
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'account_status' => $request->account_status ?? 'all',
                'per_page' => $perPage,
                'page' => $customers->currentPage(),
            ],
        ]);
    }

    /**
     * Display the specified customer.
     */
    public function show(User $customer)
    {
        $customer->load(['customerAccount', 'customerAccount.transactions' => function ($q) {
            $q->ordered()->limit(20);
        }]);

        // Get customer orders
        $posOrders = \App\Models\PosOrder::where('user_id', $customer->id)
            ->with('items')
            ->ordered()
            ->limit(10)
            ->get();

        return inertia('admin/customer/show', [
            'customer' => $customer,
            'posOrders' => $posOrders,
        ]);
    }

    /**
     * Show the form for editing the customer.
     */
    public function edit(User $customer)
    {
        $customer->load('customerAccount');

        return inertia('admin/customer/edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the customer.
     */
    public function update(Request $request, User $customer)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $customer->update($validated);

        return redirect()
            ->route('customers.show', $customer)
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Get customer statistics (API).
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_customers' => User::whereHas('roles', function ($q) {
                $q->where('name', 'customer');
            })->count(),
            'customers_with_accounts' => User::whereHas('customerAccount')->count(),
            'customers_with_due' => User::whereHas('customerAccount', function ($q) {
                $q->where('balance', '<', 0);
            })->count(),
            'total_due_amount' => CustomerAccount::where('balance', '<', 0)->sum('total_due'),
        ];

        return response()->json($stats);
    }

    /**
     * Get customers for dropdown (API).
     */
    public function dropdown(): JsonResponse
    {
        $customers = User::whereHas('roles', function ($q) {
            $q->where('name', 'customer');
        })
            ->with('customerAccount')
            ->get(['id', 'name', 'phone'])
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone' => $customer->phone,
                    'has_account' => $customer->customerAccount !== null,
                    'balance' => $customer->customerAccount?->balance ?? 0,
                ];
            });

        return response()->json($customers);
    }

    /**
     * Create customer account for user.
     */
    public function createAccount(Request $request, User $customer)
    {
        $validated = $request->validate([
            'credit_limit' => ['required', 'numeric', 'min:0'],
        ]);

        try {
            $account = \App\Services\CustomerAccountService::createAccount([
                'user_id' => $customer->id,
                'credit_limit' => $validated['credit_limit'],
                'is_active' => true,
            ]);

            return redirect()
                ->route('customers.show', $customer)
                ->with('success', 'Customer account created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create account: ' . $e->getMessage());
        }
    }
}
