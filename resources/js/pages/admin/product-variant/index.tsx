import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    barcode: string | null;
    price: number;
    compare_price: number | null;
    cost_price: number | null;
    weight: number | null;
    dimensions: string | null;
    current_stock: number;
    low_stock_alert: number;
    status: string;
    created_at: string;
    updated_at: string;
    product?: {
        id: number;
        name: string;
    };
}

interface ProductVariantsProps {
    variants: {
        data: ProductVariant[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        stock_status: string;
        per_page: number;
        page: number;
    };
}

export default function ProductVariants({ variants, filters }: ProductVariantsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [stockStatusFilter, setStockStatusFilter] = useState(filters.stock_status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState<number | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

    const handleEdit = (variantId: number) => {
        router.get(`/product-variants/${variantId}/edit`);
    };

    const handleView = (variantId: number) => {
        router.get(`/product-variants/${variantId}`);
    };

    const handleDeleteClick = (variantId: number) => {
        setVariantToDelete(variantId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (variantToDelete) {
            router.delete(`/product-variants/${variantToDelete}`, {
                onSuccess: () => {
                    toast.success('Variant deleted successfully');
                    setDeleteModalOpen(false);
                    setVariantToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete variant');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; stock_status: string; page: number; per_page: number }> = {}) => {
        router.get('/product-variants', {
            search: searchTerm,
            status: statusFilter,
            stock_status: stockStatusFilter,
            per_page: filters.per_page,
            page: 1,
            ...overrides,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ page: 1 });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        navigate({ status: value, page: 1 });
    };

    const handleStockStatusChange = (value: string) => {
        setStockStatusFilter(value);
        navigate({ stock_status: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedVariants(variants.data.map((v) => v.id));
        } else {
            setSelectedVariants([]);
        }
    };

    const handleSelectVariant = (variantId: number) => {
        if (selectedVariants.includes(variantId)) {
            setSelectedVariants(selectedVariants.filter(id => id !== variantId));
        } else {
            setSelectedVariants([...selectedVariants, variantId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedVariants.length > 0) {
            router.post('/product-variants/bulk-delete', { ids: selectedVariants }, {
                onSuccess: () => {
                    toast.success('Variants deleted successfully');
                    setSelectedVariants([]);
                },
                onError: () => {
                    toast.error('Failed to delete variants');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedVariants.length > 0) {
            router.post('/product-variants/bulk-status', { ids: selectedVariants, status }, {
                onSuccess: () => {
                    toast.success('Variants status updated successfully');
                    setSelectedVariants([]);
                },
                onError: () => {
                    toast.error('Failed to update variants status');
                },
            });
        }
    };

    const handleToggleStatus = (variantId: number) => {
        router.patch(`/product-variants/${variantId}/toggle-status`);
    };

    const getStockStatus = (variant: ProductVariant): string => {
        if (variant.current_stock === 0) return 'out_of_stock';
        if (variant.current_stock <= variant.low_stock_alert) return 'low_stock';
        return 'in_stock';
    };

    const getStockStatusBadge = (variant: ProductVariant) => {
        const status = getStockStatus(variant);
        switch (status) {
            case 'out_of_stock':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Out of Stock</span>;
            case 'low_stock':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Low Stock</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Stock</span>;
        }
    };

    return (
        <>
            <Head title="Product Variants Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Product Variants Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search variants..."
                                showSubmitButton={true}
                                submitButtonText="Search"
                                onSubmit={handleSearch}
                            />
                            <StatusFilter
                                value={statusFilter}
                                onChange={handleStatusChange}
                            />
                            <select
                                value={stockStatusFilter}
                                onChange={(e) => handleStockStatusChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Stock Status</option>
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                        <button
                            onClick={() => router.get('/product-variants/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Variant
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedVariants.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => handleBulkStatusUpdate('active')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Activate Selected
                        </button>
                        <button
                            onClick={() => handleBulkStatusUpdate('inactive')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Deactivate Selected
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedVariants.length === variants.data.length && variants.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Barcode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {variants.data && variants.data.length > 0 ? (
                                    variants.data.map((variant) => (
                                        <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVariants.includes(variant.id)}
                                                    onChange={() => handleSelectVariant(variant.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {variant.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {variant.product ? variant.product.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {variant.barcode || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                ${Number(variant.price).toFixed(2)}
                                                {variant.compare_price && (
                                                    <span className="ml-2 text-sm text-gray-400 line-through">${Number(variant.compare_price).toFixed(2)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {variant.current_stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStockStatusBadge(variant)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(variant.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${variant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {variant.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(variant.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(variant.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(variant.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No variants found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {variants.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {variants.from} to {variants.to} of {variants.total} variants
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(variants.current_page - 1)}
                                    disabled={variants.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {variants.current_page} of {variants.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(variants.current_page + 1)}
                                    disabled={variants.current_page === variants.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setVariantToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Product Variant"
                    message="Are you sure you want to delete this variant? This action cannot be undone."
                />
            </div>
        </>
    );
}
