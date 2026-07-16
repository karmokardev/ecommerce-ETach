import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface Warehouse {
    id: number;
    name: string;
    code: string;
    address: string | null;
    phone: string | null;
    manager_name: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    stock_movements?: Array<{
        id: number;
        type: string;
        quantity: number;
        before_stock: number;
        after_stock: number;
        remarks: string | null;
        created_at: string;
    }>;
}

interface ShowWarehouseProps {
    warehouse: Warehouse;
}

export default function ShowWarehouse({ warehouse }: ShowWarehouseProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/warehouses/${warehouse.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/warehouses/${warehouse.id}`, {
            onSuccess: () => {
                toast.success('Warehouse deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete warehouse');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/warehouses/${warehouse.id}/toggle-status`);
    };

    return (
        <>
            <Head title={`Warehouse: ${warehouse.name}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/warehouses')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{warehouse.name}</h1>
                            <button
                                onClick={handleToggleStatus}
                                className={`px-2 py-1 text-xs rounded-full ${warehouse.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                            >
                                {warehouse.status === 'active' ? 'Active' : 'Inactive'}
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
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</label>
                                    <p className="text-gray-900 dark:text-gray-100">{warehouse.code}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Manager</label>
                                    <p className="text-gray-900 dark:text-gray-100">{warehouse.manager_name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                    <p className="text-gray-900 dark:text-gray-100">{warehouse.phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`px-2 py-1 text-xs rounded-full ${warehouse.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                    >
                                        {warehouse.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                            {warehouse.address && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{warehouse.address}</p>
                                </div>
                            )}
                        </div>

                        {/* Stock Movements */}
                        {warehouse.stock_movements && warehouse.stock_movements.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Stock Movements</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Before</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">After</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {warehouse.stock_movements.map((movement) => (
                                                <tr key={movement.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.type}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.quantity}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.before_stock}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.after_stock}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{new Date(movement.created_at).toLocaleString()}</td>
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
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(warehouse.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(warehouse.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Warehouse"
                        message="Are you sure you want to delete this warehouse? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
