import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaStar } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { toast } from 'sonner';

interface Product {
    id: number;
    category_id: number | null;
    brand_id: number | null;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    thumbnail: string | null;
    status: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
}

interface ProductsProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    categories: Array<{ id: number; name: string }>;
    brands: Array<{ id: number; name: string }>;
    filters: {
        search: string;
        status: string;
        category_id: string;
        brand_id: string;
        per_page: number;
        page: number;
    };
}

export default function Products({ products, categories, brands, filters }: ProductsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');
    const [brandFilter, setBrandFilter] = useState(filters.brand_id || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    const handleEdit = (productId: number) => {
        router.get(`/products/${productId}/edit`);
    };

    const handleView = (productId: number) => {
        router.get(`/products/${productId}`);
    };

    const handleDeleteClick = (productId: number) => {
        setProductToDelete(productId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            router.delete(`/products/${productToDelete}`, {
                onSuccess: () => {
                    toast.success('Product deleted successfully');
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete product');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; category_id: string; brand_id: string; page: number; per_page: number }> = {}) => {
        router.get('/products', {
            search: searchTerm,
            status: statusFilter,
            category_id: categoryFilter,
            brand_id: brandFilter,
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

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        navigate({ category_id: value, page: 1 });
    };

    const handleBrandChange = (value: string) => {
        setBrandFilter(value);
        navigate({ brand_id: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(products.data.map((prod) => prod.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId: number) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedProducts.length > 0) {
            router.post('/products/bulk-delete', { ids: selectedProducts }, {
                onSuccess: () => {
                    toast.success('Products deleted successfully');
                    setSelectedProducts([]);
                },
                onError: () => {
                    toast.error('Failed to delete products');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedProducts.length > 0) {
            router.post('/products/bulk-status', { ids: selectedProducts, status }, {
                onSuccess: () => {
                    toast.success('Products status updated successfully');
                    setSelectedProducts([]);
                },
                onError: () => {
                    toast.error('Failed to update products status');
                },
            });
        }
    };

    const handleToggleStatus = (productId: number) => {
        router.patch(`/products/${productId}/toggle-status`);
    };

    const handleToggleFeatured = (productId: number) => {
        router.patch(`/products/${productId}/toggle-featured`);
    };

    return (
        <>
            <Head title="Products Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Products Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search products..."
                                showSubmitButton={true}
                                submitButtonText="Search"
                                onSubmit={handleSearch}
                            />
                            <StatusFilter
                                value={statusFilter}
                                onChange={handleStatusChange}
                            />
                            <SelectDropdown
                                categories={categories}
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                placeholder="All Categories"
                            />
                            <SelectDropdown
                                categories={brands}
                                value={brandFilter}
                                onChange={handleBrandChange}
                                placeholder="All Brands"
                            />
                        </div>
                        <button
                            onClick={() => router.get('/products/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
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
                                            checked={selectedProducts.length === products.data.length && products.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Featured</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {products.data && products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelectProduct(product.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    {product.thumbnail ? (
                                                        <img
                                                            src={product.thumbnail.startsWith('http') ? product.thumbnail : `/storage/${product.thumbnail}`}
                                                            alt={product.name}
                                                            className="h-12 w-12 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className='max-w-3xs'>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.slug}</div>
                                                        {product.short_description && (
                                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{product.short_description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {product.category ? product.category.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {product.brand ? product.brand.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(product.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {product.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleFeatured(product.id)}
                                                    className={`text-lg ${product.is_featured ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                                    title={product.is_featured ? 'Featured' : 'Not Featured'}
                                                >
                                                    <FaStar />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(product.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product.id)}
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
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {products.from} to {products.to} of {products.total} products
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(products.current_page - 1)}
                                    disabled={products.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {products.current_page} of {products.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(products.current_page + 1)}
                                    disabled={products.current_page === products.last_page}
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
                        setProductToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Product"
                    message="Are you sure you want to delete this product? This action cannot be undone."
                />
            </div>
        </>
    );
}
