import { Head, router } from '@inertiajs/react';
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

interface CartItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
    subtotal: number;
    product: Product;
    variant?: ProductVariant;
}

interface Cart {
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
}

interface CartsProps {
    carts: {
        data: Cart[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        user_id: string;
        session_id: string;
        empty: string;
        has_items: string;
        per_page: string;
    };
}

export default function Carts({ carts, filters }: CartsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [cartToDelete, setCartToDelete] = useState<number | null>(null);
    const [selectedCarts, setSelectedCarts] = useState<number[]>([]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        router.get('/carts', { search: value }, { preserveState: true });
    };

    const handleView = (cartId: number) => {
        router.get(`/carts/${cartId}`);
    };

    const handleDeleteClick = (cartId: number) => {
        setCartToDelete(cartId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (cartToDelete) {
            router.delete(`/carts/${cartToDelete}`, {
                onSuccess: () => {
                    toast.success('Cart deleted successfully');
                    setDeleteModalOpen(false);
                    setCartToDelete(null);
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedCarts.length === 0) return;

        router.post('/carts/bulk-delete', { ids: selectedCarts }, {
            onSuccess: () => {
                toast.success('Carts deleted successfully');
                setSelectedCarts([]);
            },
        });
    };

    const handleSelectAll = () => {
        if (selectedCarts.length === carts.data.length) {
            setSelectedCarts([]);
        } else {
            setSelectedCarts(carts.data.map(c => c.id));
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedCarts(prev =>
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <>
            <Head title="Carts" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Carts</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage user shopping carts
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <SearchBar
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search by user name, email or session ID..."
                            />
                            {selectedCarts.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <FaTrash />
                                    Delete Selected ({selectedCarts.length})
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
                                            checked={selectedCarts.length === carts.data.length && carts.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Session ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {carts.data.map((cart) => (
                                    <tr key={cart.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedCarts.includes(cart.id)}
                                                onChange={() => handleSelectOne(cart.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {cart.user ? (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {cart.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {cart.user.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Guest</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                {cart.session_id ? `${cart.session_id.substring(0, 8)}...` : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {cart.items.length}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(cart.total)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(cart.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <button
                                                onClick={() => handleView(cart.id)}
                                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                title="View"
                                            >
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(cart.id)}
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

                    {carts.data.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">🛒</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No carts found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No shopping carts available
                            </p>
                        </div>
                    )}

                    <Pagination
                        currentPage={carts.current_page}
                        totalPages={carts.last_page}
                        onPageChange={(page) => router.get('/carts', { page })}
                        startIndex={carts.from - 1}
                        endIndex={carts.to}
                        totalItems={carts.total}
                        itemName="carts"
                    />
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setCartToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Cart"
                message="Are you sure you want to delete this cart? This action cannot be undone."
            />
        </>
    );
}
