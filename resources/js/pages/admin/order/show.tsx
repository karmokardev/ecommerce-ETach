import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaFileInvoice, FaBox } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product_attributes: any;
    product?: {
        id: number;
        name: string;
    };
    variant?: {
        id: number;
        sku: string;
        attributes: any;
    };
}

interface OrderReturn {
    id: number;
    return_no: string;
    reason: string;
    status: string;
    quantity: number;
    refund_amount: number | null;
}

interface Order {
    id: number;
    order_no: string;
    user_id: number | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    billing_address: string | null;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: string;
    payment_status: string;
    status: string;
    notes: string | null;
    order_date: string;
    shipped_date: string | null;
    delivered_date: string | null;
    cancelled_date: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items?: OrderItem[];
    returns?: OrderReturn[];
}

interface ShowOrderProps {
    order: Order;
}

export default function ShowOrder({ order }: ShowOrderProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [paymentStatusModalOpen, setPaymentStatusModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);
    const [newPaymentStatus, setNewPaymentStatus] = useState(order.payment_status);

    const handleEdit = () => {
        router.get(`/orders/${order.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/orders/${order.id}`, {
            onSuccess: () => {
                toast.success('Order deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete order');
            },
        });
    };

    const handleStatusUpdate = () => {
        router.patch(`/orders/${order.id}/status`, { status: newStatus }, {
            onSuccess: () => {
                toast.success('Order status updated successfully');
                setStatusModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to update order status');
            },
        });
    };

    const handlePaymentStatusUpdate = () => {
        router.patch(`/orders/${order.id}/payment-status`, { payment_status: newPaymentStatus }, {
            onSuccess: () => {
                toast.success('Payment status updated successfully');
                setPaymentStatusModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to update payment status');
            },
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPaymentStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <>
            <Head title={`Order: ${order.order_no}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/orders')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{order.order_no}</h1>
                            <button
                                onClick={() => setStatusModalOpen(true)}
                                className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(order.status)}`}
                            >
                                {order.status}
                            </button>
                            <button
                                onClick={() => setPaymentStatusModalOpen(true)}
                                className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeColor(order.payment_status)}`}
                            >
                                {order.payment_status}
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.get(`/orders/${order.id}/invoice`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FaFileInvoice />
                                Invoice
                            </button>
                            <button
                                onClick={() => router.get(`/orders/${order.id}/packing-slip`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaBox />
                                Packing Slip
                            </button>
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
                        {/* Customer Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Customer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Name</label>
                                    <p className="text-gray-900 dark:text-gray-100">{order.customer_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                    <p className="text-gray-900 dark:text-gray-100">{order.customer_email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                    <p className="text-gray-900 dark:text-gray-100">{order.customer_phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User Account</label>
                                    <p className="text-gray-900 dark:text-gray-100">{order.user ? order.user.name : 'Guest'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Billing */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Shipping & Billing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{order.shipping_address}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Address</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{order.billing_address || 'Same as shipping'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</label>
                                    <p className="text-gray-900 dark:text-gray-100">{new Date(order.order_date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
                                    <p className="text-gray-900 dark:text-gray-100 capitalize">{order.payment_method}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</label>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${Number(order.total).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</label>
                                    <p className="text-gray-900 dark:text-gray-100">${Number(order.subtotal).toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping</label>
                                    <p className="text-gray-900 dark:text-gray-100">${Number(order.shipping_cost).toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax</label>
                                    <p className="text-gray-900 dark:text-gray-100">${Number(order.tax).toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</label>
                                    <p className="text-gray-900 dark:text-gray-100">${Number(order.discount).toFixed(2)}</p>
                                </div>
                            </div>
                            {order.notes && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{order.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Unit Price</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{item.product_name}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{item.product_sku || '-'}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{item.quantity}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(item.unit_price).toFixed(2)}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-gray-200 dark:border-neutral-800">
                                                <td colSpan={4} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Total</td>
                                                <td className="py-2 text-sm font-bold text-gray-900 dark:text-gray-100">${Number(order.total).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Order Returns */}
                        {order.returns && order.returns.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Returns</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Return No</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Reason</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Refund Amount</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.returns.map((ret) => (
                                                <tr key={ret.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{ret.return_no}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{ret.reason}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{ret.quantity}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${ret.refund_amount ? Number(ret.refund_amount).toFixed(2) : '-'}</td>
                                                    <td className="py-2">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(ret.status)}`}>
                                                            {ret.status}
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
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.updated_at).toLocaleString()}</p>
                                </div>
                                {order.shipped_date && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipped At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.shipped_date).toLocaleString()}</p>
                                    </div>
                                )}
                                {order.delivered_date && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.delivered_date).toLocaleString()}</p>
                                    </div>
                                )}
                                {order.cancelled_date && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancelled At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.cancelled_date).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Order"
                        message="Are you sure you want to delete this order? This action cannot be undone."
                    />

                    {/* Status Update Modal */}
                    {statusModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Update Order Status</h3>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 mb-4"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setStatusModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStatusUpdate}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Status Update Modal */}
                    {paymentStatusModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Update Payment Status</h3>
                                <select
                                    value={newPaymentStatus}
                                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 mb-4"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setPaymentStatusModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePaymentStatusUpdate}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Update
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
