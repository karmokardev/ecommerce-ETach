<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CategoryService
{
    /**
     * Get all categories as a tree structure.
     */
    public function getTree(): array
    {
        return Cache::remember('categories.tree', 3600, function () {
            return $this->buildTree(Category::root()->with('childrenRecursive')->ordered()->get());
        });
    }

    /**
     * Build tree structure from flat collection.
     */
    protected function buildTree($categories, $parentId = null): array
    {
        $tree = [];

        foreach ($categories as $category) {
            if ($category->parent_id == $parentId) {
                $children = $this->buildTree($categories, $category->id);
                $categoryArray = $category->toArray();
                $categoryArray['children'] = $children;
                $tree[] = $categoryArray;
            }
        }

        return $tree;
    }

    /**
     * Get category with its ancestors (breadcrumb).
     */
    public function getCategoryWithAncestors(int $categoryId): ?Category
    {
        return Category::with('parent')->find($categoryId);
    }

    /**
     * Create a new category.
     */
    public function create(array $data): Category
    {
        DB::beginTransaction();

        try {
            // Handle image upload
            if (isset($data['image']) && $data['image']) {
                $data['image'] = $this->uploadImage($data['image']);
            }

            $category = Category::create($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $category;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing category.
     */
    public function update(Category $category, array $data): Category
    {
        DB::beginTransaction();

        try {
            // Handle image upload
            if (isset($data['image']) && $data['image']) {
                // Delete old image
                if ($category->image) {
                    $this->deleteImage($category->image);
                }
                $data['image'] = $this->uploadImage($data['image']);
            }

            // Handle image removal
            if (isset($data['remove_image']) && $data['remove_image']) {
                if ($category->image) {
                    $this->deleteImage($category->image);
                }
                $data['image'] = null;
            }

            $category->update($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $category->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a category.
     */
    public function delete(Category $category): bool
    {
        // Check if category has children
        if ($category->hasChildren()) {
            throw new \Exception('Cannot delete category with child categories. Please delete or reassign child categories first.');
        }

        DB::beginTransaction();

        try {
            // Delete image
            if ($category->image) {
                $this->deleteImage($category->image);
            }

            $category->delete();

            // Clear cache
            $this->clearCache();

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(array $categoryIds): int
    {
        $deleted = 0;

        foreach ($categoryIds as $categoryId) {
            $category = Category::find($categoryId);
            if ($category) {
                try {
                    $this->delete($category);
                    $deleted++;
                } catch (\Exception $e) {
                    // Skip categories that can't be deleted
                    continue;
                }
            }
        }

        return $deleted;
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(array $categoryIds, string $status): int
    {
        $updated = Category::whereIn('id', $categoryIds)->update(['status' => $status]);

        // Clear cache
        $this->clearCache();

        return $updated;
    }

    /**
     * Get categories for dropdown (flat list with indentation).
     */
    public function getForDropdown(): array
    {
        $categories = Category::orderBy('sort')->get();
        $dropdown = [];

        foreach ($categories as $category) {
            $prefix = str_repeat('— ', $category->depth);
            $dropdown[$category->id] = $prefix . $category->name;
        }

        return $dropdown;
    }

    /**
     * Reorder categories.
     */
    public function reorder(array $order): bool
    {
        DB::beginTransaction();

        try {
            foreach ($order as $index => $categoryId) {
                Category::where('id', $categoryId)->update(['sort' => $index]);
            }

            // Clear cache
            $this->clearCache();

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Upload category image.
     */
    protected function uploadImage($image): string
    {
        $path = $image->store('categories', 'public');
        return $path;
    }

    /**
     * Delete category image.
     */
    protected function deleteImage(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Clear category cache.
     */
    protected function clearCache(): void
    {
        Cache::forget('categories.tree');
        Cache::forget('categories.dropdown');
    }

    /**
     * Get category statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total' => Category::count(),
            'active' => Category::where('status', 'active')->count(),
            'inactive' => Category::where('status', 'inactive')->count(),
            'root' => Category::root()->count(),
            'with_children' => Category::has('children')->count(),
        ];
    }
}
