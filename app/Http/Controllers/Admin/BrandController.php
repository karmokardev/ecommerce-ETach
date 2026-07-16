<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Services\BrandService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class BrandController extends Controller
{
    protected BrandService $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Brand::orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $brands = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $statistics = $this->brandService->getStatistics();

        return inertia('admin/brand/index', [
            'brands' => $brands,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'per_page' => $perPage,
                'page' => $brands->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/brand/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:brands,slug', 'regex:/^[a-z0-9\-]+$/'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The brand name is required.',
            'name.regex' => 'The name can only contain letters, numbers, spaces, and hyphens.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'image.image' => 'The file must be an image.',
            'image.max' => 'The image may not be greater than 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li>');
        }

        try {
            $brand = $this->brandService->create($validated);

            return redirect()
                ->route('brands.index')
                ->with('success', 'Brand created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create brand: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        return inertia('admin/brand/show', [
            'brand' => $brand,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        return inertia('admin/brand/edit', [
            'brand' => $brand,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:brands,slug,'.$brand->id, 'regex:/^[a-z0-9\-]+$/'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
            'remove_image' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'The brand name is required.',
            'name.regex' => 'The name can only contain letters, numbers, spaces, and hyphens.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'image.image' => 'The file must be an image.',
            'image.max' => 'The image may not be greater than 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li>');
        }

        try {
            $brand = $this->brandService->update($brand, $validated);

            return redirect()
                ->route('brands.index')
                ->with('success', 'Brand updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update brand: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        try {
            $this->brandService->delete($brand);

            return back()->with('success', 'Brand deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete brand: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete brands.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:brands,id'],
        ]);

        try {
            $deleted = $this->brandService->bulkDelete($request->ids);

            return back()->with('success', "Successfully deleted {$deleted} brands.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete brands: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:brands,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = $this->brandService->bulkUpdateStatus($request->ids, $request->status);

            return back()->with('success', "Successfully updated {$updated} brands.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update brands: ' . $e->getMessage());
        }
    }

    /**
     * Toggle brand status.
     */
    public function toggleStatus(Brand $brand)
    {
        try {
            $newStatus = $brand->status === 'active' ? 'inactive' : 'active';
            $brand->update(['status' => $newStatus]);
            $this->brandService->clearCache();

            return back()->with('success', 'Brand status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Reorder brands.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:brands,id'],
        ]);

        try {
            $this->brandService->reorder($request->order);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get brands for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $brands = $this->brandService->getForDropdown();

        return response()->json($brands);
    }

    /**
     * Get brand statistics.
     */
    public function statistics(): JsonResponse
    {
        $statistics = $this->brandService->getStatistics();

        return response()->json($statistics);
    }
}
