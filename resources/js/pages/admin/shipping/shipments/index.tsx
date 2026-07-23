import { Head, router } from '@inertiajs/react';
import { FaEye, FaSync, FaSearch } from "react-icons/fa";
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { toast } from 'sonner';

interface Shipment {
    id: number;
    tracking_number: string;
    courier: string;
    status: string;
    shipping_cost: number;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    estimated_delivery_at: string;
    created_at: string;
    order: {
        id: number;
        order_no: string;
        customer_name: string;
    };
    shipping_method: {
        id: number;
        name: string;
    } | null;
    shipping_zone: {
        id: number;
        name: string;
    } | null;
}

interface ShipmentsProps {
    shipments: {
        data: Shipment[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        courier: string;
    };
}

export default function Shipments({ shipments, filters }: ShipmentsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleView = (shipmentId: number) => {
        router.get(`/shipments/${shipmentId}`);
    };

    const handleSyncWithCourier = (shipmentId: number) => {
        router.post(`/shipments/${shipmentId}/sync-courier`, {}, {
            onSuccess: () => {
                toast.success('Shipment synced with courier successfully');
            },
            onError: () => {
                toast.error('Failed to sync shipment with courier');
            },
        });
    };

    const navigate = (overrides: Partial<{ search: string; status: string; courier: string; page: number }> = {}) => {
        router.get('/shipments', {
            search: searchTerm,
            status: filters.status,
            courier: filters.courier,
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

    const handleStatusChange = (status: string) => {
        navigate({ status, page: 1 });
    };

    const handleCourierChange = (courier: string) => {
        navigate({ courier, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'picked_up': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'in_transit': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            case 'out_for_delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'returned': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
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
            <Head title="Shipments" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Shipments</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search by tracking number..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                            <option value="returned">Returned</option>
                        </select>
                        <select
                            value={filters.courier}
                            onChange={(e) => handleCourierChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Couriers</option>
                            <option value="pathao">Pathao</option>
                            <option value="redx">RedX</option>
                            <option value="steadfast">Steadfast</option>
                            <option value="sundarban">Sundarban</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Courier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {shipments.data && shipments.data.length > 0 ? (
                                    shipments.data.map((shipment) => (
                                        <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{shipment.tracking_number}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">{shipment.order.order_no}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{shipment.order.customer_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">{shipment.recipient_name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{shipment.recipient_phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getCourierBadgeColor(shipment.courier)}`}>
                                                    {shipment.courier.charAt(0).toUpperCase() + shipment.courier.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                                                    {shipment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ৳{Number(shipment.shipping_cost).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(shipment.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {shipment.courier !== 'custom' && (
                                                    <button
                                                        onClick={() => handleSyncWithCourier(shipment.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                        title="Sync with Courier"
                                                    >
                                                        <FaSync className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No shipments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {shipments.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {shipments.from} to {shipments.to} of {shipments.total} shipments
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(shipments.current_page - 1)}
                                    disabled={shipments.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {shipments.current_page} of {shipments.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(shipments.current_page + 1)}
                                    disabled={shipments.current_page === shipments.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
