<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_wishlist_index()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->get('/wishlist');

        $response->assertStatus(200);
    }

    public function test_can_add_product_to_wishlist()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);

        $response = $this->withoutMiddleware()->post('/wishlist', [
            'product_id' => $product->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_can_add_product_variant_to_wishlist()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'name' => 'Test Variant',
            'sku' => 'TEST-SKU',
            'price' => 99.99,
            'current_stock' => 10,
        ]);

        $response = $this->withoutMiddleware()->post('/wishlist', [
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $this->user->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
        ]);
    }

    public function test_cannot_add_duplicate_product_to_wishlist()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->withoutMiddleware()->post('/wishlist', [
            'product_id' => $product->id,
        ]);

        $response->assertStatus(409);
    }

    public function test_can_remove_product_from_wishlist()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        $wishlist = Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->withoutMiddleware()->delete("/wishlist/{$wishlist->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('wishlists', [
            'id' => $wishlist->id,
        ]);
    }

    public function test_cannot_remove_other_users_wishlist_item()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        $otherUser = User::factory()->create();
        $wishlist = Wishlist::create([
            'user_id' => $otherUser->id,
            'product_id' => $product->id,
        ]);

        $response = $this->withoutMiddleware()->delete("/wishlist/{$wishlist->id}");

        $response->assertStatus(404);
    }

    public function test_can_get_wishlist_count()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->get('/wishlist/count');

        $response->assertStatus(200);
        $response->assertJson(['count' => 1]);
    }

    public function test_can_clear_wishlist()
    {
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'status' => 'active',
            'is_featured' => false,
        ]);
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->withoutMiddleware()->post('/wishlist/clear');

        $response->assertStatus(200);
        $this->assertDatabaseCount('wishlists', 0);
    }
}
