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
            'cartCount' => $cart->items->sum('quantity'),
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
            'flash_sale_id' => 'nullable|exists:flash_sales,id',
            'flash_deal_price' => 'nullable|numeric|min:0',
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

        // Get variant if specified
        $variant = null;
        if ($request->product_variant_id) {
            $variant = ProductVariant::findOrFail($request->product_variant_id);
        }

        // Check if item already exists in cart
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        // Check stock availability
        $currentStock = $variant ? $variant->current_stock : $product->getTotalStockAttribute() ?? 0;
        $existingQuantity = $existingItem ? $existingItem->quantity : 0;
        $totalQuantity = $existingQuantity + $request->quantity;
        
        if ($totalQuantity > $currentStock) {
            return response()->json([
                'message' => 'Insufficient stock. Only ' . $currentStock . ' items available.',
                'available_stock' => $currentStock,
                'requested_quantity' => $totalQuantity,
            ], 400);
        }

        // Use flash deal price if provided, otherwise use regular price
        if ($request->filled('flash_deal_price') && $request->filled('flash_sale_id')) {
            $price = $request->flash_deal_price;
            $flashSaleId = $request->flash_sale_id;
        } else {
            // Get price from variant or product (using variant pricing)
            if ($request->product_variant_id) {
                $variant = ProductVariant::findOrFail($request->product_variant_id);
                $price = $variant->price ?? 0;
            } else {
                // For products without variants, use min price from variants or 0
                $price = $product->getMinPriceAttribute() ?? 0;
            }
            $flashSaleId = null;
        }

        if ($existingItem) {
            // Update quantity and potentially flash deal info
            $existingItem->quantity += $request->quantity;
            $existingItem->subtotal = $existingItem->quantity * $price;
            
            // Update flash deal info if provided
            if ($flashSaleId) {
                $existingItem->flash_sale_id = $flashSaleId;
                $existingItem->flash_deal_price = $price;
            }
            
            $existingItem->save();
        } else {
            // Create new item
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
                'subtotal' => $request->quantity * $price,
                'flash_sale_id' => $flashSaleId,
                'flash_deal_price' => $flashSaleId ? $price : null,
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

        // Check stock availability before updating
        $currentStock = $cartItem->variant ? $cartItem->variant->current_stock : $cartItem->product->getTotalStockAttribute() ?? 0;
        
        if ($request->quantity > $currentStock) {
            return response()->json([
                'message' => 'Insufficient stock. Only ' . $currentStock . ' items available.',
                'available_stock' => $currentStock,
                'requested_quantity' => $request->quantity,
            ], 400);
        }

        // Use flash deal price if available, otherwise use regular price
        if ($cartItem->flash_deal_price && $cartItem->flash_sale_id) {
            $price = $cartItem->flash_deal_price;
        } else {
            // Get price from variant or product (using variant pricing)
            if ($cartItem->product_variant_id) {
                $price = $cartItem->variant->price ?? 0;
            } else {
                // For products without variants, use min price from variants or 0
                $price = $cartItem->product->getMinPriceAttribute() ?? 0;
            }
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

    /**
     * Check if a product is in the user's cart.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        $exists = false;
        if ($cart) {
            $exists = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $request->product_id)
                ->where('product_variant_id', $request->product_variant_id)
                ->exists();
        }

        return response()->json([
            'exists' => $exists,
        ]);
    }

    /**
     * Remove a product from cart by product_id and variant_id (for API calls).
     */
    public function remove(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found',
            ], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($cartItem) {
            $cartItem->delete();
            $cart->updateTotals();
            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found in cart',
        ], 404);
    }
}
