<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_categories_index()
    {
        Category::factory()->count(5)->create();

        $response = $this->get('/categories');

        $response->assertStatus(200);
    }

    public function test_can_create_category()
    {
        $categoryData = [
            'name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'Test description',
            'sort' => 1,
            'status' => 'active',
        ];

        $response = $this->post('/categories', $categoryData);

        $response->assertRedirect('/categories');
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    public function test_can_create_category_with_parent()
    {
        $parent = Category::factory()->create();

        $categoryData = [
            'name' => 'Child Category',
            'slug' => 'child-category',
            'parent_id' => $parent->id,
            'status' => 'active',
        ];

        $response = $this->post('/categories', $categoryData);

        $response->assertRedirect('/categories');
        $this->assertDatabaseHas('categories', [
            'name' => 'Child Category',
            'parent_id' => $parent->id,
        ]);
    }

    public function test_can_update_category()
    {
        $category = Category::factory()->create();

        $updateData = [
            'name' => 'Updated Category',
            'slug' => 'updated-category',
            'status' => 'inactive',
        ];

        $response = $this->put("/categories/{$category->id}", $updateData);

        $response->assertRedirect('/categories');
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
        ]);
    }

    public function test_can_delete_category()
    {
        $category = Category::factory()->create();

        $response = $this->delete("/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_cannot_delete_category_with_children()
    {
        $parent = Category::factory()->create();
        Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->delete("/categories/{$parent->id}");

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('categories', [
            'id' => $parent->id,
            'deleted_at' => null,
        ]);
    }

    public function test_prevent_circular_parent_relationship()
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $updateData = [
            'parent_id' => $child->id,
            'name' => 'Updated Parent',
        ];

        $response = $this->put("/categories/{$parent->id}", $updateData);

        $response->assertSessionHasErrors('parent_id');
    }

    public function test_prevent_self_parent()
    {
        $category = Category::factory()->create();

        $updateData = [
            'parent_id' => $category->id,
            'name' => 'Updated Category',
        ];

        $response = $this->put("/categories/{$category->id}", $updateData);

        $response->assertSessionHasErrors('parent_id');
    }

    public function test_slug_is_auto_generated()
    {
        $categoryData = [
            'name' => 'Auto Slug Category',
            'status' => 'active',
        ];

        $this->post('/categories', $categoryData);

        $this->assertDatabaseHas('categories', [
            'name' => 'Auto Slug Category',
            'slug' => 'auto-slug-category',
        ]);
    }

    public function test_bulk_delete_categories()
    {
        $categories = Category::factory()->count(3)->create();

        $response = $this->post('/categories/bulk-delete', [
            'ids' => $categories->pluck('id')->toArray(),
        ]);

        $response->assertRedirect();
        foreach ($categories as $category) {
            $this->assertSoftDeleted('categories', ['id' => $category->id]);
        }
    }

    public function test_bulk_update_status()
    {
        $categories = Category::factory()->count(3)->create(['status' => 'inactive']);

        $response = $this->post('/categories/bulk-status', [
            'ids' => $categories->pluck('id')->toArray(),
            'status' => 'active',
        ]);

        $response->assertRedirect();
        foreach ($categories as $category) {
            $this->assertDatabaseHas('categories', [
                'id' => $category->id,
                'status' => 'active',
            ]);
        }
    }

    public function test_toggle_status()
    {
        $category = Category::factory()->create(['status' => 'active']);

        $response = $this->patch("/categories/{$category->id}/toggle-status");

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'status' => 'inactive',
        ]);
    }

    public function test_category_tree_api()
    {
        $parent = Category::factory()->create();
        Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->get('/api/categories/tree');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'slug',
                'children',
            ],
        ]);
    }

    public function test_category_dropdown_api()
    {
        Category::factory()->count(3)->create();

        $response = $this->get('/api/categories/dropdown');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_category_statistics_api()
    {
        Category::factory()->count(5)->create(['status' => 'active']);
        Category::factory()->count(2)->create(['status' => 'inactive']);

        $response = $this->get('/api/categories/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total',
            'active',
            'inactive',
            'root',
            'with_children',
        ]);
    }

    public function test_validation_requires_name()
    {
        $categoryData = [
            'name' => '',
            'status' => 'active',
        ];

        $response = $this->post('/categories', $categoryData);

        $response->assertSessionHasErrors('name');
    }

    public function test_validation_requires_unique_slug()
    {
        Category::factory()->create(['slug' => 'unique-slug']);

        $categoryData = [
            'name' => 'Another Category',
            'slug' => 'unique-slug',
            'status' => 'active',
        ];

        $response = $this->post('/categories', $categoryData);

        $response->assertSessionHasErrors('slug');
    }

    public function test_validation_accepts_valid_status_values()
    {
        $categoryData = [
            'name' => 'Test Category',
            'status' => 'invalid-status',
        ];

        $response = $this->post('/categories', $categoryData);

        $response->assertSessionHasErrors('status');
    }
}
