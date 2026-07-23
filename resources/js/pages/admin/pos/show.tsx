import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaPrint, FaTimes, FaUser, FaWarehouse, FaCalendar, FaMoneyBillWave, FaBox, FaCreditCard } from 'react-icons/fa';
import { toast } from 'sonner';

interface PosOrderItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    discount: number;
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

interface PosPayment {
    id: number;
    amount: number;
    payment_method: string;
    transaction_id: string | null;
    notes: string | null;
    received_by: number;
    created_at: string;
    receiver: {
        id: number;
        name: string;
    };
}

interface PosOrder {
    id: number;
    order_number: string;
    user_id: number | null;
    warehouse_id: number | null;
    customer_name: string | null;
    customer_phone: string | null;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paid_amount: number;
    due_amount: number;
    payment_status: string;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    warehouse?: {
        id: number;
        name: string;
    };
    creator?: {
        id: number;
        name: string;
    };
    items: PosOrderItem[];
    payments: PosPayment[];
}

interface ShowProps {
    order: PosOrder;
}

export default function PosOrderShow({ order }: ShowProps) {
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this order? This will restore stock and update customer account if applicable.')) {
            router.post(`/pos/${order.id}/cancel`, {}, {
                onSuccess: () => {
                    toast.success('Order cancelled successfully');
                },
                onError: () => {
                    toast.error('Failed to cancel order');
                },
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPaymentStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'due': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash': return <FaMoneyBillWave className="text-green-600" />;
            case 'card': return <FaCreditCard className="text-blue-600" />;
            default: return <FaMoneyBillWave className="text-gray-600" />;
        }
    };

    return (
        <>
            <Head title={`POS Order ${order.order_number}`} />
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
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <FaPrint />
                            Print
                        </button>
                        {order.status === 'completed' && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FaTimes />
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Info */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white">{order.order_number}</h1>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusBadgeColor(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <FaCalendar />
                                        {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-start gap-2">
                                    <FaUser className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Customer</div>
                                        <div className="font-medium dark:text-white">
                                            {order.user ? order.user.name : order.customer_name || 'Walk-in Customer'}
                                        </div>
                                        {order.customer_phone && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer_phone}</div>
                                        )}
                                        {order.user && order.user.email && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                                        )}
                                    </div>
                                </div>

                                {order.warehouse && (
                                    <div className="flex items-start gap-2">
                                        <FaWarehouse className="text-gray-400 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Warehouse</div>
                                            <div className="font-medium dark:text-white">{order.warehouse.name}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-2">
                                    <FaUser className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Created By</div>
                                        <div className="font-medium dark:text-white">{order.creator?.name || 'Unknown'}</div>
                                    </div>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                                    <div className="text-sm dark:text-gray-200">{order.notes}</div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                                <FaBox />
                                Order Items ({order.items.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium dark:text-white">{item.variant.product.name}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.variant.sku}</td>
                                                <td className="px-4 py-3 text-right text-sm dark:text-gray-200">${Number(item.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center text-sm dark:text-gray-200">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right text-sm font-medium dark:text-white">${Number(item.subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payments */}
                        {order.payments.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                                    <FaMoneyBillWave />
                                    Payments ({order.payments.length})
                                </h2>
                                <div className="space-y-3">
                                    {order.payments.map((payment) => (
                                        <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {getPaymentMethodIcon(payment.payment_method)}
                                                <div>
                                                    <div className="font-medium dark:text-white capitalize">{payment.payment_method}</div>
                                                    {payment.transaction_id && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">TXN: {payment.transaction_id}</div>
                                                    )}
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Received by {payment.receiver.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-green-600 dark:text-green-400">
                                                    ${Number(payment.amount).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(payment.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 sticky top-6">
                            <h2 className="text-lg font-bold dark:text-white mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>${Number(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Tax</span>
                                    <span>${Number(order.tax).toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                        <span>Discount</span>
                                        <span>-${Number(order.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t dark:border-neutral-700 pt-3">
                                    <div className="flex justify-between text-lg font-bold dark:text-white">
                                        <span>Total</span>
                                        <span>${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="border-t dark:border-neutral-700 pt-3 space-y-2">
                                    <div className="flex justify-between text-sm dark:text-gray-300">
                                        <span>Paid Amount</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            ${Number(order.paid_amount).toFixed(2)}
                                        </span>
                                    </div>
                                    {order.due_amount > 0 && (
                                        <div className="flex justify-between text-sm dark:text-gray-300">
                                            <span>Due Amount</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">
                                                ${Number(order.due_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {order.due_amount > 0 && order.user_id && (
                                <div className="mt-6 pt-4 border-t dark:border-neutral-700">
                                    <button
                                        onClick={() => router.get('/pos', { customer_id: order.user_id })}
                                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Record Payment
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
