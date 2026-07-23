<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlashSaleController extends Controller
{
    /**
     * Display a listing of flash sales.
     */
    public function index(Request $request)
    {
        $query = FlashSale::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->status === 'active') {
            $query->active();
        } elseif ($request->status === 'upcoming') {
            $query->upcoming();
        } elseif ($request->status === 'expired') {
            $query->expired();
        }

        $flashSales = $query->withCount('products')->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/flash-sales/index', [
            'flashSales' => $flashSales,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new flash sale.
     */
    public function create()
    {
        return Inertia::render('admin/flash-sales/create');
    }

    /**
     * Store a newly created flash sale.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'is_active' => 'boolean',
            'priority' => 'integer|min:0',
        ]);

        $flashSale = FlashSale::create($validated);

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale created successfully.');
    }

    /**
     * Display the specified flash sale.
     */
    public function show(FlashSale $flashSale)
    {
        $flashSale->load('products.product', 'products.variant');

        return Inertia::render('admin/flash-sales/show', [
            'flashSale' => $flashSale,
        ]);
    }

    /**
     * Show the form for editing the specified flash sale.
     */
    public function edit(FlashSale $flashSale)
    {
        $flashSale->load('products.product', 'products.variant');

        return Inertia::render('admin/flash-sales/edit', [
            'flashSale' => $flashSale,
        ]);
    }

    /**
     * Update the specified flash sale.
     */
    public function update(Request $request, FlashSale $flashSale)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'is_active' => 'boolean',
            'priority' => 'integer|min:0',
        ]);

        $flashSale->update($validated);

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale updated successfully.');
    }

    /**
     * Remove the specified flash sale.
     */
    public function destroy(FlashSale $flashSale)
    {
        $flashSale->delete();

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale deleted successfully.');
    }

    /**
     * Toggle flash sale status.
     */
    public function toggleStatus(FlashSale $flashSale)
    {
        $flashSale->update(['is_active' => !$flashSale->is_active]);

        return back()->with('success', 'Flash sale status updated successfully.');
    }

    /**
     * Add product to flash sale.
     */
    public function addProduct(Request $request, FlashSale $flashSale)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'original_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock_limit' => 'nullable|integer|min:1',
        ]);

        $flashSale->products()->create($validated);

        return back()->with('success', 'Product added to flash sale successfully.');
    }

    /**
     * Remove product from flash sale.
     */
    public function removeProduct(FlashSale $flashSale, FlashSaleProduct $flashSaleProduct)
    {
        $flashSaleProduct->delete();

        return back()->with('success', 'Product removed from flash sale successfully.');
    }
}
