import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaCheck } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductVariant {
    id: number;
    sku: string;
    product?: {
        name: string;
    };
}

interface Warehouse {
    id: number;
    name: string;
}

interface StockTransferItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    product_variant?: ProductVariant;
}

interface StockTransfer {
    id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    transfer_date: string;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    from_warehouse?: Warehouse;
    to_warehouse?: Warehouse;
    items?: StockTransferItem[];
}

interface ShowStockTransferProps {
    transfer: StockTransfer;
}

export default function ShowStockTransfer({ transfer }: ShowStockTransferProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/stock-transfers/${transfer.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/stock-transfers/${transfer.id}`, {
            onSuccess: () => {
                toast.success('Stock transfer deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete stock transfer');
            },
        });
    };

    const handleComplete = () => {
        router.post(`/stock-transfers/${transfer.id}/complete`, {}, {
            onSuccess: () => {
                toast.success('Stock transfer completed successfully');
            },
            onError: () => {
                toast.error('Failed to complete stock transfer');
            },
        });
    };

    return (
        <>
            <Head title={`Stock Transfer #${transfer.id}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/stock-transfers')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">Stock Transfer #{transfer.id}</h1>
                            <span className={`px-2 py-1 text-xs rounded-full ${transfer.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                {transfer.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {transfer.status === 'pending' && (
                                <button
                                    onClick={handleComplete}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaCheck />
                                    Complete Transfer
                                </button>
                            )}
                            <button
                                onClick={handleEdit}
                                disabled={transfer.status === 'completed'}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                disabled={transfer.status === 'completed'}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Transfer Details */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Transfer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From Warehouse</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-bold">{transfer.from_warehouse?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To Warehouse</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-bold">{transfer.to_warehouse?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Transfer Date</label>
                                    <p className="text-gray-900 dark:text-gray-100">{new Date(transfer.transfer_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${transfer.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                        {transfer.status === 'completed' ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</label>
                                    <p className="text-gray-900 dark:text-gray-100">{transfer.items?.length || 0}</p>
                                </div>
                            </div>
                            {transfer.notes && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{transfer.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Transfer Items */}
                        {transfer.items && transfer.items.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Transfer Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transfer.items.map((item) => (
                                                <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{item.product_variant?.sku || '-'}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{item.product_variant?.product?.name || '-'}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100 font-bold">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Timestamps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(transfer.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(transfer.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Stock Transfer"
                        message="Are you sure you want to delete this stock transfer? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
