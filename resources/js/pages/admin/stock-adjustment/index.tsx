import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import { toast } from 'sonner';

interface StockAdjustment {
    id: number;
    product_variant_id: number;
    warehouse_id: number;
    adjustment_type: string;
    quantity: number;
    before_stock: number;
    after_stock: number;
    reason: string | null;
    created_at: string;
    product_variant?: {
        id: number;
        sku: string;
        product?: {
            name: string;
        };
    };
    warehouse?: {
        id: number;
        name: string;
    };
}

interface StockAdjustmentsProps {
    adjustments: {
        data: StockAdjustment[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        adjustment_type: string;
        per_page: number;
        page: number;
    };
}

export default function StockAdjustments({ adjustments, filters }: StockAdjustmentsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.adjustment_type || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [adjustmentToDelete, setAdjustmentToDelete] = useState<number | null>(null);
    const [selectedAdjustments, setSelectedAdjustments] = useState<number[]>([]);

    const handleView = (adjustmentId: number) => {
        router.get(`/stock-adjustments/${adjustmentId}`);
    };

    const handleEdit = (adjustmentId: number) => {
        router.get(`/stock-adjustments/${adjustmentId}/edit`);
    };

    const handleDeleteClick = (adjustmentId: number) => {
        setAdjustmentToDelete(adjustmentId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (adjustmentToDelete) {
            router.delete(`/stock-adjustments/${adjustmentToDelete}`, {
                onSuccess: () => {
                    toast.success('Stock adjustment deleted successfully');
                    setDeleteModalOpen(false);
                    setAdjustmentToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete stock adjustment');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; adjustment_type: string; page: number; per_page: number }> = {}) => {
        router.get('/stock-adjustments', {
            search: searchTerm,
            adjustment_type: typeFilter,
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

    const handleTypeChange = (value: string) => {
        setTypeFilter(value);
        navigate({ adjustment_type: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAdjustments(adjustments.data.map((adj) => adj.id));
        } else {
            setSelectedAdjustments([]);
        }
    };

    const handleSelectAdjustment = (adjustmentId: number) => {
        if (selectedAdjustments.includes(adjustmentId)) {
            setSelectedAdjustments(selectedAdjustments.filter(id => id !== adjustmentId));
        } else {
            setSelectedAdjustments([...selectedAdjustments, adjustmentId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedAdjustments.length > 0) {
            router.post('/stock-adjustments/bulk-delete', { ids: selectedAdjustments }, {
                onSuccess: () => {
                    toast.success('Stock adjustments deleted successfully');
                    setSelectedAdjustments([]);
                },
                onError: () => {
                    toast.error('Failed to delete stock adjustments');
                },
            });
        }
    };

    return (
        <>
            <Head title="Stock Adjustments Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Stock Adjustments Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search adjustments..."
                                showSubmitButton={true}
                                submitButtonText="Search"
                                onSubmit={handleSearch}
                            />
                            <select
                                value={typeFilter}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Types</option>
                                <option value="increase">Increase</option>
                                <option value="decrease">Decrease</option>
                            </select>
                        </div>
                        <button
                            onClick={() => router.get('/stock-adjustments/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Adjustment
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedAdjustments.length > 0 && (
                    <div className="flex gap-2 mb-4">
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
                                            checked={selectedAdjustments.length === adjustments.data.length && adjustments.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Before</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">After</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {adjustments.data && adjustments.data.length > 0 ? (
                                    adjustments.data.map((adjustment) => (
                                        <tr key={adjustment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAdjustments.includes(adjustment.id)}
                                                    onChange={() => handleSelectAdjustment(adjustment.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {adjustment.product_variant?.sku || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {adjustment.product_variant?.product?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <div className='font-bold'>{adjustment.warehouse?.name || '-'}</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(adjustment.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${adjustment.adjustment_type === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                    {adjustment.adjustment_type === 'increase' ? 'Increase' : 'Decrease'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {adjustment.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {adjustment.before_stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {adjustment.after_stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(adjustment.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(adjustment.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(adjustment.id)}
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
                                            No stock adjustments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {adjustments.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {adjustments.from} to {adjustments.to} of {adjustments.total} adjustments
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(adjustments.current_page - 1)}
                                    disabled={adjustments.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {adjustments.current_page} of {adjustments.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(adjustments.current_page + 1)}
                                    disabled={adjustments.current_page === adjustments.last_page}
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
                        setAdjustmentToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Stock Adjustment"
                    message="Are you sure you want to delete this stock adjustment? This action cannot be undone."
                />
            </div>
        </>
    );
}
