import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaArrowLeft, FaTrash, FaUser, FaBox, FaCalendar, FaShoppingCart, FaDollarSign } from "react-icons/fa";
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
}

interface CartItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    product: Product;
    variant?: ProductVariant;
}

interface CartShowProps {
    cart: {
        id: number;
        user_id: number | null;
        session_id: string | null;
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
        created_at: string;
        updated_at: string;
        user?: User;
        items: CartItem[];
    };
}

export default function CartShow({ cart }: CartShowProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteCart = () => {
        router.delete(`/carts/${cart.id}`, {
            onSuccess: () => {
                toast.success('Cart deleted successfully');
                router.get('/carts');
            },
        });
    };

    const handleClearCart = () => {
        router.post(`/carts/${cart.id}/clear`, {}, {
            onSuccess: () => {
                toast.success('Cart cleared successfully');
                router.reload();
            },
        });
    };

    const handleDeleteItem = (itemId: number) => {
        setItemToDelete(itemId);
        setDeleteModalOpen(true);
    };

    const handleDeleteItemConfirm = () => {
        if (itemToDelete) {
            router.delete(`/carts/${cart.id}/items/${itemToDelete}`, {
                onSuccess: () => {
                    toast.success('Item removed successfully');
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                    router.reload();
                },
            });
        }
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getProductImage = (item: CartItem) => {
        if (item.product.thumbnail) {
            return item.product.thumbnail;
        }
        if (item.product.images && item.product.images.length > 0) {
            return item.product.images[0].image;
        }
        return '/placeholders/product-placeholder.png';
    };

    return (
        <>
            <Head title="Cart Details" />
            
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.get('/carts')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cart Details</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View detailed information about this shopping cart
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cart Items ({cart.items.length})</h2>
                            </div>
                            <div className="p-6">
                                {cart.items.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FaShoppingCart className="text-gray-400 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <img
                                                    src={getProductImage(item)}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {item.product.name}
                                                    </h3>
                                                    {item.variant && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {item.variant.name}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                Qty: {item.quantity}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatCurrency(item.subtotal)}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-red-500 hover:text-red-600 transition-colors"
                                                            title="Remove item"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cart.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">-{formatCurrency(cart.discount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cart.tax)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(cart.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cart Information</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaUser className="text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                                        {cart.user ? (
                                            <div>
                                                <p className="text-gray-900 dark:text-white mt-1">{cart.user.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{cart.user.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-900 dark:text-white mt-1">Guest Cart</p>
                                        )}
                                    </div>
                                </div>
                                {cart.session_id && (
                                    <div className="flex items-start gap-3">
                                        <FaBox className="text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Session ID</label>
                                            <p className="text-gray-900 dark:text-white mt-1 font-mono text-sm">
                                                {cart.session_id.substring(0, 16)}...
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <FaShoppingCart className="text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{cart.items.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaDollarSign className="text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cart Value</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{formatCurrency(cart.total)}</p>
                                    </div>
                                </div>
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
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{formatDate(cart.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCalendar className="text-gray-400 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{formatDate(cart.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                            <div className="p-6 space-y-3">
                                {cart.items.length > 0 && (
                                    <button
                                        onClick={() => setClearModalOpen(true)}
                                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaShoppingCart />
                                        Clear Cart
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTrash />
                                    Delete Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={itemToDelete ? handleDeleteItemConfirm : handleDeleteCart}
                title={itemToDelete ? "Remove Item" : "Delete Cart"}
                message={itemToDelete 
                    ? "Are you sure you want to remove this item from the cart?" 
                    : "Are you sure you want to delete this cart? This action cannot be undone."
                }
            />

            <DeleteModal
                open={clearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={handleClearCart}
                title="Clear Cart"
                message="Are you sure you want to clear all items from this cart? This action cannot be undone."
            />
        </>
    );
}
