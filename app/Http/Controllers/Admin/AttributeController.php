<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Services\AttributeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class AttributeController extends Controller
{
    protected AttributeService $attributeService;

    public function __construct(AttributeService $attributeService)
    {
        $this->attributeService = $attributeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Attribute::orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attributes = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $statistics = $this->attributeService->getStatistics();

        return inertia('admin/attribute/index', [
            'attributes' => $attributes,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'per_page' => $perPage,
                'page' => $attributes->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/attribute/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:attributes,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:attributes,slug', 'regex:/^[a-z0-9\-]+$/'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The attribute name is required.',
            'name.unique' => 'This name is already in use.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);

        try {
            $attribute = $this->attributeService->create($validated);

            return redirect()
                ->route('attributes.index')
                ->with('success', 'Attribute created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create attribute: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute)
    {
        $attribute->load('values');

        return inertia('admin/attribute/show', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribute $attribute)
    {
        return inertia('admin/attribute/edit', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:attributes,name,'.$attribute->id],
            'slug' => ['nullable', 'string', 'max:255', 'unique:attributes,slug,'.$attribute->id, 'regex:/^[a-z0-9\-]+$/'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'name.required' => 'The attribute name is required.',
            'name.unique' => 'This name is already in use.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);

        try {
            $attribute = $this->attributeService->update($attribute, $validated);

            return redirect()
                ->route('attributes.index')
                ->with('success', 'Attribute updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update attribute: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        try {
            $this->attributeService->delete($attribute);

            return back()->with('success', 'Attribute deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete attribute: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete attributes.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:attributes,id'],
        ]);

        try {
            $deleted = $this->attributeService->bulkDelete($request->ids);

            return back()->with('success', "Successfully deleted {$deleted} attributes.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete attributes: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:attributes,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = $this->attributeService->bulkUpdateStatus($request->ids, $request->status);

            return back()->with('success', "Successfully updated {$updated} attributes.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update attributes: ' . $e->getMessage());
        }
    }

    /**
     * Toggle attribute status.
     */
    public function toggleStatus(Attribute $attribute)
    {
        try {
            $newStatus = $attribute->status === 'active' ? 'inactive' : 'active';
            $attribute->update(['status' => $newStatus]);
            $this->attributeService->clearCache();

            return back()->with('success', 'Attribute status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Reorder attributes.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:attributes,id'],
        ]);

        try {
            $this->attributeService->reorder($request->order);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get attributes for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $attributes = $this->attributeService->getForDropdown();

        return response()->json($attributes);
    }

    /**
     * Get attribute statistics.
     */
    public function statistics(): JsonResponse
    {
        $statistics = $this->attributeService->getStatistics();

        return response()->json($statistics);
    }

    /**
     * Attribute values overview - shows all attributes with their values.
     */
    public function valuesOverview()
    {
        $attributes = Attribute::with('values')->orderBy('sort')->get();

        return inertia('admin/attribute-values-overview/index', [
            'attributes' => $attributes,
        ]);
    }
}
