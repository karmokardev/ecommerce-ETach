import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface ShippingZone {
    id: number;
    name: string;
    code: string;
    districts: string[];
    areas: string[] | null;
    base_rate: number;
    additional_rate: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface ShippingZonesProps {
    zones: ShippingZone[];
    filters: {
        active: boolean;
    };
}

export default function ShippingZones({ zones, filters }: ShippingZonesProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);

    const handleDeleteClick = (zoneId: number) => {
        setZoneToDelete(zoneId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (zoneToDelete) {
            router.delete(`/shipping/zones/${zoneToDelete}`, {
                onSuccess: () => {
                    toast.success('Shipping zone deleted successfully');
                    setDeleteModalOpen(false);
                    setZoneToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete shipping zone');
                },
            });
        }
    };

    const handleToggleActive = (zoneId: number) => {
        router.patch(`/shipping/zones/${zoneId}/toggle-active`, {}, {
            onSuccess: () => {
                toast.success('Shipping zone status updated');
            },
            onError: () => {
                toast.error('Failed to update shipping zone status');
            },
        });
    };

    const handleActiveFilter = (active: boolean) => {
        router.get('/shipping/zones', { active }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Shipping Zones" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Shipping Zones</h1>

                    <div className="flex items-center gap-4">
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
                            onClick={() => router.get('/shipping/zones/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Zone
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Districts</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {zones && zones.length > 0 ? (
                                    zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{zone.name}</div>
                                                {zone.areas && zone.areas.length > 0 && (
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        {zone.areas.length} specific areas
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {zone.code}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {zone.districts.slice(0, 3).join(', ')}
                                                    {zone.districts.length > 3 && ` +${zone.districts.length - 3} more`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ৳{Number(zone.base_rate).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleActive(zone.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${zone.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {zone.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleDeleteClick(zone.id)}
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
                                            No shipping zones found
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
                        setZoneToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Shipping Zone"
                    message="Are you sure you want to delete this shipping zone? This action cannot be undone."
                />
            </div>
        </>
    );
}
