<?php

namespace App\Services;

use App\Models\Attribute;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AttributeService
{
    /**
     * Get all attributes.
     */
    public function getAll()
    {
        return Attribute::ordered()->get();
    }

    /**
     * Create a new attribute.
     */
    public function create(array $data): Attribute
    {
        DB::beginTransaction();

        try {
            $attribute = Attribute::create($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $attribute;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing attribute.
     */
    public function update(Attribute $attribute, array $data): Attribute
    {
        DB::beginTransaction();

        try {
            $attribute->update($data);

            // Clear cache
            $this->clearCache();

            DB::commit();

            return $attribute->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an attribute.
     */
    public function delete(Attribute $attribute): bool
    {
        DB::beginTransaction();

        try {
            $attribute->delete();

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
     * Bulk delete attributes.
     */
    public function bulkDelete(array $attributeIds): int
    {
        $deleted = 0;

        foreach ($attributeIds as $attributeId) {
            $attribute = Attribute::find($attributeId);
            if ($attribute) {
                try {
                    $this->delete($attribute);
                    $deleted++;
                } catch (\Exception $e) {
                    // Skip attributes that can't be deleted
                    continue;
                }
            }
        }

        return $deleted;
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(array $attributeIds, string $status): int
    {
        $updated = Attribute::whereIn('id', $attributeIds)->update(['status' => $status]);

        // Clear cache
        $this->clearCache();

        return $updated;
    }

    /**
     * Get attributes for dropdown.
     */
    public function getForDropdown(): array
    {
        return Cache::remember('attributes.dropdown', 3600, function () {
            $attributes = Attribute::active()->orderBy('sort')->get();
            $dropdown = [];

            foreach ($attributes as $attribute) {
                $dropdown[$attribute->id] = $attribute->name;
            }

            return $dropdown;
        });
    }

    /**
     * Reorder attributes.
     */
    public function reorder(array $order): bool
    {
        DB::beginTransaction();

        try {
            foreach ($order as $index => $attributeId) {
                Attribute::where('id', $attributeId)->update(['sort' => $index]);
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
     * Clear attribute cache.
     */
    protected function clearCache(): void
    {
        Cache::forget('attributes.dropdown');
    }

    /**
     * Get attribute statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total' => Attribute::count(),
            'active' => Attribute::where('status', 'active')->count(),
            'inactive' => Attribute::where('status', 'inactive')->count(),
        ];
    }
}
