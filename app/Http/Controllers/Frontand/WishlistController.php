<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display a listing of the user's wishlist.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Wishlist::with(['product', 'variant', 'product.category', 'product.brand', 'product.images'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        $wishlists = $query->get();

        // Transform the collection to ensure proper JSON serialization
        $transformedWishlists = $wishlists->map(function ($wishlist) {
            $product = $wishlist->product;
            $variant = $wishlist->variant;
            
            // Convert images relation to array of image URLs
            $imagesArray = [];
            if ($product->images && $product->images->count() > 0) {
                $imagesArray = $product->images->pluck('image')->toArray();
            }
            
            // If no images, use thumbnail as fallback
            if (empty($imagesArray) && $product->thumbnail) {
                $imagesArray = [$product->thumbnail];
            }
            
            // Set default image
            $defaultImage = !empty($imagesArray) ? $imagesArray[0] : '/uploads/products/placeholder.svg';
            
            // Determine price and original price for discount calculation
            $currentPrice = $variant ? $variant->price : $product->getMinPriceAttribute();
            $originalPrice = null;
            
            if ($variant && $variant->compare_price && $variant->compare_price > $variant->price) {
                $originalPrice = $variant->compare_price;
            } elseif ($product->getMaxPriceAttribute() && $product->getMaxPriceAttribute() > $currentPrice) {
                $originalPrice = $product->getMaxPriceAttribute();
            }
            
            return [
                'id' => $wishlist->id,
                'created_at' => $wishlist->created_at,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $defaultImage,
                    'thumbnail' => $product->thumbnail,
                    'images' => $imagesArray,
                    'min_price' => $product->getMinPriceAttribute(),
                    'max_price' => $product->getMaxPriceAttribute(),
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                    'brand' => $product->brand ? [
                        'id' => $product->brand->id,
                        'name' => $product->brand->name,
                    ] : null,
                ],
                'variant' => $variant ? [
                    'id' => $variant->id,
                    'price' => $variant->price,
                    'compare_price' => $variant->compare_price,
                    'sku' => $variant->sku,
                ] : null,
                'display_price' => $currentPrice,
                'display_original_price' => $originalPrice,
            ];
        });

        return inertia('Frontend/Wishlist/Index', [
            'wishlists' => $transformedWishlists,
        ]);
    }

    /**
     * Add a product to the user's wishlist.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();

        // Check if product exists
        $product = Product::findOrFail($request->product_id);

        // Check if already in wishlist
        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Product already in wishlist',
            ], 409);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'product_variant_id' => $request->product_variant_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist',
            'wishlist' => $wishlist->load(['product', 'variant']),
        ], 201);
    }

    /**
     * Remove a product from the user's wishlist.
     */
    public function destroy(Request $request, $id)
    {
        $user = Auth::user();

        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $wishlist->delete();

        return back()->with('success', 'Product removed from wishlist');
    }

    /**
     * Remove a product from wishlist by product_id and variant_id (for API calls).
     */
    public function remove(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found in wishlist',
        ], 404);
    }

    /**
     * Check if a product is in the user's wishlist.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    /**
     * Get the user's wishlist count.
     */
    public function count(): JsonResponse
    {
        $user = Auth::user();

        $count = Wishlist::where('user_id', $user->id)->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Move product from wishlist to cart (placeholder for cart integration).
     */
    public function moveToCart(Request $request, $id)
    {
        $user = Auth::user();

        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['product', 'variant'])
            ->firstOrFail();

        // TODO: Implement cart integration
        // This would add the product to the cart and remove from wishlist

        return back()->with('success', 'Product moved to cart');
    }

    /**
     * Clear all items from the user's wishlist.
     */
    public function clear(Request $request)
    {
        $user = Auth::user();

        Wishlist::where('user_id', $user->id)->delete();

        return back()->with('success', 'Wishlist cleared');
    }
}
