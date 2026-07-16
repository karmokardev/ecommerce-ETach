<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductVariant::with(['product', 'product.category'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by low stock
        if ($request->filled('low_stock')) {
            $threshold = config('inventory.low_stock_threshold', 5);
            $query->where('current_stock', '<=', $threshold);
        }

        // Filter by out of stock
        if ($request->filled('out_of_stock')) {
            $query->where('current_stock', '<=', 0);
        }

        $variants = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $products = Product::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product-variant/index', [
            'variants' => $variants,
            'products' => $products,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'product_id' => $request->product_id ?? '',
                'low_stock' => $request->low_stock ?? '',
                'out_of_stock' => $request->out_of_stock ?? '',
                'per_page' => $perPage,
                'page' => $variants->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $productId = $request->input('product_id');
        $products = Product::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product-variant/create', [
            'products' => $products,
            'selected_product_id' => $productId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:255', 'unique:product_variants,sku'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:product_variants,barcode'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'current_stock' => ['nullable', 'integer', 'min:0'],
            'low_stock_alert' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'product_id.required' => 'The product is required.',
            'product_id.exists' => 'The selected product is invalid.',
            'sku.required' => 'The SKU is required.',
            'sku.unique' => 'This SKU is already in use.',
            'barcode.unique' => 'This barcode is already in use.',
            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
        ]);

        try {
            ProductVariant::create($validated);

            return redirect()
                ->route('product-variants.index')
                ->with('success', 'Product variant created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create product variant: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $variant)
    {
        $variant->load(['product', 'product.category', 'product.brand', 'stockMovements' => function ($query) {
            $query->with('warehouse')->ordered()->limit(50);
        }]);

        return inertia('admin/product-variant/show', [
            'variant' => $variant,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductVariant $variant)
    {
        $variant->load('product');
        $products = Product::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product-variant/edit', [
            'variant' => $variant,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductVariant $variant)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:255', 'unique:product_variants,sku,'.$variant->id],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:product_variants,barcode,'.$variant->id],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'current_stock' => ['nullable', 'integer', 'min:0'],
            'low_stock_alert' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'product_id.required' => 'The product is required.',
            'product_id.exists' => 'The selected product is invalid.',
            'sku.required' => 'The SKU is required.',
            'sku.unique' => 'This SKU is already in use.',
            'barcode.unique' => 'This barcode is already in use.',
            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
        ]);

        try {
            $variant->update($validated);

            return redirect()
                ->route('product-variants.index')
                ->with('success', 'Product variant updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update product variant: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductVariant $variant)
    {
        try {
            $variant->delete();

            return back()->with('success', 'Product variant deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete product variant: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete variants.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:product_variants,id'],
        ]);

        try {
            $deleted = ProductVariant::whereIn('id', $request->ids)->delete();

            return back()->with('success', "Successfully deleted {$deleted} variants.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete variants: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:product_variants,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = ProductVariant::whereIn('id', $request->ids)->update(['status' => $request->status]);

            return back()->with('success', "Successfully updated {$updated} variants.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update variants: ' . $e->getMessage());
        }
    }

    /**
     * Toggle variant status.
     */
    public function toggleStatus(ProductVariant $variant)
    {
        try {
            $newStatus = $variant->status === 'active' ? 'inactive' : 'active';
            $variant->update(['status' => $newStatus]);

            return back()->with('success', 'Variant status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Get variants for a product (API).
     */
    public function byProduct(Product $product): JsonResponse
    {
        $variants = $product->variants()->active()->ordered()->get(['id', 'sku', 'price', 'current_stock']);

        return response()->json($variants);
    }

    /**
     * Get low stock report.
     */
    public function lowStockReport(Request $request)
    {
        $threshold = $request->input('threshold', config('inventory.low_stock_threshold', 5));
        $perPage = $request->input('per_page', 15);
        
        $variants = ProductVariant::with(['product', 'product.category'])
            ->where('current_stock', '<=', $threshold)
            ->where('current_stock', '>', 0)
            ->where('status', 'active')
            ->orderBy('current_stock', 'asc')
            ->paginate($perPage);

        return inertia('admin/product-variant/low-stock', [
            'variants' => $variants,
            'threshold' => $threshold,
            'filters' => [
                'per_page' => $perPage,
                'page' => $variants->currentPage(),
            ],
        ]);
    }
}
