import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductVariant {
    id: number;
    sku: string;
    current_stock: number;
    product?: {
        name: string;
        category?: {
            name: string;
        };
    };
}

interface Warehouse {
    id: number;
    name: string;
}

interface StockAdjustment {
    id: number;
    product_variant_id: number;
    warehouse_id: number;
    adjustment_type: string;
    quantity: number;
    reason: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    product_variant?: ProductVariant;
    warehouse?: Warehouse;
}

interface ShowStockAdjustmentProps {
    adjustment: StockAdjustment;
}

export default function ShowStockAdjustment({ adjustment }: ShowStockAdjustmentProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/stock-adjustments/${adjustment.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/stock-adjustments/${adjustment.id}`, {
            onSuccess: () => {
                toast.success('Stock adjustment deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete stock adjustment');
            },
        });
    };

    return (
        <>
            <Head title={`Stock Adjustment #${adjustment.id}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/stock-adjustments')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">Stock Adjustment #{adjustment.id}</h1>
                            <span className={`px-2 py-1 text-xs rounded-full ${adjustment.adjustment_type === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                {adjustment.adjustment_type === 'increase' ? 'Increase' : 'Decrease'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Adjustment Details */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Adjustment Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Variant</label>
                                    <p className="text-gray-900 dark:text-gray-100">{adjustment.product_variant?.sku || '-'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{adjustment.product_variant?.product?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Warehouse</label>
                                    <p className="text-gray-900 dark:text-gray-100">{adjustment.warehouse?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Adjustment Type</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${adjustment.adjustment_type === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {adjustment.adjustment_type === 'increase' ? 'Increase' : 'Decrease'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-bold">{adjustment.quantity}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</label>
                                    <p className="text-gray-900 dark:text-gray-100">{adjustment.product_variant?.current_stock || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                                    <p className="text-gray-900 dark:text-gray-100">{adjustment.product_variant?.product?.category?.name || '-'}</p>
                                </div>
                            </div>
                            {adjustment.reason && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</label>
                                    <p className="text-gray-900 dark:text-gray-100">{adjustment.reason}</p>
                                </div>
                            )}
                            {adjustment.notes && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{adjustment.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Timestamps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(adjustment.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(adjustment.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Stock Adjustment"
                        message="Are you sure you want to delete this stock adjustment? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
