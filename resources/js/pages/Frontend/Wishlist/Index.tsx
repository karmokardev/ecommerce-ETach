import React from 'react';
import { Head } from '@inertiajs/react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { router } from '@inertiajs/react';
import ProductCard from '@/components/product/ProductCard';

interface Product {
    id: number;
    name: string;
    image?: string;
    thumbnail?: string;
    images?: string[];
    min_price?: number;
    max_price?: number;
    category?: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
}

interface Variant {
    id: number;
    price: number;
    sku: string;
}

interface WishlistItem {
    id: number;
    product: Product;
    variant?: Variant;
    created_at: string;
    display_price: number;
    display_original_price?: number | null;
}

interface Props {
    wishlists: WishlistItem[];
}

export default function WishlistIndex({ wishlists }: Props) {
    const handleRemove = (id: number) => {
        if (confirm('Are you sure you want to remove this item from wishlist?')) {
            router.delete(`/wishlist/${id}`);
        }
    };

    const handleMoveToCart = (id: number, productId: number, variantId?: number) => {
        router.post(`/wishlist/${id}/move-to-cart`, {}, {
            onSuccess: () => {
                router.visit('/cart');
            }
        });
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all items from wishlist?')) {
            router.post('/wishlist/clear');
        }
    };

    return (
        <>
            <Head title="My Wishlist" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {wishlists.length} items
                                </span>
                            </div>
                            {wishlists.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {wishlists.length === 0 ? (
                        <div className="text-center py-16">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-600 mb-6">Start adding products you love!</p>
                            <button
                                onClick={() => router.visit('/')}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {wishlists.map((wishlist) => {
                                const imageUrl = Array.isArray(wishlist.product.images) && wishlist.product.images.length > 0
                                    ? wishlist.product.images[0]
                                    : (wishlist.product.image || wishlist.product.thumbnail || '/uploads/products/placeholder.svg');
                                
                                return (
                                    <div key={wishlist.id} className="relative">
                                        <ProductCard
                                            id={wishlist.product.id}
                                            name={wishlist.product.name}
                                            image={imageUrl}
                                            price={Number(wishlist.display_price || 0)}
                                            originalPrice={wishlist.display_original_price ? Number(wishlist.display_original_price) : undefined}
                                            productVariantId={wishlist.variant?.id}
                                        />
                                        
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
