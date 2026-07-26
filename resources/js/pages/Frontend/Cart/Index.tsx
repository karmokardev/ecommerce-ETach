import React from 'react';
import { usePage } from '@inertiajs/react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';
import { router } from '@inertiajs/react';
import Navbar from '../../../components/Navbar/navbar';

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        thumbnail?: string;
        images?: string[];
        min_price?: number;
        max_price?: number;
        category?: {
            name: string;
        };
        brand?: {
            name: string;
        };
    };
    variant?: {
        id: number;
        price?: number;
        sku?: string;
        compare_price?: number;
    };
    quantity: number;
    subtotal: number;
}

interface Cart {
    id: number;
    items: CartItem[];
    subtotal?: number;
    total?: number;
    shipping_total?: number;
    tax_total?: number;
}

const CartIndex: React.FC = () => {
    const { props } = usePage();
    const cart = (props as any).cart as Cart | null;

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        try {
            await fetch(`/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            router.reload();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await fetch(`/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            router.reload();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = () => {
        router.visit('/checkout');
    };

    const getProductImage = (item: CartItem) => {
        if (item.product.thumbnail && typeof item.product.thumbnail === 'string') {
            // Add /storage prefix if not already present
            const thumbnail = item.product.thumbnail;
            if (thumbnail.startsWith('/storage')) return thumbnail;
            if (thumbnail.startsWith('http')) return thumbnail;
            return `/storage/${thumbnail}`;
        }
        if (item.product.images && item.product.images.length > 0) {
            const image = item.product.images[0];
            // Handle if image is an object with image property (ProductImage model)
            if (typeof image === 'object' && image !== null && 'image' in image) {
                const imageUrl = (image as any).image;
                if (imageUrl && typeof imageUrl === 'string') {
                    if (imageUrl.startsWith('/storage')) return imageUrl;
                    if (imageUrl.startsWith('http')) return imageUrl;
                    return `/storage/${imageUrl}`;
                }
            }
            // Handle if image is a string directly
            if (typeof image === 'string') {
                if (image.startsWith('/storage')) return image;
                if (image.startsWith('http')) return image;
                return `/storage/${image}`;
            }
        }
        return null;
    };

    const getItemPrice = (item: CartItem) => {
        if (item.variant && item.variant.price) return item.variant.price;
        if (item.product.min_price) return item.product.min_price;
        return 0;
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `$${numPrice.toFixed(2)}`;
    };

    const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = cart?.subtotal || cart?.total || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 sm:p-3 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-gray-800" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                            {totalItems > 0 && (
                                <p className="text-xs sm:text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                {!cart || cart.items.length === 0 ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-lg">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">Looks like you haven't added anything yet</p>
                        <button
                            onClick={() => router.visit('/')}
                            className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {cart.items.map((item, index) => {
                                const productImage = getProductImage(item);
                                const itemPrice = getItemPrice(item);
                                
                                return (
                                    <div
                                        key={item.id}
                                        className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex gap-4 sm:gap-6">
                                            {/* Product Image */}
                                            <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0">
                                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
                                                    {productImage ? (
                                                        <img
                                                            src={productImage}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                {item.quantity > 1 && (
                                                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-lg">
                                                        {item.quantity}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight mb-1 sm:mb-2 line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    {item.product.category && (
                                                        <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-3">
                                                            {item.product.category.name}
                                                        </span>
                                                    )}
                                                    {item.variant && item.variant.sku && (
                                                        <p className="text-xs text-gray-400 mb-2 sm:mb-3">
                                                            SKU: {item.variant.sku}
                                                        </p>
                                                    )}
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg sm:text-2xl font-bold text-gray-900">
                                                            {formatPrice(item.subtotal)}
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-gray-500">
                                                            ({formatPrice(itemPrice)} each)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-gray-900 text-sm sm:text-lg">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                                                        >
                                                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 group-hover:scale-110"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-8">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                                
                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                        <span className="flex items-center gap-2">
                                            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Subtotal
                                        </span>
                                        <span className="font-semibold">{formatPrice(subtotal)}</span>
                                    </div>
                                    {cart.shipping_total && (
                                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                            <span className="flex items-center gap-2">
                                                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Shipping
                                            </span>
                                            <span className="font-semibold">{formatPrice(cart.shipping_total)}</span>
                                        </div>
                                    )}
                                    {cart.tax_total && (
                                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                            <span className="flex items-center gap-2">
                                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Tax
                                            </span>
                                            <span className="font-semibold">{formatPrice(cart.tax_total)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-3 sm:pt-4 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>{formatPrice(cart.total || subtotal)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                
                                <button
                                    onClick={() => router.visit('/')}
                                    className="w-full text-gray-600 py-2 sm:py-3 text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Continue Shopping</span>
                                </button>

                                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        <span>Free shipping on orders over $50</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                        <span>Secure payment processing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartIndex;
