<?php

namespace Tests\Unit;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_has_parent_relationship()
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $this->assertEquals($parent->id, $child->parent->id);
        $this->assertEquals($parent->name, $child->parent->name);
    }

    public function test_category_has_children_relationship()
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $this->assertCount(1, $parent->children);
        $this->assertEquals($child->id, $parent->children->first()->id);
    }

    public function test_category_has_recursive_children_relationship()
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);
        $grandchild = Category::factory()->create(['parent_id' => $child->id]);

        $parent->load('childrenRecursive');

        $this->assertTrue($parent->childrenRecursive->contains($child));
        $this->assertTrue($child->childrenRecursive->contains($grandchild));
    }

    public function test_root_scope_returns_only_root_categories()
    {
        Category::factory()->create(); // Root
        $parent = Category::factory()->create(); // Root
        Category::factory()->create(['parent_id' => $parent->id]); // Child

        $rootCategories = Category::root()->get();

        $this->assertCount(2, $rootCategories);
        $this->assertTrue($rootCategories->every(fn ($cat) => $cat->parent_id === null));
    }

    public function test_active_scope_returns_only_active_categories()
    {
        Category::factory()->count(3)->create(['status' => 'active']);
        Category::factory()->count(2)->create(['status' => 'inactive']);

        $activeCategories = Category::active()->get();

        $this->assertCount(3, $activeCategories);
        $this->assertTrue($activeCategories->every(fn ($cat) => $cat->status === 'active'));
    }

    public function test_search_scope_searches_name_and_slug()
    {
        Category::factory()->create(['name' => 'Electronics', 'slug' => 'electronics']);
        Category::factory()->create(['name' => 'Clothing', 'slug' => 'clothing']);
        Category::factory()->create(['name' => 'Electronic Devices', 'slug' => 'electronic-devices']);

        $results = Category::search('electronic')->get();

        $this->assertCount(2, $results);
    }

    public function test_ordered_scope_orders_by_sort()
    {
        Category::factory()->create(['name' => 'Third', 'sort' => 3]);
        Category::factory()->create(['name' => 'First', 'sort' => 1]);
        Category::factory()->create(['name' => 'Second', 'sort' => 2]);

        $ordered = Category::ordered()->get();

        $this->assertEquals('First', $ordered[0]->name);
        $this->assertEquals('Second', $ordered[1]->name);
        $this->assertEquals('Third', $ordered[2]->name);
    }

    public function test_breadcrumb_attribute_returns_ancestors()
    {
        $root = Category::factory()->create(['name' => 'Root']);
        $child = Category::factory()->create(['name' => 'Child', 'parent_id' => $root->id]);
        $grandchild = Category::factory()->create(['name' => 'Grandchild', 'parent_id' => $child->id]);

        $breadcrumb = $grandchild->breadcrumb;

        $this->assertCount(3, $breadcrumb);
        $this->assertEquals($root->id, $breadcrumb[0]->id);
        $this->assertEquals($child->id, $breadcrumb[1]->id);
        $this->assertEquals($grandchild->id, $breadcrumb[2]->id);
    }

    public function test_breadcrumb_string_attribute_returns_formatted_string()
    {
        $root = Category::factory()->create(['name' => 'Electronics']);
        $child = Category::factory()->create(['name' => 'Mobile', 'parent_id' => $root->id]);
        $grandchild = Category::factory()->create(['name' => 'Android', 'parent_id' => $child->id]);

        $breadcrumbString = $grandchild->breadcrumb_string;

        $this->assertEquals('Electronics > Mobile > Android', $breadcrumbString);
    }

    public function test_has_children_returns_true_when_category_has_children()
    {
        $parent = Category::factory()->create();
        Category::factory()->create(['parent_id' => $parent->id]);

        $this->assertTrue($parent->hasChildren());
    }

    public function test_has_children_returns_false_when_category_has_no_children()
    {
        $category = Category::factory()->create();

        $this->assertFalse($category->hasChildren());
    }

    public function test_depth_attribute_calculates_correct_depth()
    {
        $root = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $root->id]);
        $grandchild = Category::factory()->create(['parent_id' => $child->id]);

        $this->assertEquals(0, $root->depth);
        $this->assertEquals(1, $child->depth);
        $this->assertEquals(2, $grandchild->depth);
    }

    public function test_is_descendant_of_detects_descendant()
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);
        $grandchild = Category::factory()->create(['parent_id' => $child->id]);

        $this->assertTrue($grandchild->isDescendantOf($parent));
        $this->assertTrue($grandchild->isDescendantOf($child));
        $this->assertFalse($parent->isDescendantOf($grandchild));
    }

    public function test_is_descendant_of_returns_false_for_unrelated_categories()
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();

        $this->assertFalse($category1->isDescendantOf($category2));
        $this->assertFalse($category2->isDescendantOf($category1));
    }

    public function test_slug_is_generated_on_creation()
    {
        $category = Category::factory()->create(['name' => 'Test Category Name']);

        $this->assertEquals('test-category-name', $category->slug);
    }

    public function test_fillable_attributes_are_correct()
    {
        $category = new Category();

        $expectedFillable = [
            'parent_id',
            'name',
            'slug',
            'description',
            'image',
            'icon',
            'sort',
            'status',
        ];

        $this->assertEquals($expectedFillable, $category->getFillable());
    }

    public function test_uses_soft_deletes()
    {
        $category = Category::factory()->create();
        $category->delete();

        $this->assertSoftDeleted('categories', ['id' => $category->id]);
        $this->assertNull(Category::find($category->id));
        $this->assertNotNull(Category::withTrashed()->find($category->id));
    }
}
