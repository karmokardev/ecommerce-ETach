<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $cart->load(['items.product', 'items.variant', 'items.product.category', 'items.product.brand', 'items.product.images']);

        // Get saved address if user is logged in
        $savedAddress = null;
        if ($user && $user->address) {
            $savedAddress = [
                'full_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address_line_1' => $user->address_line_1 ?? '',
                'address_line_2' => $user->address_line_2 ?? '',
                'city' => $user->city ?? '',
                'state' => $user->state ?? '',
                'postal_code' => $user->postal_code ?? '',
                'country' => $user->country ?? 'Bangladesh',
            ];
        }

        return inertia('Frontend/Checkout/Index', [
            'cart' => $cart,
            'savedAddress' => $savedAddress,
            'cartCount' => $cart->items->sum('quantity'),
        ]);
    }

    /**
     * Process the checkout and create order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'save_address' => 'nullable|boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $sessionId = Session::getId();
            $cart = Cart::where('session_id', $sessionId)->first();
        }

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty',
            ], 400);
        }

        $cart->load(['items.product', 'items.variant']);

        // Check stock availability
        foreach ($cart->items as $item) {
            $currentStock = $item->variant ? $item->variant->current_stock : $item->product->getTotalStockAttribute() ?? 0;
            if ($item->quantity > $currentStock) {
                return response()->json([
                    'message' => "Insufficient stock for {$item->product->name}. Only {$currentStock} items available.",
                ], 400);
            }
        }

        DB::beginTransaction();
        try {
            // Format shipping address
            $shippingAddress = implode(', ', array_filter([
                $request->address_line_1,
                $request->address_line_2,
                $request->city,
                $request->state,
                $request->postal_code,
                $request->country,
            ]));

            // Create order
            $order = Order::create([
                'user_id' => $user?->id,
                'customer_name' => $request->full_name,
                'customer_email' => $request->email,
                'customer_phone' => $request->phone,
                'shipping_address' => $shippingAddress,
                'billing_address' => $shippingAddress,
                'subtotal' => $cart->subtotal ?? $cart->total ?? 0,
                'shipping_cost' => $cart->shipping_total ?? 0,
                'tax' => $cart->tax ?? $cart->tax_total ?? 0,
                'discount' => $cart->discount ?? 0,
                'total' => $cart->total ?? 0,
                'payment_method' => 'cash_on_delivery',
                'payment_status' => 'pending',
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                $unitPrice = $item->flash_deal_price ?? ($item->variant?->price ?? $item->product->min_price ?? 0);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $item->subtotal,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->variant?->sku ?? $item->product->sku ?? null,
                ]);

                // Update stock
                if ($item->variant) {
                    $item->variant->decrement('current_stock', $item->quantity);
                } else {
                    // For products without variants, we need to handle stock differently
                    // This assumes you have a stock management system
                }
            }

            // Save address if requested and user is logged in
            if ($request->save_address && $user) {
                $user->update([
                    'name' => $request->full_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address_line_1' => $request->address_line_1,
                    'address_line_2' => $request->address_line_2,
                    'city' => $request->city,
                    'state' => $request->state,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                ]);
            }

            // Clear cart
            $cart->items()->delete();
            $cart->updateTotals();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to place order. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show order confirmation page.
     */
    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product', 'items.variant'])->findOrFail($id);

        // Check if user owns this order
        $user = Auth::user();
        if ($user && $order->user_id !== $user->id) {
            abort(403);
        }

        return inertia('Frontend/Checkout/Show', [
            'order' => $order,
        ]);
    }
}
