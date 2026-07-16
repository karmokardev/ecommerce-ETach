<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\ProductVariant;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'warehouse', 'items'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by supplier
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('purchase_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_date', '<=', $request->date_to);
        }

        $purchases = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        $suppliers = Supplier::active()->ordered()->get(['id', 'name', 'company']);
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/purchase/index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'supplier_id' => $request->supplier_id ?? '',
                'warehouse_id' => $request->warehouse_id ?? '',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $purchases->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::active()->ordered()->get(['id', 'name', 'company']);
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/purchase/create', [
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'invoice_no' => ['required', 'string', 'max:255', 'unique:purchases,invoice_no'],
            'purchase_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,completed'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ], [
            'supplier_id.required' => 'The supplier is required.',
            'supplier_id.exists' => 'The selected supplier is invalid.',
            'warehouse_id.required' => 'The warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse is invalid.',
            'invoice_no.required' => 'The invoice number is required.',
            'invoice_no.unique' => 'This invoice number is already in use.',
            'purchase_date.required' => 'The purchase date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_variant_id.required' => 'The product variant is required for each item.',
            'items.*.product_variant_id.exists' => 'One or more selected variants are invalid.',
            'items.*.quantity.required' => 'The quantity is required for each item.',
            'items.*.quantity.min' => 'The quantity must be at least 1.',
            'items.*.unit_cost.required' => 'The unit cost is required for each item.',
            'items.*.unit_cost.min' => 'The unit cost must be at least 0.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'invoice_no' => $validated['invoice_no'],
                'purchase_date' => $validated['purchase_date'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'] ?? 'draft',
            ]);

            // Create purchase items
            foreach ($validated['items'] as $item) {
                $subtotal = $item['quantity'] * $item['unit_cost'];
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $subtotal,
                ]);
            }

            // Process stock if status is completed
            if ($purchase->status === 'completed') {
                $this->stockService->processPurchase($purchase);
            }

            return redirect()
                ->route('purchases.index')
                ->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create purchase: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'warehouse', 'items.variant', 'items.variant.product']);

        return inertia('admin/purchase/show', [
            'purchase' => $purchase,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        if ($purchase->status === 'completed') {
            return back()->with('error', 'Cannot edit a completed purchase.');
        }

        $purchase->load(['items.variant']);
        $suppliers = Supplier::active()->ordered()->get(['id', 'name', 'company']);
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/purchase/edit', [
            'purchase' => $purchase,
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        if ($purchase->status === 'completed') {
            return back()->with('error', 'Cannot edit a completed purchase.');
        }

        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'invoice_no' => ['required', 'string', 'max:255', 'unique:purchases,invoice_no,'.$purchase->id],
            'purchase_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,completed'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ], [
            'supplier_id.required' => 'The supplier is required.',
            'supplier_id.exists' => 'The selected supplier is invalid.',
            'warehouse_id.required' => 'The warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse is invalid.',
            'invoice_no.required' => 'The invoice number is required.',
            'invoice_no.unique' => 'This invoice number is already in use.',
            'purchase_date.required' => 'The purchase date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_variant_id.required' => 'The product variant is required for each item.',
            'items.*.product_variant_id.exists' => 'One or more selected variants are invalid.',
            'items.*.quantity.required' => 'The quantity is required for each item.',
            'items.*.quantity.min' => 'The quantity must be at least 1.',
            'items.*.unit_cost.required' => 'The unit cost is required for each item.',
            'items.*.unit_cost.min' => 'The unit cost must be at least 0.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'invoice_no' => $validated['invoice_no'],
                'purchase_date' => $validated['purchase_date'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'] ?? 'draft',
            ]);

            // Delete existing items
            $purchase->items()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                $subtotal = $item['quantity'] * $item['unit_cost'];
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $subtotal,
                ]);
            }

            // Process stock if status is completed
            if ($purchase->status === 'completed') {
                $this->stockService->processPurchase($purchase);
            }

            return redirect()
                ->route('purchases.index')
                ->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update purchase: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        if ($purchase->status === 'completed') {
            return back()->with('error', 'Cannot delete a completed purchase.');
        }

        try {
            $purchase->delete();

            return back()->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete purchase: ' . $e->getMessage());
        }
    }

    /**
     * Complete a purchase (process stock).
     */
    public function complete(Purchase $purchase)
    {
        if ($purchase->status === 'completed') {
            return back()->with('error', 'Purchase is already completed.');
        }

        try {
            $purchase->update(['status' => 'completed']);
            $this->stockService->processPurchase($purchase);

            return back()->with('success', 'Purchase completed successfully. Stock has been updated.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to complete purchase: ' . $e->getMessage());
        }
    }

    /**
     * Get product variants for dropdown (API).
     */
    public function variants(): JsonResponse
    {
        $variants = ProductVariant::with(['product'])
            ->active()
            ->ordered()
            ->get(['id', 'sku', 'price', 'current_stock', 'product_id']);

        return response()->json($variants);
    }
}
