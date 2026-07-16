<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Supplier::orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $suppliers = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/supplier/index', [
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'per_page' => $perPage,
                'page' => $suppliers->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/supplier/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The supplier name is required.',
            'email.email' => 'The email must be a valid email address.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['company'])) {
            $validated['company'] = strip_tags($validated['company']);
        }
        if (isset($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            Supplier::create($validated);

            return redirect()
                ->route('suppliers.index')
                ->with('success', 'Supplier created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create supplier: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        $supplier->load(['purchases' => function ($query) {
            $query->with('warehouse')->ordered()->limit(10);
        }]);

        return inertia('admin/supplier/show', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        return inertia('admin/supplier/edit', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The supplier name is required.',
            'email.email' => 'The email must be a valid email address.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['company'])) {
            $validated['company'] = strip_tags($validated['company']);
        }
        if (isset($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }
        if (isset($validated['notes'])) {
            $validated['notes'] = strip_tags($validated['notes']);
        }

        try {
            $supplier->update($validated);

            return redirect()
                ->route('suppliers.index')
                ->with('success', 'Supplier updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update supplier: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        try {
            $supplier->delete();

            return back()->with('success', 'Supplier deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete supplier: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete suppliers.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:suppliers,id'],
        ]);

        try {
            $deleted = Supplier::whereIn('id', $request->ids)->delete();

            return back()->with('success', "Successfully deleted {$deleted} suppliers.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete suppliers: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:suppliers,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = Supplier::whereIn('id', $request->ids)->update(['status' => $request->status]);

            return back()->with('success', "Successfully updated {$updated} suppliers.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update suppliers: ' . $e->getMessage());
        }
    }

    /**
     * Toggle supplier status.
     */
    public function toggleStatus(Supplier $supplier)
    {
        try {
            $newStatus = $supplier->status === 'active' ? 'inactive' : 'active';
            $supplier->update(['status' => $newStatus]);

            return back()->with('success', 'Supplier status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Get suppliers for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $suppliers = Supplier::active()->ordered()->get(['id', 'name', 'company']);

        return response()->json($suppliers);
    }
}
