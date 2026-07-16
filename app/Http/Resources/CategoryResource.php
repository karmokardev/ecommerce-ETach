<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read \App\Models\Category $resource
 */
class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'sort' => $this->sort,
            'status' => $this->status,
            'depth' => $this->depth,
            'breadcrumb' => $this->breadcrumb_string,
            'has_children' => $this->hasChildren(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'children_recursive' => CategoryResource::collection($this->whenLoaded('childrenRecursive')),
            'parent' => CategoryResource::make($this->whenLoaded('parent')),
        ];
    }
}
