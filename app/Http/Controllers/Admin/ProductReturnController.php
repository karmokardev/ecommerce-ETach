<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PosOrder;
use App\Models\ProductReturn;
use App\Models\ProductVariant;
use App\Services\ReturnService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ProductReturnController extends Controller
{
    protected ReturnService $returnService;

    public function __construct(ReturnService $returnService)
    {
        $this->returnService = $returnService;
    }

    /**
     * Display a listing of returns.
     */
    public function index(Request $request)
    {
        $query = ProductReturn::with(['user', 'items.variant', 'approver'])->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by order type
        if ($request->filled('order_type') && $request->order_type !== 'all') {
            $query->where('order_type', $request->order_type);
        }

        $returns = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/product-return/index', [
            'returns' => $returns,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'order_type' => $request->order_type ?? 'all',
                'per_page' => $perPage,
                'page' => $returns->currentPage(),
            ],
        ]);
    }

    /**
     * Display the specified return.
     */
    public function show(ProductReturn $return)
    {
        $return->load(['user', 'items.variant.product', 'approver', 'creator']);

        // Load order details based on order type
        if ($return->order_type === 'pos_order') {
            $return->load(['posOrder' => function ($q) {
                $q->with('items');
            }]);
        } elseif ($return->order_type === 'online_order') {
            $return->load(['order' => function ($q) {
                $q->with('items');
            }]);
        }

        return inertia('admin/product-return/show', [
            'return' => $return,
        ]);
    }

    /**
     * Show the form for creating a new return.
     */
    public function create(Request $request)
    {
        $orderType = $request->input('order_type', 'pos_order');
        $orderId = $request->input('order_id');

        $order = null;
        if ($orderId) {
            if ($orderType === 'pos_order') {
                $order = PosOrder::with(['items.variant', 'user'])->findOrFail($orderId);
            } else {
                $order = Order::with(['items.variant', 'user'])->findOrFail($orderId);
            }
        }

        return inertia('admin/product-return/create', [
            'order' => $order,
            'order_type' => $orderType,
        ]);
    }

    /**
     * Store a newly created return.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_type' => ['required', 'in:pos_order,online_order'],
            'order_id' => ['required', 'integer'],
            'user_id' => ['nullable', 'exists:users,id'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'reason' => ['required', 'string'],
            'return_type' => ['required', 'in:refund,exchange'],
            'refund_method' => ['required', 'in:original,bank,bkash,store_credit'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.refund_price' => ['required', 'numeric', 'min:0'],
            'items.*.condition' => ['required', 'in:new,used,damaged'],
            'items.*.notes' => ['nullable', 'string'],
        ]);

        try {
            $return = $this->returnService->createReturn($validated, auth()->id());

            return redirect()
                ->route('product-returns.show', $return)
                ->with('success', 'Return request created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create return: ' . $e->getMessage());
        }
    }

    /**
     * Approve a return.
     */
    public function approve(ProductReturn $return)
    {
        try {
            $this->returnService->approveReturn($return, auth()->id());

            return back()->with('success', 'Return approved successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve return: ' . $e->getMessage());
        }
    }

    /**
     * Reject a return.
     */
    public function reject(Request $request, ProductReturn $return)
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string'],
        ]);

        try {
            $this->returnService->rejectReturn($return, auth()->id(), $validated['reason'] ?? null);

            return back()->with('success', 'Return rejected successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reject return: ' . $e->getMessage());
        }
    }

    /**
     * Complete a return.
     */
    public function complete(ProductReturn $return)
    {
        try {
            $this->returnService->completeReturn($return);

            return back()->with('success', 'Return completed successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to complete return: ' . $e->getMessage());
        }
    }

    /**
     * Get order details for return creation (API).
     */
    public function orderDetails(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_type' => ['required', 'in:pos_order,online_order'],
            'order_id' => ['required', 'integer'],
        ]);

        if ($validated['order_type'] === 'pos_order') {
            $order = PosOrder::with(['items.variant', 'user'])->findOrFail($validated['order_id']);
        } else {
            $order = Order::with(['items.variant', 'user'])->findOrFail($validated['order_id']);
        }

        return response()->json($order);
    }

    /**
     * Get return statistics (API).
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->returnService->getReturnStatistics();

        return response()->json($stats);
    }
}
