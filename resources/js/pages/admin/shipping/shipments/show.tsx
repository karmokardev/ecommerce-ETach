import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaSync, FaBox, FaMapMarkerAlt, FaPhone, FaUser, FaCalendar, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from 'sonner';

interface Shipment {
    id: number;
    tracking_number: string;
    courier: string;
    status: string;
    tracking_url: string | null;
    tracking_history: Array<{
        status: string;
        description: string;
        location: string | null;
        timestamp: string;
    }> | null;
    shipping_cost: number;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    pickup_address: string | null;
    weight: number;
    length: number | null;
    width: number | null;
    height: number | null;
    package_type: string;
    notes: string | null;
    picked_up_at: string | null;
    delivered_at: string | null;
    estimated_delivery_at: string | null;
    created_at: string;
    order: {
        id: number;
        order_no: string;
        customer_name: string;
        customer_email: string;
        total: number;
        status: string;
    };
    shipping_method: {
        id: number;
        name: string;
        courier: string;
    } | null;
    shipping_zone: {
        id: number;
        name: string;
        base_rate: number;
    } | null;
}

interface ShipmentShowProps {
    shipment: Shipment;
}

export default function ShipmentShow({ shipment }: ShipmentShowProps) {
    const handleSyncWithCourier = () => {
        router.post(`/shipments/${shipment.id}/sync-courier`, {}, {
            onSuccess: () => {
                toast.success('Shipment synced with courier successfully');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to sync shipment with courier');
            },
        });
    };

    const handleStatusUpdate = (status: string) => {
        router.patch(`/shipments/${shipment.id}/status`, { status }, {
            onSuccess: () => {
                toast.success('Shipment status updated successfully');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to update shipment status');
            },
        });
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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const availableStatuses = [
        { value: 'pending', label: 'Pending', icon: FaBox },
        { value: 'picked_up', label: 'Picked Up', icon: FaTruck },
        { value: 'in_transit', label: 'In Transit', icon: FaTruck },
        { value: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck },
        { value: 'delivered', label: 'Delivered', icon: FaCheckCircle },
        { value: 'failed', label: 'Failed', icon: FaTimesCircle },
        { value: 'returned', label: 'Returned', icon: FaTimesCircle },
    ];

    return (
        <>
            <Head title={`Shipment ${shipment.tracking_number}`} />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/shipments')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Shipments
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Shipment Details</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Tracking Number: {shipment.tracking_number}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipment Status Card */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-white mb-2">Current Status</h2>
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                                        {shipment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                                {shipment.courier !== 'custom' && shipment.courier !== 'sundarban' && (
                                    <button
                                        onClick={handleSyncWithCourier}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FaSync />
                                        Sync with Courier
                                    </button>
                                )}
                            </div>

                            {/* Status Timeline */}
                            <div className="space-y-2">
                                {availableStatuses.map((status, index) => {
                                    const Icon = status.icon;
                                    const isCurrent = shipment.status === status.value;
                                    const isPast = availableStatuses.findIndex(s => s.value === shipment.status) > index;
                                    
                                    return (
                                        <div key={status.value} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isCurrent ? 'bg-blue-600 text-white' : 
                                                isPast ? 'bg-green-600 text-white' : 
                                                'bg-gray-200 dark:bg-neutral-700 text-gray-400'
                                            }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm ${
                                                isCurrent ? 'font-semibold text-gray-900 dark:text-gray-100' : 
                                                isPast ? 'text-gray-600 dark:text-gray-400' : 
                                                'text-gray-400 dark:text-gray-500'
                                            }`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Order Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Order Number</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{shipment.order.order_no}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Customer</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{shipment.order.customer_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                    <p className="text-gray-900 dark:text-gray-100">{shipment.order.customer_email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Order Total</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">৳{Number(shipment.order.total).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tracking History */}
                        {shipment.tracking_history && shipment.tracking_history.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold dark:text-white mb-4">Tracking History</h2>
                                <div className="space-y-4">
                                    {shipment.tracking_history.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {event.description}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(event.timestamp)}
                                                    </span>
                                                </div>
                                                {event.location && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                                                        {event.location}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Details */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Shipping Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Courier</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getCourierBadgeColor(shipment.courier)}`}>
                                            {shipment.courier.charAt(0).toUpperCase() + shipment.courier.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                {shipment.shipping_method && (
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Shipping Method</label>
                                        <p className="text-gray-900 dark:text-gray-100">{shipment.shipping_method.name}</p>
                                    </div>
                                )}
                                {shipment.shipping_zone && (
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Shipping Zone</label>
                                        <p className="text-gray-900 dark:text-gray-100">{shipment.shipping_zone.name}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Package Type</label>
                                    <p className="text-gray-900 dark:text-gray-100 capitalize">{shipment.package_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Weight</label>
                                    <p className="text-gray-900 dark:text-gray-100">{shipment.weight} kg</p>
                                </div>
                                {(shipment.length || shipment.width || shipment.height) && (
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Dimensions</label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {shipment.length}×{shipment.width}×{shipment.height} cm
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Shipping Cost</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">৳{Number(shipment.shipping_cost).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Recipient Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-400" />
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                                        <p className="text-gray-900 dark:text-gray-100">{shipment.recipient_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaPhone className="text-gray-400" />
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                                        <p className="text-gray-900 dark:text-gray-100">{shipment.recipient_phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</label>
                                        <p className="text-gray-900 dark:text-gray-100 text-sm">{shipment.shipping_address}</p>
                                    </div>
                                </div>
                                {shipment.pickup_address && (
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">Pickup Address</label>
                                            <p className="text-gray-900 dark:text-gray-100 text-sm">{shipment.pickup_address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Timeline</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="text-gray-400" />
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="text-gray-900 dark:text-gray-100 text-sm">{formatDate(shipment.created_at)}</p>
                                    </div>
                                </div>
                                {shipment.picked_up_at && (
                                    <div className="flex items-center gap-2">
                                        <FaTruck className="text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">Picked Up</label>
                                            <p className="text-gray-900 dark:text-gray-100 text-sm">{formatDate(shipment.picked_up_at)}</p>
                                        </div>
                                    </div>
                                )}
                                {shipment.delivered_at && (
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">Delivered</label>
                                            <p className="text-gray-900 dark:text-gray-100 text-sm">{formatDate(shipment.delivered_at)}</p>
                                        </div>
                                    </div>
                                )}
                                {shipment.estimated_delivery_at && (
                                    <div className="flex items-center gap-2">
                                        <FaCalendar className="text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</label>
                                            <p className="text-gray-900 dark:text-gray-100 text-sm">{formatDate(shipment.estimated_delivery_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Update Status */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Update Status</h2>
                            <select
                                value={shipment.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300"
                            >
                                {availableStatuses.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Notes */}
                        {shipment.notes && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold dark:text-white mb-4">Notes</h2>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{shipment.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
