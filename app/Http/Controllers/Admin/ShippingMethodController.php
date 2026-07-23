<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ShippingMethodController extends Controller
{
    /**
     * Show the form for creating a new shipping method.
     */
    public function create()
    {
        return inertia('admin/shipping/methods/create');
    }

    /**
     * Show the form for editing the specified shipping method.
     */
    public function edit(ShippingMethod $method)
    {
        return inertia('admin/shipping/methods/edit', [
            'method' => $method,
        ]);
    }

    /**
     * Display a listing of shipping methods.
     */
    public function index(Request $request)
    {
        $query = ShippingMethod::ordered();

        // Filter by courier
        if ($request->filled('courier')) {
            $query->byCourier($request->courier);
        }

        // Filter by active status
        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        }

        $methods = $query->get();

        return inertia('admin/shipping/methods/index', [
            'methods' => $methods,
            'filters' => [
                'courier' => $request->courier ?? 'all',
                'active' => $request->boolean('active'),
            ],
        ]);
    }

    /**
     * Store a newly created shipping method.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'courier' => ['required', 'in:pathao,redx,steadfast,sundarban,custom'],
            'base_cost' => ['required', 'numeric', 'min:0'],
            'cost_per_weight' => ['required', 'numeric', 'min:0'],
            'cost_per_item' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_order_amount' => ['nullable', 'numeric', 'min:0'],
            'estimated_delivery_days' => ['required', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer'],
            'settings' => ['nullable', 'array'],
        ]);

        // Filter out empty settings values
        if (isset($validated['settings']) && is_array($validated['settings'])) {
            $validated['settings'] = array_filter($validated['settings'], function($value) {
                return !empty($value) && $value !== '';
            });
            
            // If settings array is empty after filtering, set to null
            if (empty($validated['settings'])) {
                $validated['settings'] = null;
            }
        }

        try {
            ShippingMethod::create($validated);

            return back()->with('success', 'Shipping method created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create shipping method: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified shipping method.
     */
    public function update(Request $request, ShippingMethod $method)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'courier' => ['required', 'in:pathao,redx,steadfast,sundarban,custom'],
            'base_cost' => ['required', 'numeric', 'min:0'],
            'cost_per_weight' => ['required', 'numeric', 'min:0'],
            'cost_per_item' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_order_amount' => ['nullable', 'numeric', 'min:0'],
            'estimated_delivery_days' => ['required', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer'],
            'settings' => ['nullable', 'array'],
        ]);

        // Filter out empty settings values
        if (isset($validated['settings']) && is_array($validated['settings'])) {
            $validated['settings'] = array_filter($validated['settings'], function($value) {
                return !empty($value) && $value !== '';
            });
            
            // If settings array is empty after filtering, set to null
            if (empty($validated['settings'])) {
                $validated['settings'] = null;
            }
        }

        try {
            $method->update($validated);

            return back()->with('success', 'Shipping method updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update shipping method: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified shipping method.
     */
    public function destroy(ShippingMethod $method)
    {
        try {
            $method->delete();

            return back()->with('success', 'Shipping method deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete shipping method: ' . $e->getMessage());
        }
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(ShippingMethod $method)
    {
        try {
            $method->update(['is_active' => !$method->is_active]);

            return back()->with('success', 'Shipping method status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update shipping method status: ' . $e->getMessage());
        }
    }

    /**
     * Get active shipping methods for API.
     */
    public function active(): JsonResponse
    {
        $methods = ShippingMethod::active()->ordered()->get();

        return response()->json($methods);
    }

    /**
     * Calculate shipping cost for an order.
     */
    public function calculateCost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'method_id' => ['required', 'exists:shipping_methods,id'],
            'order_amount' => ['required', 'numeric', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'item_count' => ['nullable', 'integer', 'min:0'],
        ]);

        $method = ShippingMethod::find($validated['method_id']);
        $cost = $method->calculateCost(
            $validated['order_amount'],
            $validated['weight'] ?? 0,
            $validated['item_count'] ?? 0
        );

        return response()->json([
            'cost' => $cost,
            'method_name' => $method->name,
            'estimated_days' => $method->estimated_delivery_days,
        ]);
    }
}
