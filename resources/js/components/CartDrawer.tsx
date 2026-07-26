import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Package } from 'lucide-react';
import { router } from '@inertiajs/react';

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

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCartChange?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCartChange }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            fetchCart();
        } else {
            setIsAnimating(false);
        }
    }, [isOpen]);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/cart/show');
            const data = await response.json();
            setCart(data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        // Update local state immediately
        if (cart) {
            const updatedItems = cart.items.map(item => {
                if (item.id === itemId) {
                    const itemPrice = getItemPrice(item);
                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: itemPrice * newQuantity
                    };
                }
                return item;
            });
            
            const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            setCart({
                ...cart,
                items: updatedItems,
                subtotal: newSubtotal,
                total: newSubtotal
            });
        }
        
        // Update on server
        try {
            await fetch(`/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            // Notify parent of cart change
            if (onCartChange) onCartChange();
        } catch (error) {
            console.error('Error updating quantity:', error);
            // Revert on error
            fetchCart();
        }
    };

    const removeItem = async (itemId: number) => {
        // Update local state immediately
        if (cart) {
            const updatedItems = cart.items.filter(item => item.id !== itemId);
            const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            setCart({
                ...cart,
                items: updatedItems,
                subtotal: newSubtotal,
                total: newSubtotal
            });
        }
        
        // Update on server
        try {
            await fetch(`/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            // Notify parent of cart change
            if (onCartChange) onCartChange();
        } catch (error) {
            console.error('Error removing item:', error);
            // Revert on error
            fetchCart();
        }
    };

    const handleCheckout = () => {
        router.visit('/checkout');
        onClose();
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

    if (!isOpen) return null;

    const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = cart?.subtotal || cart?.total || 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
                isAnimating ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 text-gray-800" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                                {totalItems > 0 && (
                                    <p className="text-xs text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                            aria-label="Close cart"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-t-gray-900"></div>
                                    <p className="text-sm text-gray-500">Loading your cart...</p>
                                </div>
                            </div>
                        ) : !cart || cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything yet</p>
                                <button
                                    onClick={() => {
                                        onClose();
                                        router.visit('/');
                                    }}
                                    className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 hover:shadow-lg"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 pb-4">
                                {cart.items.map((item, index) => {
                                    const productImage = getProductImage(item);
                                    const itemPrice = getItemPrice(item);
                                    
                                    return (
                                        <div
                                            key={item.id}
                                            className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="relative w-24 h-24 flex-shrink-0">
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                                        {productImage ? (
                                                            <img
                                                                src={productImage}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="w-10 h-10 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                                                            {item.quantity}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0 flex flex-col">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                                                            {item.product.name}
                                                        </h3>
                                                        {item.product.category && (
                                                            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mb-2">
                                                                {item.product.category.name}
                                                            </span>
                                                        )}
                                                        {item.variant && item.variant.sku && (
                                                            <p className="text-xs text-gray-400 mb-2">
                                                                SKU: {item.variant.sku}
                                                            </p>
                                                        )}
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {formatPrice(item.subtotal)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                ({formatPrice(itemPrice)} each)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                            <span className="w-8 text-center font-semibold text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                                                            >
                                                                <Plus className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart && cart.items.length > 0 && (
                        <div className="border-t border-gray-200 bg-white p-5 space-y-4 sticky bottom-0">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                {cart.shipping_total && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium">{formatPrice(cart.shipping_total)}</span>
                                    </div>
                                )}
                                {cart.tax_total && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium">{formatPrice(cart.tax_total)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>{formatPrice(cart.total || subtotal)}</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Checkout</span>
                                <ShoppingBag className="w-5 h-5" />
                            </button>
                            
                            <button
                                onClick={() => {
                                    onClose();
                                    router.visit('/cart');
                                }}
                                className="w-full text-gray-600 py-3 text-sm font-medium hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>View Full Cart</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
