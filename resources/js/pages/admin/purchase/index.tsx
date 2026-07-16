import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface Purchase {
    id: number;
    invoice_no: string;
    supplier_id: number | null;
    warehouse_id: number | null;
    purchase_date: string;
    total: number;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    supplier?: {
        id: number;
        name: string;
    };
    warehouse?: {
        id: number;
        name: string;
    };
}

interface PurchasesProps {
    purchases: {
        data: Purchase[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
        page: number;
    };
}

export default function Purchases({ purchases, filters }: PurchasesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [purchaseToDelete, setPurchaseToDelete] = useState<number | null>(null);
    const [selectedPurchases, setSelectedPurchases] = useState<number[]>([]);

    const handleEdit = (purchaseId: number) => {
        router.get(`/purchases/${purchaseId}/edit`);
    };

    const handleView = (purchaseId: number) => {
        router.get(`/purchases/${purchaseId}`);
    };

    const handleDeleteClick = (purchaseId: number) => {
        setPurchaseToDelete(purchaseId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (purchaseToDelete) {
            router.delete(`/purchases/${purchaseToDelete}`, {
                onSuccess: () => {
                    toast.success('Purchase deleted successfully');
                    setDeleteModalOpen(false);
                    setPurchaseToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete purchase');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number; per_page: number }> = {}) => {
        router.get('/purchases', {
            search: searchTerm,
            status: statusFilter,
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

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPurchases(purchases.data.map((p) => p.id));
        } else {
            setSelectedPurchases([]);
        }
    };

    const handleSelectPurchase = (purchaseId: number) => {
        if (selectedPurchases.includes(purchaseId)) {
            setSelectedPurchases(selectedPurchases.filter(id => id !== purchaseId));
        } else {
            setSelectedPurchases([...selectedPurchases, purchaseId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPurchases.length > 0) {
            router.post('/purchases/bulk-delete', { ids: selectedPurchases }, {
                onSuccess: () => {
                    toast.success('Purchases deleted successfully');
                    setSelectedPurchases([]);
                },
                onError: () => {
                    toast.error('Failed to delete purchases');
                },
            });
        }
    };

    const handleToggleStatus = (purchaseId: number) => {
        router.patch(`/purchases/${purchaseId}/toggle-status`);
    };

    return (
        <>
            <Head title="Purchases Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Purchases Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search purchases..."
                                showSubmitButton={true}
                                submitButtonText="Search"
                                onSubmit={handleSearch}
                            />
                            <StatusFilter
                                value={statusFilter}
                                onChange={handleStatusChange}
                            />
                        </div>
                        <button
                            onClick={() => router.get('/purchases/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Purchase
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedPurchases.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => router.post('/purchases/bulk-status', { ids: selectedPurchases, status: 'completed' })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Mark as Completed
                        </button>
                        <button
                            onClick={() => router.post('/purchases/bulk-status', { ids: selectedPurchases, status: 'draft' })}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Mark as Draft
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
                                            checked={selectedPurchases.length === purchases.data.length && purchases.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {purchases.data && purchases.data.length > 0 ? (
                                    purchases.data.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPurchases.includes(purchase.id)}
                                                    onChange={() => handleSelectPurchase(purchase.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{purchase.invoice_no}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {purchase.supplier ? purchase.supplier.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {purchase.warehouse ? purchase.warehouse.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(purchase.purchase_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                ${Number(purchase.total).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(purchase.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                                                >
                                                    {purchase.status === 'completed' ? 'Completed' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(purchase.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(purchase.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(purchase.id)}
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
                                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No purchases found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {purchases.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {purchases.from} to {purchases.to} of {purchases.total} purchases
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(purchases.current_page - 1)}
                                    disabled={purchases.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {purchases.current_page} of {purchases.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(purchases.current_page + 1)}
                                    disabled={purchases.current_page === purchases.last_page}
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
                        setPurchaseToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Purchase"
                    message="Are you sure you want to delete this purchase? This action cannot be undone."
                />
            </div>
        </>
    );
}
