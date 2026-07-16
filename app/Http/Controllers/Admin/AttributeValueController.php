<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Services\AttributeValueService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class AttributeValueController extends Controller
{
    protected AttributeValueService $attributeValueService;

    public function __construct(AttributeValueService $attributeValueService)
    {
        $this->attributeValueService = $attributeValueService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Attribute $attribute)
    {
        $query = $attribute->values()->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $values = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
        $statistics = $this->attributeValueService->getStatistics($attribute->id);

        return inertia('admin/attribute-value/index', [
            'attribute' => $attribute,
            'values' => $values,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'per_page' => $perPage,
                'page' => $values->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Attribute $attribute)
    {
        return inertia('admin/attribute-value/create', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Attribute $attribute)
    {
        $validated = $request->validate([
            'value' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-]+$/'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'value.required' => 'The attribute value is required.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
        ]);

        // Check for unique slug within the same attribute
        if (!empty($validated['slug'])) {
            $exists = AttributeValue::where('attribute_id', $attribute->id)
                ->where('slug', $validated['slug'])
                ->exists();
            
            if ($exists) {
                return back()
                    ->withInput()
                    ->with('error', 'This slug is already in use for this attribute.');
            }
        }

        // Sanitize input
        $validated['value'] = strip_tags($validated['value']);
        $validated['attribute_id'] = $attribute->id;

        try {
            $attributeValue = $this->attributeValueService->create($validated);

            return redirect()
                ->route('attributes.values.index', $attribute->id)
                ->with('success', 'Attribute value created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create attribute value: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute, AttributeValue $attributeValue)
    {
        return inertia('admin/attribute-value/show', [
            'attribute' => $attribute,
            'value' => $attributeValue,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribute $attribute, AttributeValue $attributeValue)
    {
        return inertia('admin/attribute-value/edit', [
            'attribute' => $attribute,
            'value' => $attributeValue,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute, AttributeValue $attributeValue)
    {
        $validated = $request->validate([
            'value' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-]+$/'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'value.required' => 'The attribute value is required.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
        ]);

        // Check for unique slug within the same attribute (excluding current record)
        if (!empty($validated['slug'])) {
            $exists = AttributeValue::where('attribute_id', $attribute->id)
                ->where('slug', $validated['slug'])
                ->where('id', '!=', $attributeValue->id)
                ->exists();
            
            if ($exists) {
                return back()
                    ->withInput()
                    ->with('error', 'This slug is already in use for this attribute.');
            }
        }

        // Sanitize input
        $validated['value'] = strip_tags($validated['value']);

        try {
            $attributeValue = $this->attributeValueService->update($attributeValue, $validated);

            return redirect()
                ->route('attributes.values.index', $attribute->id)
                ->with('success', 'Attribute value updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update attribute value: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute, AttributeValue $attributeValue)
    {
        try {
            $this->attributeValueService->delete($attributeValue);

            return back()->with('success', 'Attribute value deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete attribute value: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete attribute values.
     */
    public function bulkDelete(Request $request, Attribute $attribute)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:attribute_values,id'],
        ]);

        try {
            $deleted = $this->attributeValueService->bulkDelete($request->ids);

            return back()->with('success', "Successfully deleted {$deleted} attribute values.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete attribute values: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request, Attribute $attribute)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:attribute_values,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = $this->attributeValueService->bulkUpdateStatus($request->ids, $request->status);

            return back()->with('success', "Successfully updated {$updated} attribute values.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update attribute values: ' . $e->getMessage());
        }
    }

    /**
     * Toggle attribute value status.
     */
    public function toggleStatus(Attribute $attribute, AttributeValue $attributeValue)
    {
        try {
            $newStatus = $attributeValue->status === 'active' ? 'inactive' : 'active';
            $attributeValue->update(['status' => $newStatus]);
            $this->attributeValueService->clearCache($attribute->id);

            return back()->with('success', 'Attribute value status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Reorder attribute values.
     */
    public function reorder(Request $request, Attribute $attribute)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:attribute_values,id'],
        ]);

        try {
            $this->attributeValueService->reorder($request->order);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get attribute values for dropdown.
     */
    public function dropdown(Attribute $attribute): JsonResponse
    {
        $values = $this->attributeValueService->getForDropdown($attribute->id);

        return response()->json($values);
    }

    /**
     * Get attribute value statistics.
     */
    public function statistics(Attribute $attribute): JsonResponse
    {
        $statistics = $this->attributeValueService->getStatistics($attribute->id);

        return response()->json($statistics);
    }
}
