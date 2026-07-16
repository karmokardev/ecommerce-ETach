<?php

namespace App\Services;

use App\Models\AttributeValue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AttributeValueService
{
    /**
     * Get all attribute values.
     */
    public function getAll()
    {
        return AttributeValue::ordered()->get();
    }

    /**
     * Get attribute values by attribute.
     */
    public function getByAttribute(int $attributeId)
    {
        return AttributeValue::byAttribute($attributeId)->orderBy('sort')->get();
    }

    /**
     * Create a new attribute value.
     */
    public function create(array $data): AttributeValue
    {
        DB::beginTransaction();

        try {
            $attributeValue = AttributeValue::create($data);

            // Clear cache
            $this->clearCache($data['attribute_id']);

            DB::commit();

            return $attributeValue;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing attribute value.
     */
    public function update(AttributeValue $attributeValue, array $data): AttributeValue
    {
        DB::beginTransaction();

        try {
            $attributeValue->update($data);

            // Clear cache
            $this->clearCache($attributeValue->attribute_id);

            DB::commit();

            return $attributeValue->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an attribute value.
     */
    public function delete(AttributeValue $attributeValue): bool
    {
        DB::beginTransaction();

        try {
            $attributeId = $attributeValue->attribute_id;
            $attributeValue->delete();

            // Clear cache
            $this->clearCache($attributeId);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk delete attribute values.
     */
    public function bulkDelete(array $valueIds): int
    {
        $deleted = 0;

        foreach ($valueIds as $valueId) {
            $attributeValue = AttributeValue::find($valueId);
            if ($attributeValue) {
                try {
                    $this->delete($attributeValue);
                    $deleted++;
                } catch (\Exception $e) {
                    // Skip values that can't be deleted
                    continue;
                }
            }
        }

        return $deleted;
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(array $valueIds, string $status): int
    {
        $updated = AttributeValue::whereIn('id', $valueIds)->update(['status' => $status]);

        // Clear cache for affected attributes
        $attributeIds = AttributeValue::whereIn('id', $valueIds)->pluck('attribute_id')->unique();
        foreach ($attributeIds as $attributeId) {
            $this->clearCache($attributeId);
        }

        return $updated;
    }

    /**
     * Get attribute values for dropdown.
     */
    public function getForDropdown(int $attributeId): array
    {
        return Cache::remember("attribute_values.{$attributeId}.dropdown", 3600, function () use ($attributeId) {
            $values = AttributeValue::byAttribute($attributeId)->active()->orderBy('sort')->get();
            $dropdown = [];

            foreach ($values as $value) {
                $dropdown[$value->id] = $value->value;
            }

            return $dropdown;
        });
    }

    /**
     * Reorder attribute values.
     */
    public function reorder(array $order): bool
    {
        DB::beginTransaction();

        try {
            foreach ($order as $index => $valueId) {
                AttributeValue::where('id', $valueId)->update(['sort' => $index]);
            }

            // Clear cache for affected attributes
            $attributeIds = AttributeValue::whereIn('id', $order)->pluck('attribute_id')->unique();
            foreach ($attributeIds as $attributeId) {
                $this->clearCache($attributeId);
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Clear attribute value cache.
     */
    protected function clearCache(int $attributeId): void
    {
        Cache::forget("attribute_values.{$attributeId}.dropdown");
    }

    /**
     * Get attribute value statistics.
     */
    public function getStatistics(int $attributeId = null): array
    {
        $query = AttributeValue::query();
        
        if ($attributeId) {
            $query->where('attribute_id', $attributeId);
        }

        return [
            'total' => $query->count(),
            'active' => $query->clone()->where('status', 'active')->count(),
            'inactive' => $query->clone()->where('status', 'inactive')->count(),
        ];
    }
}
