import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface PurchaseItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    unit_cost: number;
    subtotal: number;
    product_variant?: {
        id: number;
        sku: string;
        product?: {
            name: string;
        };
    };
}

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
    items?: PurchaseItem[];
}

interface ShowPurchaseProps {
    purchase: Purchase;
}

export default function ShowPurchase({ purchase }: ShowPurchaseProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/purchases/${purchase.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/purchases/${purchase.id}`, {
            onSuccess: () => {
                toast.success('Purchase deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete purchase');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/purchases/${purchase.id}/toggle-status`);
    };

    return (
        <>
            <Head title={`Purchase: ${purchase.invoice_no}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/purchases')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{purchase.invoice_no}</h1>
                            <button
                                onClick={handleToggleStatus}
                                className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                            >
                                {purchase.status === 'completed' ? 'Completed' : 'Draft'}
                            </button>
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
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</label>
                                    <p className="text-gray-900 dark:text-gray-100">{purchase.supplier?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Warehouse</label>
                                    <p className="text-gray-900 dark:text-gray-100">{purchase.warehouse?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Date</label>
                                    <p className="text-gray-900 dark:text-gray-100">{new Date(purchase.purchase_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</label>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${Number(purchase.total).toFixed(2)}</p>
                                </div>
                            </div>
                            {purchase.notes && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{purchase.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Purchase Items */}
                        {purchase.items && purchase.items.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Purchase Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Unit Cost</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchase.items.map((item) => (
                                                <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{item.product_variant?.sku || '-'}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{item.product_variant?.product?.name || '-'}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{item.quantity}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(item.unit_cost).toFixed(2)}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-gray-200 dark:border-neutral-800">
                                                <td colSpan={4} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Total</td>
                                                <td className="py-2 text-sm font-bold text-gray-900 dark:text-gray-100">${Number(purchase.total).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
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
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(purchase.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(purchase.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Purchase"
                        message="Are you sure you want to delete this purchase? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
