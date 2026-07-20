import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface StockTransfer {
    id: number;
    transfer_no: string;
    from_warehouse_id: number;
    to_warehouse_id: number;
    transfer_date: string;
    status: string;
    notes: string | null;
    created_at: string;
    from_warehouse?: {
        id: number;
        name: string;
    };
    to_warehouse?: {
        id: number;
        name: string;
    };
    items?: Array<{
        id: number;
        product_variant_id: number;
        quantity: number;
        product_variant?: {
            sku: string;
            product?: {
                name: string;
            };
        };
    }>;
}

interface StockTransfersProps {
    transfers: {
        data: StockTransfer[];
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

export default function StockTransfers({ transfers, filters }: StockTransfersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [transferToDelete, setTransferToDelete] = useState<number | null>(null);
    const [selectedTransfers, setSelectedTransfers] = useState<number[]>([]);

    const handleView = (transferId: number) => {
        router.get(`/stock-transfers/${transferId}`);
    };

    const handleEdit = (transferId: number) => {
        router.get(`/stock-transfers/${transferId}/edit`);
    };

    const handleDeleteClick = (transferId: number) => {
        setTransferToDelete(transferId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (transferToDelete) {
            router.delete(`/stock-transfers/${transferToDelete}`, {
                onSuccess: () => {
                    toast.success('Stock transfer deleted successfully');
                    setDeleteModalOpen(false);
                    setTransferToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete stock transfer');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number; per_page: number }> = {}) => {
        router.get('/stock-transfers', {
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
            setSelectedTransfers(transfers.data.map((tr) => tr.id));
        } else {
            setSelectedTransfers([]);
        }
    };

    const handleSelectTransfer = (transferId: number) => {
        if (selectedTransfers.includes(transferId)) {
            setSelectedTransfers(selectedTransfers.filter(id => id !== transferId));
        } else {
            setSelectedTransfers([...selectedTransfers, transferId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedTransfers.length > 0) {
            router.post('/stock-transfers/bulk-delete', { ids: selectedTransfers }, {
                onSuccess: () => {
                    toast.success('Stock transfers deleted successfully');
                    setSelectedTransfers([]);
                },
                onError: () => {
                    toast.error('Failed to delete stock transfers');
                },
            });
        }
    };

    const handleToggleStatus = (transferId: number) => {
        router.patch(`/stock-transfers/${transferId}/toggle-status`);
    };

    return (
        <>
            <Head title="Stock Transfers Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Stock Transfers Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search transfers..."
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
                            onClick={() => router.get('/stock-transfers/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Transfer
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedTransfers.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => router.post('/stock-transfers/bulk-status', { ids: selectedTransfers, status: 'completed' })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Mark as Completed
                        </button>
                        <button
                            onClick={() => router.post('/stock-transfers/bulk-status', { ids: selectedTransfers, status: 'pending' })}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Mark as Pending
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
                                            checked={selectedTransfers.length === transfers.data.length && transfers.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transfer No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From Warehouse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To Warehouse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {transfers.data && transfers.data.length > 0 ? (
                                    transfers.data.map((transfer) => (
                                        <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTransfers.includes(transfer.id)}
                                                    onChange={() => handleSelectTransfer(transfer.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{transfer.transfer_no}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {transfer.from_warehouse ? transfer.from_warehouse.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {transfer.to_warehouse ? transfer.to_warehouse.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(transfer.transfer_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {transfer.items?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(transfer.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${transfer.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                                                >
                                                    {transfer.status === 'completed' ? 'Completed' : 'Pending'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(transfer.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(transfer.id)}
                                                    disabled={transfer.status === 'completed'}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mr-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(transfer.id)}
                                                    disabled={transfer.status === 'completed'}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            No stock transfers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transfers.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {transfers.from} to {transfers.to} of {transfers.total} transfers
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(transfers.current_page - 1)}
                                    disabled={transfers.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {transfers.current_page} of {transfers.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(transfers.current_page + 1)}
                                    disabled={transfers.current_page === transfers.last_page}
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
                        setTransferToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Stock Transfer"
                    message="Are you sure you want to delete this stock transfer? This action cannot be undone."
                />
            </div>
        </>
    );
}
