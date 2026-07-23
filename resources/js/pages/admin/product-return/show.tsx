import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaCheck, FaTimes, FaBox, FaUser, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'sonner';

interface ReturnItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    refund_price: number;
    condition: string;
    restock_status: string;
    notes: string | null;
    variant: {
        id: number;
        sku: string;
        price: number;
        product: {
            id: number;
            name: string;
        };
    };
}

interface ProductReturn {
    id: number;
    return_number: string;
    order_type: string;
    order_id: number;
    user_id: number | null;
    customer_name: string | null;
    customer_phone: string | null;
    reason: string | null;
    status: string;
    return_type: string;
    refund_method: string;
    refund_amount: number;
    approved_by: number | null;
    approved_at: string | null;
    completed_at: string | null;
    notes: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    approver?: {
        id: number;
        name: string;
    };
    creator?: {
        id: number;
        name: string;
    };
    items: ReturnItem[];
    posOrder?: {
        id: number;
        order_number: string;
    };
    order?: {
        id: number;
        order_no: string;
    };
}

interface ShowProps {
    return: ProductReturn;
}

export default function ProductReturnShow({ return: returnData }: ShowProps) {
    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this return? This will restock items and process refund.')) {
            router.post(`/product-returns/${returnData.id}/approve`, {}, {
                onSuccess: () => {
                    toast.success('Return approved successfully');
                },
                onError: () => {
                    toast.error('Failed to approve return');
                },
            });
        }
    };

    const handleReject = () => {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason !== null) {
            router.post(`/product-returns/${returnData.id}/reject`, { reason }, {
                onSuccess: () => {
                    toast.success('Return rejected successfully');
                },
                onError: () => {
                    toast.error('Failed to reject return');
                },
            });
        }
    };

    const handleComplete = () => {
        if (confirm('Are you sure you want to complete this return?')) {
            router.post(`/product-returns/${returnData.id}/complete`, {}, {
                onSuccess: () => {
                    toast.success('Return completed successfully');
                },
                onError: () => {
                    toast.error('Failed to complete return');
                },
            });
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getRestockStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getConditionBadgeColor = (condition: string) => {
        switch (condition) {
            case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'used': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'damaged': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <>
            <Head title={`Return ${returnData.return_number}`} />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                    <div className="flex gap-2">
                        {returnData.status === 'pending' && (
                            <>
                                <button
                                    onClick={handleApprove}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaCheck />
                                    Approve
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Reject
                                </button>
                            </>
                        )}
                        {returnData.status === 'approved' && (
                            <button
                                onClick={handleComplete}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaCheck />
                                Complete
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Return Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Return Info */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white">{returnData.return_number}</h1>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusBadgeColor(returnData.status)}`}>
                                            {returnData.status}
                                        </span>
                                        <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 capitalize">
                                            {returnData.return_type}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <FaCalendar />
                                        {new Date(returnData.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-start gap-2">
                                    <FaUser className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Customer</div>
                                        <div className="font-medium dark:text-white">
                                            {returnData.user ? returnData.user.name : returnData.customer_name || 'Unknown'}
                                        </div>
                                        {returnData.customer_phone && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{returnData.customer_phone}</div>
                                        )}
                                        {returnData.user && returnData.user.email && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{returnData.user.email}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <FaBox className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Order</div>
                                        <div className="font-medium dark:text-white">
                                            {returnData.order_type === 'pos_order' 
                                                ? returnData.posOrder?.order_number 
                                                : returnData.order?.order_no}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            {returnData.order_type === 'pos_order' ? 'POS Order' : 'Online Order'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <FaMoneyBillWave className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Refund Method</div>
                                        <div className="font-medium dark:text-white capitalize">{returnData.refund_method}</div>
                                    </div>
                                </div>

                                {returnData.approver && (
                                    <div className="flex items-start gap-2">
                                        <FaUser className="text-gray-400 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Approved By</div>
                                            <div className="font-medium dark:text-white">{returnData.approver.name}</div>
                                            {returnData.approved_at && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(returnData.approved_at).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {returnData.reason && (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</div>
                                    <div className="text-sm dark:text-gray-200">{returnData.reason}</div>
                                </div>
                            )}

                            {returnData.notes && (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                                    <div className="text-sm dark:text-gray-200">{returnData.notes}</div>
                                </div>
                            )}
                        </div>

                        {/* Return Items */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                                <FaBox />
                                Return Items ({returnData.items.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Refund Price</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Condition</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Restock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                        {returnData.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium dark:text-white">{item.variant.product.name}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.variant.sku}</td>
                                                <td className="px-4 py-3 text-center text-sm dark:text-gray-200">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right text-sm font-medium dark:text-white">${Number(item.refund_price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getConditionBadgeColor(item.condition)}`}>
                                                        {item.condition}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getRestockStatusBadgeColor(item.restock_status)}`}>
                                                        {item.restock_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Return Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 sticky top-6">
                            <h2 className="text-lg font-bold dark:text-white mb-4">Return Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Total Items</span>
                                    <span className="font-medium dark:text-white">{returnData.items.length}</span>
                                </div>
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Total Quantity</span>
                                    <span className="font-medium dark:text-white">{returnData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                </div>
                                <div className="border-t dark:border-neutral-700 pt-3">
                                    <div className="flex justify-between text-lg font-bold dark:text-white">
                                        <span>Refund Amount</span>
                                        <span className="text-green-600 dark:text-green-400">${Number(returnData.refund_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {returnData.status === 'pending' && (
                                <div className="mt-6 pt-4 border-t dark:border-neutral-700 space-y-2">
                                    <button
                                        onClick={handleApprove}
                                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Approve Return
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Reject Return
                                    </button>
                                </div>
                            )}

                            {returnData.status === 'approved' && (
                                <div className="mt-6 pt-4 border-t dark:border-neutral-700">
                                    <button
                                        onClick={handleComplete}
                                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Complete Return
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
