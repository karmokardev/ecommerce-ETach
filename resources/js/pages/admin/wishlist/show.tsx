import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaArrowLeft, FaTrash, FaUser, FaBox, FaTag, FaCalendar } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    thumbnail: string | null;
    status: string;
    is_featured: boolean;
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
    sku: string;
    price: number;
    current_stock: number;
}

interface WishlistShowProps {
    wishlist: {
        id: number;
        user_id: number;
        product_id: number;
        product_variant_id: number | null;
        created_at: string;
        updated_at: string;
        user: User;
        product: Product;
        variant?: ProductVariant;
    };
}

export default function WishlistShow({ wishlist }: WishlistShowProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/wishlists/${wishlist.id}`, {
            onSuccess: () => {
                toast.success('Wishlist item deleted successfully');
                router.get('/wishlists');
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getProductImage = () => {
        if (wishlist.product.thumbnail) {
            return wishlist.product.thumbnail;
        }
        if (wishlist.product.images && wishlist.product.images.length > 0) {
            return wishlist.product.images[0].image;
        }
        return '/placeholders/product-placeholder.png';
    };

    return (
        <>
            <Head title="Wishlist Details" />
            
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.get('/wishlists')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlist Details</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View detailed information about this wishlist item
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-6">
                                    <img
                                        src={getProductImage()}
                                        alt={wishlist.product.name}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {wishlist.product.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                                            {wishlist.product.short_description || 'No description available'}
                                        </p>
                                        <div className="flex gap-4 mt-4">
                                            {wishlist.product.category && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <FaTag />
                                                    {wishlist.product.category.name}
                                                </div>
                                            )}
                                            {wishlist.product.brand && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <FaBox />
                                                    {wishlist.product.brand.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {wishlist.variant && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Variant Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Variant Name</label>
                                            <p className="text-gray-900 dark:text-white mt-1">{wishlist.variant.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU</label>
                                            <p className="text-gray-900 dark:text-white mt-1">{wishlist.variant.sku}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
                                            <p className="text-gray-900 dark:text-white mt-1">${Number(wishlist.variant.price).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</label>
                                            <p className="text-gray-900 dark:text-white mt-1">{wishlist.variant.current_stock} units</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {wishlist.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{wishlist.user?.name || 'Unknown User'}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{wishlist.user?.email || 'No email'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.get(`/customers/${wishlist.user_id}`)}
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    View Customer Profile
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Timeline</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaCalendar className="text-gray-400 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Added to Wishlist</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{formatDate(wishlist.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCalendar className="text-gray-400 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{formatDate(wishlist.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6">
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTrash />
                                    Delete Wishlist Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Wishlist Item"
                message="Are you sure you want to delete this wishlist item? This action cannot be undone."
            />
        </>
    );
}
