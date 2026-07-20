<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Warehouse;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTransferController extends Controller
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
        $query = StockTransfer::with(['fromWarehouse', 'toWarehouse', 'items'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by from warehouse
        if ($request->filled('from_warehouse_id')) {
            $query->where('from_warehouse_id', $request->from_warehouse_id);
        }

        // Filter by to warehouse
        if ($request->filled('to_warehouse_id')) {
            $query->where('to_warehouse_id', $request->to_warehouse_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('transfer_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('transfer_date', '<=', $request->date_to);
        }

        $transfers = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-transfer/index', [
            'transfers' => $transfers,
            'warehouses' => $warehouses,
            'filters' => [
                'status' => $request->status ?? '',
                'from_warehouse_id' => $request->from_warehouse_id ?? '',
                'to_warehouse_id' => $request->to_warehouse_id ?? '',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $transfers->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-transfer/create', [
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'transfer_no' => ['required', 'string', 'unique:stock_transfers,transfer_no'],
            'from_warehouse_id' => ['required', 'exists:warehouses,id', 'different:to_warehouse_id'],
            'to_warehouse_id' => ['required', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'transfer_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,completed'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'transfer_no.required' => 'The transfer number is required.',
            'transfer_no.unique' => 'The transfer number must be unique.',
            'from_warehouse_id.required' => 'The source warehouse is required.',
            'from_warehouse_id.exists' => 'The selected source warehouse is invalid.',
            'from_warehouse_id.different' => 'Source and destination warehouses must be different.',
            'to_warehouse_id.required' => 'The destination warehouse is required.',
            'to_warehouse_id.exists' => 'The selected destination warehouse is invalid.',
            'to_warehouse_id.different' => 'Source and destination warehouses must be different.',
            'transfer_date.required' => 'The transfer date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_variant_id.required' => 'The product variant is required for each item.',
            'items.*.product_variant_id.exists' => 'One or more selected variants are invalid.',
            'items.*.quantity.required' => 'The quantity is required for each item.',
            'items.*.quantity.min' => 'The quantity must be at least 1.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $transfer = StockTransfer::create([
                'transfer_no' => $validated['transfer_no'],
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'transfer_date' => $validated['transfer_date'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'] ?? 'pending',
            ]);

            // Create transfer items
            foreach ($validated['items'] as $item) {
                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Process stock transfer if status is completed
            if ($transfer->status === 'completed') {
                $this->stockService->processTransfer($transfer);
            }

            return redirect()
                ->route('stock-transfers.index')
                ->with('success', 'Stock transfer created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create stock transfer: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StockTransfer $transfer)
    {
        $transfer->load(['fromWarehouse', 'toWarehouse', 'items.variant', 'items.variant.product']);

        return inertia('admin/stock-transfer/show', [
            'transfer' => $transfer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockTransfer $transfer)
    {
        if ($transfer->status === 'completed') {
            return back()->with('error', 'Cannot edit a completed transfer.');
        }

        $transfer->load(['items.variant']);
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return inertia('admin/stock-transfer/edit', [
            'transfer' => $transfer,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockTransfer $transfer)
    {
        if ($transfer->status === 'completed') {
            return back()->with('error', 'Cannot edit a completed transfer.');
        }

        $validated = $request->validate([
            'transfer_no' => ['required', 'string', 'unique:stock_transfers,transfer_no,' . $transfer->id],
            'from_warehouse_id' => ['required', 'exists:warehouses,id', 'different:to_warehouse_id'],
            'to_warehouse_id' => ['required', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'transfer_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,completed'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'transfer_no.required' => 'The transfer number is required.',
            'transfer_no.unique' => 'The transfer number must be unique.',
            'from_warehouse_id.required' => 'The source warehouse is required.',
            'from_warehouse_id.exists' => 'The selected source warehouse is invalid.',
            'from_warehouse_id.different' => 'Source and destination warehouses must be different.',
            'to_warehouse_id.required' => 'The destination warehouse is required.',
            'to_warehouse_id.exists' => 'The selected destination warehouse is invalid.',
            'to_warehouse_id.different' => 'Source and destination warehouses must be different.',
            'transfer_date.required' => 'The transfer date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_variant_id.required' => 'The product variant is required for each item.',
            'items.*.product_variant_id.exists' => 'One or more selected variants are invalid.',
            'items.*.quantity.required' => 'The quantity is required for each item.',
            'items.*.quantity.min' => 'The quantity must be at least 1.',
        ]);

        // Sanitize input
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $transfer->update([
                'transfer_no' => $validated['transfer_no'],
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'transfer_date' => $validated['transfer_date'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'] ?? 'pending',
            ]);

            // Delete existing items
            $transfer->items()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Process stock transfer if status is completed
            if ($transfer->status === 'completed') {
                $this->stockService->processTransfer($transfer);
            }

            return redirect()
                ->route('stock-transfers.index')
                ->with('success', 'Stock transfer updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update stock transfer: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockTransfer $transfer)
    {
        if ($transfer->status === 'completed') {
            return back()->with('error', 'Cannot delete a completed transfer.');
        }

        try {
            $transfer->delete();

            return back()->with('success', 'Stock transfer deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete stock transfer: ' . $e->getMessage());
        }
    }

    /**
     * Complete a stock transfer (process stock).
     */
    public function complete(StockTransfer $transfer)
    {
        if ($transfer->status === 'completed') {
            return back()->with('error', 'Transfer is already completed.');
        }

        try {
            $transfer->update(['status' => 'completed']);
            $this->stockService->processTransfer($transfer);

            return back()->with('success', 'Stock transfer completed successfully. Stock has been updated.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to complete stock transfer: ' . $e->getMessage());
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
