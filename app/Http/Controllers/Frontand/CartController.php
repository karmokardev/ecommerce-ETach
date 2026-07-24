<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Display the user's cart.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::getOrCreateForUser($user->id);
        } else {
            $sessionId = Session::getId();
            $cart = Cart::getOrCreateForSession($sessionId);
        }

        $cart->load(['items.product', 'items.variant', 'items.product.category', 'items.product.brand', 'items.product.images']);

        return inertia('Frontend/Cart/Index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::getOrCreateForUser($user->id);
        } else {
            $sessionId = Session::getId();
            $cart = Cart::getOrCreateForSession($sessionId);
        }

        // Check if product exists
        $product = Product::findOrFail($request->product_id);

        // Check if product has variants - if so, require variant selection
        if ($product->variants()->exists() && !$request->product_variant_id) {
            return response()->json([
                'message' => 'This product has variants. Please select a variant.',
                'requires_variant' => true,
            ], 400);
        }

        // Get price from variant or product (using variant pricing)
        if ($request->product_variant_id) {
            $variant = ProductVariant::findOrFail($request->product_variant_id);
            $price = $variant->price ?? 0;
        } else {
            // For products without variants, use min price from variants or 0
            $price = $product->getMinPriceAttribute() ?? 0;
        }

        // Check if item already exists in cart
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($existingItem) {
            // Update quantity
            $existingItem->quantity += $request->quantity;
            $existingItem->subtotal = $existingItem->quantity * $price;
            $existingItem->save();
        } else {
            // Create new item
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
                'subtotal' => $request->quantity * $price,
            ]);
        }

        // Update cart totals
        $cart->updateTotals();

        return response()->json([
            'message' => 'Product added to cart',
            'cart' => $cart->load('items'),
        ], 201);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->firstOrFail();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->firstOrFail();
        }

        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->with(['product', 'variant'])
            ->firstOrFail();

        // Get price from variant or product (using variant pricing)
        if ($cartItem->product_variant_id) {
            $price = $cartItem->variant->price ?? 0;
        } else {
            // For products without variants, use min price from variants or 0
            $price = $cartItem->product->getMinPriceAttribute() ?? 0;
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->subtotal = $cartItem->quantity * $price;
        $cartItem->save();

        // Update cart totals
        $cart->updateTotals();

        return response()->json([
            'message' => 'Cart item updated',
            'cart' => $cart->load('items'),
        ]);
    }

    /**
     * Remove a product from the cart.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->firstOrFail();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->firstOrFail();
        }

        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->firstOrFail();

        $cartItem->delete();

        // Update cart totals
        $cart->updateTotals();

        return response()->json([
            'message' => 'Product removed from cart',
            'cart' => $cart->load('items'),
        ]);
    }

    /**
     * Get the user's cart count.
     */
    public function count(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        $count = $cart ? $cart->items()->sum('quantity') : 0;

        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Get the user's cart details (for API).
     */
    public function show(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        if (!$cart) {
            return response()->json([
                'cart' => null,
                'count' => 0,
            ]);
        }

        $cart->load(['items.product', 'items.variant', 'items.product.category', 'items.product.brand', 'items.product.images']);

        return response()->json([
            'cart' => $cart,
            'count' => $cart->items->sum('quantity'),
        ]);
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->firstOrFail();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->firstOrFail();
        }

        $cart->items()->delete();
        $cart->updateTotals();

        return response()->json([
            'message' => 'Cart cleared',
            'cart' => $cart->load('items'),
        ]);
    }

    /**
     * Merge guest(cart) cart with user cart after login.
     */
    public function merge(Request $request): JsonResponse
    {
        $user = Auth::user();
        $sessionId = $request->input('session_id');

        if (!$sessionId) {
            return response()->json([
                'message' => 'Session ID required',
            ], 400);
        }

        $guestCart = Cart::where('session_id', $sessionId)->first();
        
        if (!$guestCart || $guestCart->items->isEmpty()) {
            return response()->json([
                'message' => 'No guest cart to merge',
            ]);
        }

        $userCart = Cart::getOrCreateForUser($user->id);

        // Merge items
        foreach ($guestCart->items as $guestItem) {
            $existingItem = CartItem::where('cart_id', $userCart->id)
                ->where('product_id', $guestItem->product_id)
                ->where('product_variant_id', $guestItem->product_variant_id)
                ->first();

            if ($existingItem) {
                $existingItem->quantity += $guestItem->quantity;
                $existingItem->updateSubtotal();
            } else {
                $newItem = $guestItem->replicate();
                $newItem->cart_id = $userCart->id;
                $newItem->save();
            }
        }

        // Delete guest cart
        $guestCart->delete();

        // Update user cart totals
        $userCart->updateTotals();

        return response()->json([
            'message' => 'Cart merged successfully',
            'cart' => $userCart->load('items'),
        ]);
    }
}
