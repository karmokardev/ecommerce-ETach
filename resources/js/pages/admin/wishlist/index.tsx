import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaTrash, FaFilter } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
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
}

interface ProductVariant {
    id: number;
    name: string;
    price: number;
}

interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    product_variant_id: number | null;
    created_at: string;
    updated_at: string;
    user: User;
    product: Product;
    variant?: ProductVariant;
}

interface WishlistsProps {
    wishlists: {
        data: WishlistItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        user_id: string;
        product_id: string;
        per_page: string;
    };
}

export default function Wishlists({ wishlists, filters }: WishlistsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [wishlistToDelete, setWishlistToDelete] = useState<number | null>(null);
    const [selectedWishlists, setSelectedWishlists] = useState<number[]>([]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        router.get('/wishlists', { search: value }, { preserveState: true });
    };

    const handleView = (wishlistId: number) => {
        router.get(`/wishlists/${wishlistId}`);
    };

    const handleDeleteClick = (wishlistId: number) => {
        setWishlistToDelete(wishlistId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (wishlistToDelete) {
            router.delete(`/wishlists/${wishlistToDelete}`, {
                onSuccess: () => {
                    toast.success('Wishlist item deleted successfully');
                    setDeleteModalOpen(false);
                    setWishlistToDelete(null);
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedWishlists.length === 0) return;

        router.post('/wishlists/bulk-delete', { ids: selectedWishlists }, {
            onSuccess: () => {
                toast.success('Wishlist items deleted successfully');
                setSelectedWishlists([]);
            },
        });
    };

    const handleSelectAll = () => {
        if (selectedWishlists.length === wishlists.data.length) {
            setSelectedWishlists([]);
        } else {
            setSelectedWishlists(wishlists.data.map(w => w.id));
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedWishlists(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Wishlists" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlists</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage user wishlists and saved products
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <SearchBar
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search by user name or product name..."
                            />
                            {selectedWishlists.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <FaTrash />
                                    Delete Selected ({selectedWishlists.length})
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedWishlists.length === wishlists.data.length && wishlists.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Variant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Added On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {wishlists.data.map((wishlist) => (
                                    <tr key={wishlist.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedWishlists.includes(wishlist.id)}
                                                onChange={() => handleSelectOne(wishlist.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {wishlist.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {wishlist.user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {wishlist.product.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {wishlist.variant ? (
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {wishlist.variant.name}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(wishlist.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <button
                                                onClick={() => handleView(wishlist.id)}
                                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                title="View"
                                            >
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(wishlist.id)}
                                                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {wishlists.data.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No wishlist items found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Get started by adding products to your wishlist
                            </p>
                        </div>
                    )}

                    <Pagination
                        currentPage={wishlists.current_page}
                        totalPages={wishlists.last_page}
                        onPageChange={(page) => router.get('/wishlists', { page })}
                        startIndex={wishlists.from - 1}
                        endIndex={wishlists.to}
                        totalItems={wishlists.total}
                        itemName="wishlist items"
                    />
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setWishlistToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Wishlist Item"
                message="Are you sure you want to delete this wishlist item? This action cannot be undone."
            />
        </>
    );
}
