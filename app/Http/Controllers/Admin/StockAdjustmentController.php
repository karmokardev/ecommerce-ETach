<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\StockAdjustment;
use App\Models\Warehouse;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
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
        $query = StockAdjustment::with(['warehouse', 'variant', 'variant.product'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Filter by adjustment type
        if ($request->filled('adjustment_type')) {
            $query->where('adjustment_type', $request->adjustment_type);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $adjustments = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-adjustment/index', [
            'adjustments' => $adjustments,
            'warehouses' => $warehouses,
            'filters' => [
                'warehouse_id' => $request->warehouse_id ?? '',
                'adjustment_type' => $request->adjustment_type ?? '',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $adjustments->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-adjustment/create', [
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'adjustment_type' => ['required', 'in:increase,decrease'],
            'quantity' => ['required', 'integer', 'min:1'],
            'before_stock' => ['required', 'integer', 'min:0'],
            'after_stock' => ['required', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ], [
            'warehouse_id.required' => 'The warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse is invalid.',
            'product_variant_id.required' => 'The product variant is required.',
            'product_variant_id.exists' => 'The selected variant is invalid.',
            'adjustment_type.required' => 'The adjustment type is required.',
            'quantity.required' => 'The quantity is required.',
            'quantity.min' => 'The quantity must be at least 1.',
            'before_stock.required' => 'The before stock is required.',
            'after_stock.required' => 'The after stock is required.',
        ]);

        // Sanitize input
        if (isset($validated['reason'])) {
            $validated['reason'] = strip_tags($validated['reason']);
        }
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $warehouse = Warehouse::find($validated['warehouse_id']);
            $variant = ProductVariant::find($validated['product_variant_id']);

            // Create stock adjustment record
            $adjustment = StockAdjustment::create([
                'warehouse_id' => $validated['warehouse_id'],
                'product_variant_id' => $validated['product_variant_id'],
                'adjustment_type' => $validated['adjustment_type'],
                'quantity' => $validated['quantity'],
                'before_stock' => $validated['before_stock'],
                'after_stock' => $validated['after_stock'],
                'reason' => $validated['reason'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Process stock adjustment
            $this->stockService->processAdjustment(
                $variant,
                $validated['quantity'],
                $validated['adjustment_type'],
                $warehouse,
                $validated['reason'] ?? null,
                $validated['notes'] ?? null
            );

            return redirect()
                ->route('stock-adjustments.index')
                ->with('success', 'Stock adjustment created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create stock adjustment: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StockAdjustment $adjustment)
    {
        $adjustment->load(['warehouse', 'variant', 'variant.product', 'variant.product.category']);

        return inertia('admin/stock-adjustment/show', [
            'adjustment' => $adjustment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockAdjustment $adjustment)
    {
        $adjustment->load(['warehouse', 'variant']);
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-adjustment/edit', [
            'adjustment' => $adjustment,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockAdjustment $adjustment)
    {
        $validated = $request->validate([
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'adjustment_type' => ['required', 'in:increase,decrease'],
            'quantity' => ['required', 'integer', 'min:1'],
            'before_stock' => ['required', 'integer', 'min:0'],
            'after_stock' => ['required', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ], [
            'warehouse_id.required' => 'The warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse is invalid.',
            'product_variant_id.required' => 'The product variant is required.',
            'product_variant_id.exists' => 'The selected variant is invalid.',
            'adjustment_type.required' => 'The adjustment type is required.',
            'quantity.required' => 'The quantity is required.',
            'quantity.min' => 'The quantity must be at least 1.',
            'before_stock.required' => 'The before stock is required.',
            'after_stock.required' => 'The after stock is required.',
        ]);

        // Sanitize input
        if (isset($validated['reason'])) {
            $validated['reason'] = strip_tags($validated['reason']);
        }
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $warehouse = Warehouse::find($validated['warehouse_id']);
            $variant = ProductVariant::find($validated['product_variant_id']);

            // Update stock adjustment record
            $adjustment->update([
                'warehouse_id' => $validated['warehouse_id'],
                'product_variant_id' => $validated['product_variant_id'],
                'adjustment_type' => $validated['adjustment_type'],
                'quantity' => $validated['quantity'],
                'before_stock' => $validated['before_stock'],
                'after_stock' => $validated['after_stock'],
                'reason' => $validated['reason'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Note: We don't re-process stock on edit to avoid double adjustments
            // Stock adjustments should be deleted and recreated if needed

            return redirect()
                ->route('stock-adjustments.index')
                ->with('success', 'Stock adjustment updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update stock adjustment: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockAdjustment $adjustment)
    {
        try {
            $adjustment->delete();

            return back()->with('success', 'Stock adjustment deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete stock adjustment: ' . $e->getMessage());
        }
    }

    /**
     * Get product variants for dropdown (API).
     */
    public function variants(): \Illuminate\Http\JsonResponse
    {
        $variants = ProductVariant::with(['product'])
            ->active()
            ->ordered()
            ->get(['id', 'sku', 'current_stock', 'product_id']);

        return response()->json($variants);
    }
}
