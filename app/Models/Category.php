<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $parent_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $image
 * @property int $sort
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Category|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Category> $children
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Category> $childrenRecursive
 */
#[Fillable([
    'parent_id',
    'name',
    'slug',
    'description',
    'image',
    'sort',
    'status',
])]
class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'sort' => 'integer',
        ];
    }

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the children categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('sort');
    }

    /**
     * Get all descendants recursively.
     */
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug) && !empty($category->name)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Scope to get only root categories (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to get only active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search by name or slug.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to order by created_at (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get the breadcrumb path for this category.
     */
    public function getBreadcrumbAttribute(): array
    {
        $breadcrumbs = [];
        $category = $this;

        while ($category) {
            array_unshift($breadcrumbs, $category);
            $category = $category->parent;
        }

        return $breadcrumbs;
    }

    /**
     * Get the breadcrumb as a string.
     */
    public function getBreadcrumbStringAttribute(): string
    {
        return collect($this->breadcrumb)->pluck('name')->join(' > ');
    }

    /**
     * Check if category has children.
     */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    /**
     * Get the depth level of the category.
     */
    public function getDepthAttribute(): int
    {
        $depth = 0;
        $category = $this->parent;

        while ($category) {
            $depth++;
            $category = $category->parent;
        }

        return $depth;
    }

    /**
     * Check if this category is a descendant of another category.
     */
    public function isDescendantOf(Category $category): bool
    {
        $parent = $this->parent;

        while ($parent) {
            if ($parent->id === $category->id) {
                return true;
            }
            $parent = $parent->parent;
        }

        return false;
    }

    /**
     * Get all descendant IDs of this category.
     */
    public function getDescendantIds(): array
    {
        $ids = [];
        $children = $this->children;

        foreach ($children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $child->getDescendantIds());
        }

        return $ids;
    }

    /**
     * Scope to filter by category and all its descendants.
     */
    public function scopeWhereInTree($query, $categoryId)
    {
        $category = self::find($categoryId);
        if (!$category) {
            return $query;
        }

        $descendantIds = $category->getDescendantIds();
        $allIds = array_merge([$categoryId], $descendantIds);

        return $query->whereIn('id', $allIds);
    }
}
