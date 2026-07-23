<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PosOrder;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\PosService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class PosController extends Controller
{
    protected PosService $posService;

    public function __construct(PosService $posService)
    {
        $this->posService = $posService;
    }

    /**
     * Display POS interface.
     */
    public function index()
    {
        $products = Product::active()
            ->with(['variants' => function ($query) {
                $query->where('current_stock', '>', 0);
            }])
            ->ordered()
            ->get(['id', 'name', 'slug']);

        $customers = User::whereHas('customerAccount')
            ->with('customerAccount')
            ->get(['id', 'name', 'phone', 'email']);

        $todaySales = $this->posService->getTodaySalesSummary();
        $dueCustomers = $this->posService->getDueCustomersSummary();

        return inertia('admin/pos/index', [
            'products' => $products,
            'customers' => $customers,
            'todaySales' => $todaySales,
            'dueCustomers' => $dueCustomers,
        ]);
    }

    /**
     * Display a listing of POS orders.
     */
    public function orders(Request $request)
    {
        $query = PosOrder::with(['user', 'warehouse', 'creator'])->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to . ' 23:59:59'
            ]);
        }

        $orders = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/pos/orders', [
            'orders' => $orders,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'payment_status' => $request->payment_status ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $orders->currentPage(),
            ],
        ]);
    }

    /**
     * Display the specified POS order.
     */
    public function show(PosOrder $order)
    {
        $order->load(['user', 'warehouse', 'creator', 'items.variant.product', 'payments.receiver']);

        return inertia('admin/pos/show', [
            'order' => $order,
        ]);
    }

    /**
     * Store a newly created POS order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'due_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'payments' => ['nullable', 'array'],
            'payments.*.amount' => ['required', 'numeric', 'min:0'],
            'payments.*.payment_method' => ['required', 'in:cash,card,bkash,nagad,due'],
            'payments.*.transaction_id' => ['nullable', 'string'],
            'payments.*.notes' => ['nullable', 'string'],
        ], [
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $order = $this->posService->createOrder($validated, auth()->id());

            return redirect()
                ->route('pos.show', $order)
                ->with('success', 'POS order created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create POS order: ' . $e->getMessage());
        }
    }

    /**
     * Hold a POS order.
     */
    public function hold(PosOrder $order)
    {
        try {
            $this->posService->holdOrder($order);

            return back()->with('success', 'POS order placed on hold successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to hold order: ' . $e->getMessage());
        }
    }

    /**
     * Resume a held POS order.
     */
    public function resume(PosOrder $order)
    {
        try {
            $this->posService->resumeOrder($order);

            return back()->with('success', 'POS order resumed successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to resume order: ' . $e->getMessage());
        }
    }

    /**
     * Cancel a POS order.
     */
    public function cancel(PosOrder $order)
    {
        try {
            $this->posService->cancelOrder($order);

            return back()->with('success', 'POS order cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to cancel order: ' . $e->getMessage());
        }
    }

    /**
     * Process customer payment.
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'in:cash,card,bkash,nagad'],
            'notes' => ['nullable', 'string'],
        ]);

        try {
            $transaction = $this->posService->processPayment(
                $validated['user_id'],
                $validated['amount'],
                $validated['payment_method'],
                auth()->id(),
                $validated['notes'] ?? null
            );

            return back()->with('success', 'Payment processed successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to process payment: ' . $e->getMessage());
        }
    }

    /**
     * Get product variant details (API).
     */
    public function variantDetails(ProductVariant $variant): JsonResponse
    {
        $variant->load(['product', 'product.category']);

        return response()->json($variant);
    }

    /**
     * Search products (API).
     */
    public function searchProducts(Request $request): JsonResponse
    {
        $search = $request->input('search');

        $products = Product::active()
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->with(['variants' => function ($query) {
                $query->where('current_stock', '>', 0);
            }])
            ->limit(20)
            ->get(['id', 'name', 'slug', 'sku']);

        return response()->json($products);
    }

    /**
     * Get POS statistics (API).
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'today_orders' => PosOrder::whereDate('created_at', today())->count(),
            'today_sales' => PosOrder::whereDate('created_at', today())->sum('total'),
            'today_paid' => PosOrder::whereDate('created_at', today())->sum('paid_amount'),
            'today_due' => PosOrder::whereDate('created_at', today())->sum('due_amount'),
            'total_due_customers' => \App\Models\CustomerAccount::withDue()->count(),
            'total_due_amount' => \App\Models\CustomerAccount::withDue()->sum('total_due'),
            'recent_orders' => PosOrder::with(['user', 'items'])
                ->ordered()
                ->limit(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}
