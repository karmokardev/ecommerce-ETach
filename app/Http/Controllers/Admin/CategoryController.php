<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = Category::with(['parent'])->orderBy('created_at', 'desc');
    $perPage = (int) $request->input('per_page', 10);

    // Search
    if ($request->filled('search')) {
        $query->search($request->search);
    }

    // Filter by status
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Filter by parent
    if ($request->filled('parent_id')) {
        if ($request->parent_id === 'null') {
            $query->whereNull('parent_id');
        } else {
            $query->whereInTree($request->parent_id);
        }
    }

    $categories = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

    $tree = $this->categoryService->getTree();
    $statistics = $this->categoryService->getStatistics();
    $allCategories = Category::ordered()->get(['id', 'name', 'parent_id', 'sort']);

    return inertia('admin/category/index', [
        'categories' => $categories,
        'tree' => $tree,
        'statistics' => $statistics,
        'allCategories' => $allCategories,
        'filters' => [
            'search' => $request->search ?? '',
            'status' => $request->status ?? '',
            'parent_id' => $request->parent_id ?? '',
            'per_page' => $perPage,
            'page' => $categories->currentPage(),
        ],
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::ordered()->get(['id', 'name', 'parent_id', 'sort']);

        return inertia('admin/category/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug', 'regex:/^[a-z0-9\-]+$/'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999', 'unique:categories,sort'],
            'status' => ['nullable', 'in:active,inactive'],
        ], [
            'parent_id.exists' => 'The selected parent category is invalid.',
            'name.required' => 'The category name is required.',
            'name.regex' => 'The name can only contain letters, numbers, spaces, and hyphens.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'image.image' => 'The file must be an image.',
            'image.max' => 'The image may not be greater than 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
            'sort.unique' => 'This sort order is already in use.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li>');
        }

        try {
            $category = $this->categoryService->create($validated);

            return redirect()
                ->route('categories.index')
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->load(['parent', 'children']);

        return inertia('admin/category/show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $category->load('parent');
        $categories = Category::where('id', '!=', $category->id)
            ->ordered()
            ->get(['id', 'name', 'parent_id']);

        return inertia('admin/category/edit', [
            'category' => $category,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id', 'not_in:'.$category->id],
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug,'.$category->id, 'regex:/^[a-z0-9\-]+$/'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'sort' => ['nullable', 'integer', 'min:0', 'max:9999', 'unique:categories,sort,'.$category->id],
            'status' => ['nullable', 'in:active,inactive'],
            'remove_image' => ['nullable', 'boolean'],
        ], [
            'parent_id.exists' => 'The selected parent category is invalid.',
            'parent_id.not_in' => 'A category cannot be its own parent.',
            'name.required' => 'The category name is required.',
            'name.regex' => 'The name can only contain letters, numbers, spaces, and hyphens.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'image.image' => 'The file must be an image.',
            'image.max' => 'The image may not be greater than 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
            'sort.unique' => 'This sort order is already in use.',
        ]);

        // Prevent circular parent relationships
        if (isset($validated['parent_id']) && $validated['parent_id']) {
            $parent = Category::find($validated['parent_id']);
            if ($parent && $parent->isDescendantOf($category)) {
                return back()
                    ->withInput()
                    ->with('error', 'Cannot set a descendant as the parent. This would create a circular reference.');
            }
        }

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li>');
        }

        try {
            $category = $this->categoryService->update($category, $validated);

            return redirect()
                ->route('categories.index')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update category: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $this->categoryService->delete($category);

            return back()->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete category: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:categories,id'],
        ]);

        try {
            $deleted = $this->categoryService->bulkDelete($request->ids);

            return back()->with('success', "Successfully deleted {$deleted} categories.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete categories: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:categories,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = $this->categoryService->bulkUpdateStatus($request->ids, $request->status);

            return back()->with('success', "Successfully updated {$updated} categories.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update categories: ' . $e->getMessage());
        }
    }

    /**
     * Toggle category status.
     */
    public function toggleStatus(Category $category)
    {
        try {
            $newStatus = $category->status === 'active' ? 'inactive' : 'active';
            $category->update(['status' => $newStatus]);
            $this->categoryService->clearCache();

            return back()->with('success', 'Category status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Reorder categories.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:categories,id'],
        ]);

        try {
            $this->categoryService->reorder($request->order);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get category tree for API.
     */
    public function tree(): JsonResponse
    {
        $tree = $this->categoryService->getTree();

        return response()->json($tree);
    }

    /**
     * Get categories for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $categories = $this->categoryService->getForDropdown();

        return response()->json($categories);
    }

    /**
     * Get category statistics.
     */
    public function statistics(): JsonResponse
    {
        $statistics = $this->categoryService->getStatistics();

        return response()->json($statistics);
    }
}
