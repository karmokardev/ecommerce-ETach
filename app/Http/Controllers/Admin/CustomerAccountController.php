<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use App\Models\CustomerTransaction;
use App\Models\User;
use App\Services\CustomerAccountService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CustomerAccountController extends Controller
{
    protected CustomerAccountService $customerAccountService;

    public function __construct(CustomerAccountService $customerAccountService)
    {
        $this->customerAccountService = $customerAccountService;
    }

    /**
     * Display a listing of customer accounts.
     */
    public function index(Request $request)
    {
        $query = CustomerAccount::with('user')->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'due') {
                $query->withDue();
            }
        }

        $accounts = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/customer-account/index', [
            'accounts' => [
                'data' => $accounts->items(),
                'links' => $accounts->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $accounts->currentPage(),
                    'from' => $accounts->firstItem(),
                    'to' => $accounts->lastItem(),
                    'total' => $accounts->total(),
                    'per_page' => $accounts->perPage(),
                ],
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'per_page' => $perPage,
                'page' => $accounts->currentPage(),
            ],
        ]);
    }

    /**
     * Display the specified customer account.
     */
    public function show(CustomerAccount $account)
    {
        $account->load(['user', 'transactions' => function ($q) {
            $q->ordered();
        }]);

        return inertia('admin/customer-account/show', [
            'account' => $account,
        ]);
    }

    /**
     * Show the form for editing the customer account.
     */
    public function edit(CustomerAccount $account)
    {
        $account->load('user');

        return inertia('admin/customer-account/edit', [
            'account' => $account,
        ]);
    }

    /**
     * Update the customer account.
     */
    public function update(Request $request, CustomerAccount $account)
    {
        $validated = $request->validate([
            'credit_limit' => ['required', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        try {
            $this->customerAccountService->updateAccount($account, $validated);

            return redirect()
                ->route('customer-accounts.show', $account)
                ->with('success', 'Customer account updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update account: ' . $e->getMessage());
        }
    }

    /**
     * Create a new customer account.
     */
    public function create(Request $request)
    {
        $userId = $request->input('user_id');
        $user = $userId ? User::findOrFail($userId) : null;

        return inertia('admin/customer-account/create', [
            'user' => $user,
        ]);
    }

    /**
     * Store a new customer account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'credit_limit' => ['required', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        try {
            $account = $this->customerAccountService->createAccount($validated);

            return redirect()
                ->route('customer-accounts.show', $account)
                ->with('success', 'Customer account created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create account: ' . $e->getMessage());
        }
    }

    /**
     * Get account statistics (API).
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->customerAccountService->getStatistics();

        return response()->json($stats);
    }

    /**
     * Get account transactions (API).
     */
    public function transactions(CustomerAccount $account): JsonResponse
    {
        $transactions = $account->transactions()->ordered()->get();

        return response()->json($transactions);
    }

    /**
     * Block/Unblock customer account.
     */
    public function toggleStatus(CustomerAccount $account)
    {
        try {
            $this->customerAccountService->toggleAccountStatus($account);

            return back()->with('success', 'Account status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }
}
