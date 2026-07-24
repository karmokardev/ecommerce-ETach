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

        return inertia('Frontend/Wishlist/Index', [
            'wishlists' => $wishlists,
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
                'message' => 'Product already in wishlist',
                'wishlist' => $existing,
            ], 409);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'product_variant_id' => $request->product_variant_id,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'wishlist' => $wishlist->load(['product', 'variant']),
        ], 201);
    }

    /**
     * Remove a product from the user's wishlist.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $wishlist->delete();

        return response()->json([
            'message' => 'Product removed from wishlist',
        ]);
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
    public function moveToCart(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['product', 'variant'])
            ->firstOrFail();

        // TODO: Implement cart integration
        // This would add the product to the cart and remove from wishlist

        return response()->json([
            'message' => 'Product moved to cart',
            'wishlist' => $wishlist,
        ]);
    }

    /**
     * Clear all items from the user's wishlist.
     */
    public function clear(Request $request): JsonResponse
    {
        $user = Auth::user();

        Wishlist::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Wishlist cleared',
        ]);
    }
}
