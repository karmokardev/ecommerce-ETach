<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use App\Models\DueCollection;
use App\Models\User;
use App\Services\PosService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class DueCollectionController extends Controller
{
    protected PosService $posService;

    public function __construct(PosService $posService)
    {
        $this->posService = $posService;
    }

    /**
     * Display a listing of due collections.
     */
    public function index(Request $request)
    {
        $query = DueCollection::with(['user', 'collector'])->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Filter by payment method
        if ($request->filled('payment_method') && $request->payment_method !== 'all') {
            $query->where('payment_method', $request->payment_method);
        }

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to . ' 23:59:59'
            ]);
        }

        $collections = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/due-collection/index', [
            'collections' => $collections,
            'filters' => [
                'payment_method' => $request->payment_method ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $collections->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new collection.
     */
    public function create()
    {
        $dueCustomers = CustomerAccount::withDue()
            ->with('user')
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->user->id,
                    'name' => $account->user->name,
                    'phone' => $account->user->phone ?? null,
                    'balance' => $account->balance,
                    'total_due' => $account->total_due,
                    'credit_limit' => $account->credit_limit,
                    'available_credit' => $account->available_credit,
                ];
            });

        return inertia('admin/due-collection/create', [
            'dueCustomers' => $dueCustomers,
        ]);
    }

    /**
     * Store a newly created collection.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'in:cash,card,bkash,nagad'],
            'transaction_id' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        try {
            // Process payment through PosService
            $transaction = $this->posService->processPayment(
                $validated['user_id'],
                $validated['amount'],
                $validated['payment_method'],
                auth()->id(),
                $validated['notes'] ?? null
            );

            // Create due collection record
            DueCollection::create([
                'user_id' => $validated['user_id'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'transaction_id' => $validated['transaction_id'] ?? null,
                'collected_by' => auth()->id(),
                'notes' => $validated['notes'] ?? null,
            ]);

            return redirect()
                ->route('due-collections.index')
                ->with('success', 'Payment collected successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to collect payment: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified collection.
     */
    public function show(DueCollection $collection)
    {
        $collection->load(['user', 'collector']);

        return inertia('admin/due-collection/show', [
            'collection' => $collection,
        ]);
    }

    /**
     * Get customer due details (API).
     */
    public function customerDueDetails(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $account = CustomerAccount::with('user')->where('user_id', $validated['user_id'])->firstOrFail();

        return response()->json([
            'customer' => [
                'id' => $account->user->id,
                'name' => $account->user->name,
                'phone' => $account->user->phone ?? null,
                'email' => $account->user->email,
            ],
            'account' => [
                'balance' => $account->balance,
                'total_due' => $account->total_due,
                'credit_limit' => $account->credit_limit,
                'available_credit' => $account->available_credit,
                'last_payment_date' => $account->last_payment_date,
            ],
        ]);
    }

    /**
     * Get collection statistics (API).
     */
    public function statistics(): JsonResponse
    {
        $today = now()->startOfDay();
        
        $collections = DueCollection::where('created_at', '>=', $today)->get();
        
        $stats = [
            'today_collections' => $collections->count(),
            'today_collected_amount' => $collections->sum('amount'),
            'cash_collections' => $collections->where('payment_method', 'cash')->sum('amount'),
            'card_collections' => $collections->where('payment_method', 'card')->sum('amount'),
            'bkash_collections' => $collections->where('payment_method', 'bkash')->sum('amount'),
            'nagad_collections' => $collections->where('payment_method', 'nagad')->sum('amount'),
            'total_due_customers' => CustomerAccount::withDue()->count(),
            'total_due_amount' => CustomerAccount::withDue()->sum('total_due'),
        ];

        return response()->json($stats);
    }

    /**
     * Get due customers list (API).
     */
    public function dueCustomers(): JsonResponse
    {
        $customers = CustomerAccount::withDue()
            ->with('user')
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->user->id,
                    'name' => $account->user->name,
                    'phone' => $account->user->phone ?? null,
                    'balance' => $account->balance,
                    'total_due' => $account->total_due,
                    'credit_limit' => $account->credit_limit,
                    'available_credit' => $account->available_credit,
                ];
            });

        return response()->json($customers);
    }
}
