<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ShippingZoneController extends Controller
{
    /**
     * Show the form for creating a new shipping zone.
     */
    public function create()
    {
        return inertia('admin/shipping/zones/create');
    }

    /**
     * Display a listing of shipping zones.
     */
    public function index(Request $request)
    {
        $query = ShippingZone::query();

        // Filter by active status
        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        }

        $zones = $query->orderBy('name')->get();

        return inertia('admin/shipping/zones/index', [
            'zones' => $zones,
            'filters' => [
                'active' => $request->boolean('active'),
            ],
        ]);
    }

    /**
     * Store a newly created shipping zone.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:shipping_zones,code'],
            'districts' => ['required', 'array', 'min:1'],
            'districts.*' => ['string', 'max:255'],
            'areas' => ['nullable', 'array'],
            'areas.*' => ['string', 'max:255'],
            'base_rate' => ['required', 'numeric', 'min:0'],
            'additional_rate' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        try {
            ShippingZone::create($validated);

            return back()->with('success', 'Shipping zone created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create shipping zone: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified shipping zone.
     */
    public function update(Request $request, ShippingZone $zone)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:shipping_zones,code,' . $zone->id],
            'districts' => ['required', 'array', 'min:1'],
            'districts.*' => ['string', 'max:255'],
            'areas' => ['nullable', 'array'],
            'areas.*' => ['string', 'max:255'],
            'base_rate' => ['required', 'numeric', 'min:0'],
            'additional_rate' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        try {
            $zone->update($validated);

            return back()->with('success', 'Shipping zone updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update shipping zone: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified shipping zone.
     */
    public function destroy(ShippingZone $zone)
    {
        try {
            $zone->delete();

            return back()->with('success', 'Shipping zone deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete shipping zone: ' . $e->getMessage());
        }
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(ShippingZone $zone)
    {
        try {
            $zone->update(['is_active' => !$zone->is_active]);

            return back()->with('success', 'Shipping zone status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update shipping zone status: ' . $e->getMessage());
        }
    }

    /**
     * Get active shipping zones for API.
     */
    public function active(): JsonResponse
    {
        $zones = ShippingZone::active()->orderBy('name')->get();

        return response()->json($zones);
    }

    /**
     * Find zone by district.
     */
    public function findByDistrict(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'district' => ['required', 'string'],
        ]);

        $zone = ShippingZone::active()->byDistrict($validated['district'])->first();

        return response()->json($zone);
    }

    /**
     * Calculate shipping rate for a zone.
     */
    public function calculateRate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'zone_id' => ['required', 'exists:shipping_zones,id'],
            'base_cost' => ['nullable', 'numeric', 'min:0'],
        ]);

        $zone = ShippingZone::find($validated['zone_id']);
        $rate = $zone->calculateRate($validated['base_cost'] ?? 0);

        return response()->json([
            'rate' => $rate,
            'zone_name' => $zone->name,
        ]);
    }
}
