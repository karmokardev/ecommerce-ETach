<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Warehouse::orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $warehouses = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/warehouse/index', [
            'warehouses' => $warehouses,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'per_page' => $perPage,
                'page' => $warehouses->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/warehouse/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:warehouses,code'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The warehouse name is required.',
            'code.required' => 'The warehouse code is required.',
            'code.unique' => 'This code is already in use.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        $validated['code'] = strip_tags($validated['code']);
        if (isset($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }
        if (isset($validated['manager_name'])) {
            $validated['manager_name'] = strip_tags($validated['manager_name']);
        }

        try {
            Warehouse::create($validated);

            return redirect()
                ->route('warehouses.index')
                ->with('success', 'Warehouse created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create warehouse: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {
        $warehouse->load(['purchases' => function ($query) {
            $query->with('supplier')->ordered()->limit(10);
        }, 'stockMovements' => function ($query) {
            $query->with('variant', 'variant.product')->ordered()->limit(20);
        }]);

        return inertia('admin/warehouse/show', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse)
    {
        return inertia('admin/warehouse/edit', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:warehouses,code,'.$warehouse->id],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The warehouse name is required.',
            'code.required' => 'The warehouse code is required.',
            'code.unique' => 'This code is already in use.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        $validated['code'] = strip_tags($validated['code']);
        if (isset($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }
        if (isset($validated['manager_name'])) {
            $validated['manager_name'] = strip_tags($validated['manager_name']);
        }

        try {
            $warehouse->update($validated);

            return redirect()
                ->route('warehouses.index')
                ->with('success', 'Warehouse updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update warehouse: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {
        try {
            $warehouse->delete();

            return back()->with('success', 'Warehouse deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete warehouse: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete warehouses.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:warehouses,id'],
        ]);

        try {
            $deleted = Warehouse::whereIn('id', $request->ids)->delete();

            return back()->with('success', "Successfully deleted {$deleted} warehouses.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete warehouses: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:warehouses,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = Warehouse::whereIn('id', $request->ids)->update(['status' => $request->status]);

            return back()->with('success', "Successfully updated {$updated} warehouses.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update warehouses: ' . $e->getMessage());
        }
    }

    /**
     * Toggle warehouse status.
     */
    public function toggleStatus(Warehouse $warehouse)
    {
        try {
            $newStatus = $warehouse->status === 'active' ? 'inactive' : 'active';
            $warehouse->update(['status' => $newStatus]);

            return back()->with('success', 'Warehouse status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Get warehouses for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $warehouses = Warehouse::active()->ordered()->get(['id', 'name', 'code']);

        return response()->json($warehouses);
    }
}
