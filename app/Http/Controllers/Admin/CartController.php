<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Cart::with(['user', 'items.product', 'items.variant'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search by user name or session ID
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', "%{$request->search}%")
                        ->orWhere('email', 'like', "%{$request->search}%");
                })
                ->orWhere('session_id', 'like', "%{$request->search}%");
            });
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by session
        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // Filter by empty carts
        if ($request->filled('empty')) {
            $query->whereDoesntHave('items');
        }

        // Filter by non-empty carts
        if ($request->filled('has_items')) {
            $query->whereHas('items');
        }

        $carts = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/cart/index', [
            'carts' => $carts,
            'filters' => $request->only(['search', 'user_id', 'session_id', 'empty', 'has_items', 'per_page']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        $cart->load(['user', 'items.product', 'items.variant', 'items.product.category', 'items.product.brand', 'items.product.images']);

        return inertia('admin/cart/show', [
            'cart' => $cart,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();

        return redirect()->back()->with('success', 'Cart deleted successfully.');
    }

    /**
     * Bulk delete carts.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:carts,id',
        ]);

        Cart::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Carts deleted successfully.');
    }

    /**
     * Clear all items from a cart.
     */
    public function clearCart(Cart $cart)
    {
        $cart->items()->delete();
        $cart->updateTotals();

        return redirect()->back()->with('success', 'Cart cleared successfully.');
    }

    /**
     * Delete a specific cart item.
     */
    public function deleteItem(Request $request, Cart $cart, CartItem $item)
    {
        if ($item->cart_id !== $cart->id) {
            return redirect()->back()->with('error', 'Item does not belong to this cart.');
        }

        $item->delete();
        $cart->updateTotals();

        return redirect()->back()->with('success', 'Cart item deleted successfully.');
    }

    /**
     * Update cart item quantity.
     */
    public function updateItem(Request $request, Cart $cart, CartItem $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($item->cart_id !== $cart->id) {
            return redirect()->back()->with('error', 'Item does not belong to this cart.');
        }

        // Get price from variant or product (using variant pricing)
        if ($item->product_variant_id) {
            $price = $item->variant->price ?? 0;
        } else {
            // For products without variants, use min price from variants or 0
            $price = $item->product->getMinPriceAttribute() ?? 0;
        }

        $item->quantity = $request->quantity;
        $item->subtotal = $item->quantity * $price;
        $item->save();

        $cart->updateTotals();

        return redirect()->back()->with('success', 'Cart item updated successfully.');
    }

    /**
     * Get cart statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Cart::count(),
            'with_users' => Cart::whereNotNull('user_id')->count(),
            'guest_carts' => Cart::whereNull('user_id')->count(),
            'with_items' => Cart::whereHas('items')->count(),
            'empty' => Cart::whereDoesntHave('items')->count(),
            'total_items' => CartItem::count(),
            'total_value' => Cart::sum('total'),
        ];

        return response()->json($stats);
    }

    /**
     * Get cart details for API.
     */
    public function showApi(Cart $cart): JsonResponse
    {
        $cart->load(['user', 'items.product', 'items.variant', 'items.product.category', 'items.product.brand', 'items.product.images']);

        return response()->json([
            'cart' => $cart,
            'item_count' => $cart->items->sum('quantity'),
        ]);
    }
}
