import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface Supplier {
    id: number;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    purchases?: Array<{
        id: number;
        invoice_no: string;
        purchase_date: string;
        total: number;
        status: string;
    }>;
}

interface ShowSupplierProps {
    supplier: Supplier;
}

export default function ShowSupplier({ supplier }: ShowSupplierProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/suppliers/${supplier.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/suppliers/${supplier.id}`, {
            onSuccess: () => {
                toast.success('Supplier deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete supplier');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/suppliers/${supplier.id}/toggle-status`);
    };

    return (
        <>
            <Head title={`Supplier: ${supplier.name}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/suppliers')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{supplier.name}</h1>
                            <button
                                onClick={handleToggleStatus}
                                className={`px-2 py-1 text-xs rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                            >
                                {supplier.status === 'active' ? 'Active' : 'Inactive'}
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
                        {/* Contact Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
                                    <p className="text-gray-900 dark:text-gray-100">{supplier.company || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                    <p className="text-gray-900 dark:text-gray-100">{supplier.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                    <p className="text-gray-900 dark:text-gray-100">{supplier.phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`px-2 py-1 text-xs rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                    >
                                        {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                            {supplier.address && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{supplier.address}</p>
                                </div>
                            )}
                            {supplier.notes && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{supplier.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Purchase History */}
                        {supplier.purchases && supplier.purchases.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Purchase History</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Invoice No</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {supplier.purchases.map((purchase) => (
                                                <tr key={purchase.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{purchase.invoice_no}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(purchase.total).toFixed(2)}</td>
                                                    <td className="py-2">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                            {purchase.status === 'completed' ? 'Completed' : 'Draft'}
                                                        </span>
                                                    </td>
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
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(supplier.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(supplier.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Supplier"
                        message="Are you sure you want to delete this supplier? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
