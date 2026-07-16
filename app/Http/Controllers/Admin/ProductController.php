<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'variants'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by featured
        if ($request->filled('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        $products = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        $categories = Category::active()->ordered()->get(['id', 'name']);
        $brands = Brand::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'category_id' => $request->category_id ?? '',
                'brand_id' => $request->brand_id ?? '',
                'is_featured' => $request->is_featured ?? '',
                'per_page' => $perPage,
                'page' => $products->currentPage(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::active()->ordered()->get(['id', 'name']);
        $brands = Brand::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product/create', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug', 'regex:/^[a-z0-9\-]+$/'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'status' => ['nullable', 'in:active,inactive'],
            'is_featured' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'attribute_values' => ['nullable', 'array'],
            'attribute_values.*' => ['exists:attribute_values,id'],
        ], [
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The selected category is invalid.',
            'brand_id.exists' => 'The selected brand is invalid.',
            'name.required' => 'The product name is required.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'thumbnail.image' => 'The thumbnail must be an image.',
            'thumbnail.max' => 'The thumbnail may not be greater than 2MB.',
            'images.*.image' => 'Each image must be an image file.',
            'images.*.max' => 'Each image may not be greater than 2MB.',
            'attribute_values.*.exists' => 'One or more selected attribute values are invalid.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['short_description'])) {
            $validated['short_description'] = strip_tags($validated['short_description']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li><h1><h2><h3><h4><h5><h6>');
        }

        try {
            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('products/thumbnails', 'public');
                $validated['thumbnail'] = $thumbnailPath;
            }

            $product = Product::create($validated);

            // Handle multiple images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $imagePath = $image->store('products/images', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imagePath,
                        'sort' => $index,
                    ]);
                }
            }

            // Attach attribute values
            if (!empty($validated['attribute_values'])) {
                $product->attributeValues()->attach($validated['attribute_values']);
            }

            return redirect()
                ->route('products.index')
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'brand', 'images', 'variants', 'attributeValues']);

        return inertia('admin/product/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['category', 'brand', 'images', 'attributeValues']);
        $categories = Category::active()->ordered()->get(['id', 'name']);
        $brands = Brand::active()->ordered()->get(['id', 'name']);

        return inertia('admin/product/edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,'.$product->id, 'regex:/^[a-z0-9\-]+$/'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'status' => ['nullable', 'in:active,inactive'],
            'is_featured' => ['nullable', 'boolean'],
            'remove_thumbnail' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'attribute_values' => ['nullable', 'array'],
            'attribute_values.*' => ['exists:attribute_values,id'],
        ], [
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The selected category is invalid.',
            'brand_id.exists' => 'The selected brand is invalid.',
            'name.required' => 'The product name is required.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug can only contain lowercase letters, numbers, and hyphens.',
            'thumbnail.image' => 'The thumbnail must be an image.',
            'thumbnail.max' => 'The thumbnail may not be greater than 2MB.',
            'images.*.image' => 'Each image must be an image file.',
            'images.*.max' => 'Each image may not be greater than 2MB.',
            'attribute_values.*.exists' => 'One or more selected attribute values are invalid.',
        ]);

        // Sanitize input
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['short_description'])) {
            $validated['short_description'] = strip_tags($validated['short_description']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description'], '<p><br><strong><em><ul><ol><li><h1><h2><h3><h4><h5><h6>');
        }

        try {
            // Handle thumbnail removal
            if ($request->boolean('remove_thumbnail')) {
                $validated['thumbnail'] = null;
            }

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('products/thumbnails', 'public');
                $validated['thumbnail'] = $thumbnailPath;
            }

            $product->update($validated);

            // Handle new images
            if ($request->hasFile('images')) {
                $currentMaxSort = $product->images()->max('sort') ?? 0;
                foreach ($request->file('images') as $index => $image) {
                    $imagePath = $image->store('products/images', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imagePath,
                        'sort' => $currentMaxSort + $index + 1,
                    ]);
                }
            }

            // Sync attribute values
            if (isset($validated['attribute_values'])) {
                $product->attributeValues()->sync($validated['attribute_values']);
            }

            return redirect()
                ->route('products.index')
                ->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return back()->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete products.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:products,id'],
        ]);

        try {
            $deleted = Product::whereIn('id', $request->ids)->delete();

            return back()->with('success', "Successfully deleted {$deleted} products.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete products: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:products,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $updated = Product::whereIn('id', $request->ids)->update(['status' => $request->status]);

            return back()->with('success', "Successfully updated {$updated} products.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update products: ' . $e->getMessage());
        }
    }

    /**
     * Toggle product status.
     */
    public function toggleStatus(Product $product)
    {
        try {
            $newStatus = $product->status === 'active' ? 'inactive' : 'active';
            $product->update(['status' => $newStatus]);

            return back()->with('success', 'Product status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Product $product)
    {
        try {
            $product->update(['is_featured' => !$product->is_featured]);

            return back()->with('success', 'Product featured status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update featured status: ' . $e->getMessage());
        }
    }

    /**
     * Delete product image.
     */
    public function deleteImage(ProductImage $image)
    {
        try {
            $image->delete();

            return back()->with('success', 'Image deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete image: ' . $e->getMessage());
        }
    }

    /**
     * Reorder product images.
     */
    public function reorderImages(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:product_images,id'],
        ]);

        try {
            foreach ($request->order as $index => $imageId) {
                ProductImage::where('id', $imageId)->update(['sort' => $index]);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get products for dropdown.
     */
    public function dropdown(): JsonResponse
    {
        $products = Product::active()->ordered()->get(['id', 'name', 'slug']);

        return response()->json($products);
    }
}
