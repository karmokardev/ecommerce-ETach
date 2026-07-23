import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface ShippingMethod {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    courier: string;
    base_cost: number;
    cost_per_weight: number;
    cost_per_item: number;
    min_order_amount: number | null;
    max_order_amount: number | null;
    estimated_delivery_days: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface ShippingMethodsProps {
    methods: ShippingMethod[];
    filters: {
        courier: string;
        active: boolean;
    };
}

export default function ShippingMethods({ methods, filters }: ShippingMethodsProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState<number | null>(null);

    const handleEdit = (methodId: number) => {
        router.get(`/shipping/methods/${methodId}/edit`);
    };

    const handleDeleteClick = (methodId: number) => {
        setMethodToDelete(methodId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (methodToDelete) {
            router.delete(`/shipping/methods/${methodToDelete}`, {
                onSuccess: () => {
                    toast.success('Shipping method deleted successfully');
                    setDeleteModalOpen(false);
                    setMethodToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete shipping method');
                },
            });
        }
    };

    const handleToggleActive = (methodId: number) => {
        router.patch(`/shipping/methods/${methodId}/toggle-active`, {}, {
            onSuccess: () => {
                toast.success('Shipping method status updated');
            },
            onError: () => {
                toast.error('Failed to update shipping method status');
            },
        });
    };

    const handleCourierFilter = (courier: string) => {
        router.get('/shipping/methods', { courier, active: filters.active }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleActiveFilter = (active: boolean) => {
        router.get('/shipping/methods', { courier: filters.courier, active }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getCourierBadgeColor = (courier: string) => {
        switch (courier) {
            case 'pathao': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'redx': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'steadfast': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'sundarban': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'custom': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="Shipping Methods" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Shipping Methods</h1>

                    <div className="flex items-center gap-4">
                        <select
                            value={filters.courier}
                            onChange={(e) => handleCourierFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Couriers</option>
                            <option value="pathao">Pathao</option>
                            <option value="redx">RedX</option>
                            <option value="steadfast">Steadfast</option>
                            <option value="sundarban">Sundarban</option>
                            <option value="custom">Custom</option>
                        </select>
                        <select
                            value={filters.active ? 'true' : 'false'}
                            onChange={(e) => handleActiveFilter(e.target.value === 'true')}
                            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <button
                            onClick={() => router.get('/shipping/methods/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Method
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Courier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery Days</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {methods && methods.length > 0 ? (
                                    methods.map((method) => (
                                        <tr key={method.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{method.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{method.slug}</div>
                                                {method.description && (
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{method.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getCourierBadgeColor(method.courier)}`}>
                                                    {method.courier.charAt(0).toUpperCase() + method.courier.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ৳{Number(method.base_cost).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {method.estimated_delivery_days} days
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleActive(method.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${method.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {method.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEdit(method.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(method.id)}
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
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No shipping methods found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setMethodToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Shipping Method"
                    message="Are you sure you want to delete this shipping method? This action cannot be undone."
                />
            </div>
        </>
    );
}
