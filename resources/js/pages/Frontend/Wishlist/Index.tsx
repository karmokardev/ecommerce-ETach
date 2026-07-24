import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

interface Product {
    id: number;
    name: string;
    slug: string;
    thumbnail?: string;
    short_description?: string;
    category?: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
    images?: Array<{
        id: number;
        image: string;
    }>;
}

interface ProductVariant {
    id: number;
    name: string;
    price: number;
    current_stock: number;
}

interface WishlistItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    created_at: string;
    product: Product;
    variant?: ProductVariant;
}

interface WishlistPageProps {
    wishlists: WishlistItem[];
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlists }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleSelectAll = () => {
        if (selectedItems.length === wishlists.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlists.map(item => item.id));
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleRemoveSelected = () => {
        if (selectedItems.length === 0) return;

        if (confirm(`Remove ${selectedItems.length} item(s) from wishlist?`)) {
            selectedItems.forEach(id => {
                router.delete(`/wishlist/${id}`, {
                    onSuccess: () => {
                        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
                    },
                });
            });
        }
    };

    const handleClearAll = () => {
        if (confirm('Clear all items from wishlist?')) {
            router.post('/wishlist/clear', {}, {
                onSuccess: () => {
                    setSelectedItems([]);
                },
            });
        }
    };

    const handleMoveToCart = (id: number) => {
        router.post(`/wishlist/${id}/move-to-cart`, {}, {
            onSuccess: () => {
                // Refresh the page to show updated wishlist
                router.reload();
            },
        });
    };

    const getProductImage = (item: WishlistItem) => {
        if (item.product.thumbnail) {
            return item.product.thumbnail;
        }
        if (item.product.images && item.product.images.length > 0) {
            return item.product.images[0].image;
        }
        return '/placeholders/product-placeholder.png';
    };

    const getProductPrice = (item: WishlistItem) => {
        if (item.variant) {
            return item.variant.price;
        }
        // If no variant, you might want to get min/max price from product
        return 'Price not available';
    };

    if (wishlists.length === 0) {
        return (
            <>
                <Head title="My Wishlist" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                                <Heart size={48} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Save items you love by adding them to your wishlist
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="My Wishlist" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                My Wishlist
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {wishlists.length} {wishlists.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {selectedItems.length > 0 && (
                                <button
                                    onClick={handleRemoveSelected}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Remove Selected ({selectedItems.length})
                                </button>
                            )}
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Trash2 size={18} />
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Wishlist Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === wishlists.length && wishlists.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="col-span-5 font-medium text-gray-700 dark:text-gray-300">
                                Product
                            </div>
                            <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
                                Price
                            </div>
                            <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
                                Added On
                            </div>
                            <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300 text-right">
                                Actions
                            </div>
                        </div>

                        {/* Items */}
                        {wishlists.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                <div className="col-span-1 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </div>
                                <div className="col-span-5">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getProductImage(item)}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                                            >
                                                {item.product.name}
                                            </Link>
                                            {item.variant && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.variant.name}
                                                </p>
                                            )}
                                            {item.product.category && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.product.category.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        ${typeof getProductPrice(item) === 'number' ? getProductPrice(item).toFixed( 2) : getProductPrice(item)}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleMoveToCart(item.id)}
                                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Move to Cart"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                    <WishlistButton
                                        productId={item.product_id}
                                        productVariantId={item.product_variant_id}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedItems.length} of {wishlists.length} items selected
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WishlistPage;
