import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaCheck, FaTimes, FaDollarSign } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface OrderItem {
    id: number;
    product_name: string;
    product_sku: string | null;
}

interface Order {
    id: number;
    order_no: string;
    customer_name: string;
}

interface OrderReturn {
    id: number;
    return_no: string;
    order_id: number;
    order_item_id: number;
    user_id: number | null;
    reason: string;
    description: string | null;
    status: string;
    quantity: number;
    refund_amount: number | null;
    refund_status: string;
    admin_notes: string | null;
    requested_date: string;
    processed_date: string | null;
    created_at: string;
    order?: Order;
    orderItem?: OrderItem;
    user?: {
        name: string;
        email: string;
    };
}

interface ShowReturnProps {
    return: OrderReturn;
}

export default function ShowReturn({ return: returnItem }: ShowReturnProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState(returnItem.admin_notes || '');
    const [refundAmount, setRefundAmount] = useState(returnItem.refund_amount || 0);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/order-returns/${returnItem.id}`, {
            onSuccess: () => {
                toast.success('Return deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete return');
            },
        });
    };

    const handleApprove = () => {
        router.post(`/order-returns/${returnItem.id}/approve`, {
            admin_notes: adminNotes,
            refund_amount: refundAmount || null,
        }, {
            onSuccess: () => {
                toast.success('Return approved successfully');
                setApproveModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to approve return');
            },
        });
    };

    const handleReject = () => {
        router.post(`/order-returns/${returnItem.id}/reject`, {
            admin_notes: adminNotes,
        }, {
            onSuccess: () => {
                toast.success('Return rejected successfully');
                setRejectModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to reject return');
            },
        });
    };

    const handleComplete = () => {
        router.post(`/order-returns/${returnItem.id}/complete`, {
            refund_amount: refundAmount,
            admin_notes: adminNotes,
        }, {
            onSuccess: () => {
                toast.success('Return completed and refund processed successfully');
                setCompleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to complete return');
            },
        });
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

    const getRefundStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'processed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const canBeApproved = returnItem.status === 'pending';
    const canBeRejected = returnItem.status === 'pending';
    const canBeCompleted = returnItem.status === 'approved';

    return (
        <>
            <Head title={`Return: ${returnItem.return_no}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/order-returns')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{returnItem.return_no}</h1>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(returnItem.status)}`}>
                                {returnItem.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {canBeApproved && (
                                <button
                                    onClick={() => setApproveModalOpen(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaCheck />
                                    Approve
                                </button>
                            )}
                            {canBeRejected && (
                                <button
                                    onClick={() => setRejectModalOpen(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Reject
                                </button>
                            )}
                            {canBeCompleted && (
                                <button
                                    onClick={() => setCompleteModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <FaDollarSign />
                                    Process Refund
                                </button>
                            )}
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Return Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Return Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Return No</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.return_no}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order No</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.order?.order_no || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.order?.customer_name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User Account</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.user ? returnItem.user.name : 'Guest'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Product Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.orderItem?.product_name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.orderItem?.product_sku || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Return Quantity</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.quantity}</p>
                                </div>
                            </div>
                        </div>

                        {/* Return Details */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Return Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</label>
                                    <p className="text-gray-900 dark:text-gray-100">{returnItem.reason}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{returnItem.description || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Refund Amount</label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {returnItem.refund_amount ? `$${Number(returnItem.refund_amount).toFixed(2)}` : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Refund Status</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getRefundStatusBadgeColor(returnItem.refund_status)}`}>
                                        {returnItem.refund_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Admin Notes</h2>
                            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{returnItem.admin_notes || 'No admin notes yet.'}</p>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Timestamps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Requested Date</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(returnItem.requested_date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed Date</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{returnItem.processed_date ? new Date(returnItem.processed_date).toLocaleString() : '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(returnItem.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Return"
                        message="Are you sure you want to delete this return? This action cannot be undone."
                    />

                    {/* Approve Modal */}
                    {approveModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Approve Return</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                                        placeholder="Add notes about this approval..."
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Refund Amount (optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setApproveModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reject Modal */}
                    {rejectModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Reject Return</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                                        placeholder="Add notes about this rejection..."
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setRejectModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Complete/Process Refund Modal */}
                    {completeModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Process Refund</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Refund Amount *
                                    </label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                                        placeholder="Add notes about this refund..."
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setCompleteModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleComplete}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Process Refund
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
