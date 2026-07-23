<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderReturn;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items'])->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        $query->filterByStatus($request->input('status'));

        // Filter by payment status
        $query->filterByPaymentStatus($request->input('payment_status'));

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->filterByDateRange($request->date_from, $request->date_to);
        }

        $orders = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/order/index', [
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
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'items.variant', 'returns']);

        return inertia('admin/order/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::active()->with(['variants'])->ordered()->get(['id', 'name', 'slug']);

        return inertia('admin/order/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'shipping_address' => ['required', 'string'],
            'billing_address' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:cash,card,bank_transfer,online'],
            'payment_status' => ['required', 'in:pending,paid,failed,refunded'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ], [
            'customer_name.required' => 'The customer name is required.',
            'customer_email.required' => 'The customer email is required.',
            'customer_email.email' => 'The customer email must be a valid email address.',
            'shipping_address.required' => 'The shipping address is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $shippingCost = 0;
            $tax = 0;
            $discount = 0;
            $total = $subtotal + $shippingCost + $tax - $discount;

            $order = Order::create([
                'user_id' => $validated['user_id'] ?? null,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'] ?? null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $variant = null;
                $sku = null;
                $attributes = null;

                if (!empty($item['product_variant_id'])) {
                    $variant = ProductVariant::find($item['product_variant_id']);
                    $sku = $variant->sku ?? null;
                    $attributes = $variant->attributes ?? null;
                }

                $subtotalItem = $item['quantity'] * $item['unit_price'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'product_name' => $product->name,
                    'product_sku' => $sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $subtotalItem,
                    'product_attributes' => $attributes,
                ]);
            }

            return redirect()
                ->route('orders.index')
                ->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'shipping_address' => ['required', 'string'],
            'billing_address' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:cash,card,bank_transfer,online'],
            'payment_status' => ['required', 'in:pending,paid,failed,refunded'],
            'notes' => ['nullable', 'string'],
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $order->update([
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'] ?? null,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'notes' => $validated['notes'] ?? null,
            ]);

            return back()->with('success', 'Order updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update order: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        try {
            $order->delete();

            return back()->with('success', 'Order deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete order: ' . $e->getMessage());
        }
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        try {
            $order->status = $validated['status'];

            // Update timestamps based on status
            if ($validated['status'] === 'shipped' && !$order->shipped_date) {
                $order->shipped_date = now();
            } elseif ($validated['status'] === 'delivered' && !$order->delivered_date) {
                $order->delivered_date = now();
            } elseif ($validated['status'] === 'cancelled' && !$order->cancelled_date) {
                $order->cancelled_date = now();
            }

            $order->save();

            return back()->with('success', 'Order status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update order status: ' . $e->getMessage());
        }
    }

    /**
     * Update payment status.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => ['required', 'in:pending,paid,failed,refunded'],
        ]);

        try {
            $order->payment_status = $validated['payment_status'];
            $order->save();

            return back()->with('success', 'Payment status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update payment status: ' . $e->getMessage());
        }
    }

    /**
     * Generate invoice.
     */
    public function invoice(Order $order)
    {
        $order->load(['user', 'items.product', 'items.variant']);

        // In a real application, you would generate a PDF here
        // For now, we'll return the view data
        return inertia('admin/order/invoice', [
            'order' => $order,
        ]);
    }

    /**
     * Generate packing slip.
     */
    public function packingSlip(Order $order)
    {
        $order->load(['items.product', 'items.variant']);

        // In a real application, you would generate a PDF here
        // For now, we'll return the view data
        return inertia('admin/order/packing-slip', [
            'order' => $order,
        ]);
    }

    /**
     * Get products for dropdown (API).
     */
    public function products(): JsonResponse
    {
        $products = Product::active()
            ->with(['variants' => function ($query) {
                $query->select('id', 'product_id', 'sku', 'price', 'current_stock');
            }])
            ->ordered()
            ->get(['id', 'name', 'slug']);

        return response()->json($products);
    }

    /**
     * Get product variant details (API).
     */
    public function variantDetails(ProductVariant $variant): JsonResponse
    {
        $variant->load('product');

        return response()->json($variant);
    }

    /**
     * Get order statistics for dashboard.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::pending()->count(),
            'processing_orders' => Order::processing()->count(),
            'shipped_orders' => Order::shipped()->count(),
            'delivered_orders' => Order::delivered()->count(),
            'cancelled_orders' => Order::cancelled()->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'today_revenue' => Order::where('payment_status', 'paid')
                ->whereDate('created_at', today())
                ->sum('total'),
            'this_week_revenue' => Order::where('payment_status', 'paid')
                ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->sum('total'),
            'this_month_revenue' => Order::where('payment_status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total'),
        ];

        return response()->json($stats);
    }
}
