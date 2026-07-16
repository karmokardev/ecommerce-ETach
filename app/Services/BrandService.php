<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BrandService
{
    /**
     * Get all brands.
     */
    public function getAll()
    {
        return Brand::ordered()->get();
    }

    /**
     * Create a new brand.
     */
    public function create(array $data): Brand
    {
        DB::beginTransaction();

        try {
            // Handle image upload
            if (isset($data['image']) && $data['image']) {
                $data['image'] = $this->uploadImage($data['image']);
            }

            $brand = Brand::create($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $brand;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing brand.
     */
    public function update(Brand $brand, array $data): Brand
    {
        DB::beginTransaction();

        try {
            // Handle image upload
            if (isset($data['image']) && $data['image']) {
                // Delete old image
                if ($brand->image) {
                    $this->deleteImage($brand->image);
                }
                $data['image'] = $this->uploadImage($data['image']);
            }

            // Handle image removal
            if (isset($data['remove_image']) && $data['remove_image']) {
                if ($brand->image) {
                    $this->deleteImage($brand->image);
                }
                $data['image'] = null;
            }

            $brand->update($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $brand->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a brand.
     */
    public function delete(Brand $brand): bool
    {
        DB::beginTransaction();

        try {
            // Delete image
            if ($brand->image) {
                $this->deleteImage($brand->image);
            }

            $brand->delete();

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
     * Bulk delete brands.
     */
    public function bulkDelete(array $brandIds): int
    {
        $deleted = 0;

        foreach ($brandIds as $brandId) {
            $brand = Brand::find($brandId);
            if ($brand) {
                try {
                    $this->delete($brand);
                    $deleted++;
                } catch (\Exception $e) {
                    // Skip brands that can't be deleted
                    continue;
                }
            }
        }

        return $deleted;
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(array $brandIds, string $status): int
    {
        $updated = Brand::whereIn('id', $brandIds)->update(['status' => $status]);

        // Clear cache
        $this->clearCache();

        return $updated;
    }

    /**
     * Get brands for dropdown.
     */
    public function getForDropdown(): array
    {
        return Cache::remember('brands.dropdown', 3600, function () {
            $brands = Brand::active()->orderBy('sort')->get();
            $dropdown = [];

            foreach ($brands as $brand) {
                $dropdown[$brand->id] = $brand->name;
            }

            return $dropdown;
        });
    }

    /**
     * Reorder brands.
     */
    public function reorder(array $order): bool
    {
        DB::beginTransaction();

        try {
            foreach ($order as $index => $brandId) {
                Brand::where('id', $brandId)->update(['sort' => $index]);
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
     * Upload brand image.
     */
    protected function uploadImage($image): string
    {
        $path = $image->store('brands', 'public');
        return $path;
    }

    /**
     * Delete brand image.
     */
    protected function deleteImage(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Clear brand cache.
     */
    protected function clearCache(): void
    {
        Cache::forget('brands.dropdown');
    }

    /**
     * Get brand statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total' => Brand::count(),
            'active' => Brand::where('status', 'active')->count(),
            'inactive' => Brand::where('status', 'inactive')->count(),
        ];
    }
}
