<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons.
     */
    public function index(Request $request)
    {
        $query = Coupon::query();

        if ($request->search) {
            $query->where('code', 'like', "%{$request->search}%")
                ->orWhere('description', 'like', "%{$request->search}%");
        }

        if ($request->status === 'active') {
            $query->active();
        } elseif ($request->status === 'expired') {
            $query->expired();
        } elseif ($request->status === 'upcoming') {
            $query->upcoming();
        }

        $coupons = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/coupons/index', [
            'coupons' => $coupons,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new coupon.
     */
    public function create()
    {
        return Inertia::render('admin/coupons/create');
    }

    /**
     * Store a newly created coupon.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'maximum_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        Coupon::create($validated);

        return redirect()->route('coupons.index')->with('success', 'Coupon created successfully.');
    }

    /**
     * Display the specified coupon.
     */
    public function show(Coupon $coupon)
    {
        return Inertia::render('admin/coupons/show', [
            'coupon' => $coupon,
        ]);
    }

    /**
     * Show the form for editing the specified coupon.
     */
    public function edit(Coupon $coupon)
    {
        return Inertia::render('admin/coupons/edit', [
            'coupon' => $coupon,
        ]);
    }

    /**
     * Update the specified coupon.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id . '|max:50',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'maximum_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $coupon->update($validated);

        return redirect()->route('coupons.index')->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified coupon.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('coupons.index')->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Toggle coupon status.
     */
    public function toggleStatus(Coupon $coupon)
    {
        $coupon->update(['is_active' => !$coupon->is_active]);

        return back()->with('success', 'Coupon status updated successfully.');
    }
}
