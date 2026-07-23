import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaEdit, FaDollarSign, FaShoppingCart, FaHistory, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

interface PosOrder {
    id: number;
    order_number: string;
    total: string;
    paid_amount: string;
    due_amount: string;
    status: string;
    created_at: string;
}

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    customer_account: {
        id: number;
        balance: string;
        credit_limit: string;
        total_due: string;
        is_active: boolean;
        last_payment_date: string | null;
        transactions: any[];
    } | null;
}

interface Props {
    customer: Customer;
    posOrders: PosOrder[];
}

const CustomerShow: React.FC<Props> = ({ customer, posOrders }) => {
    const { props } = usePage();
    const flash = props.flash as any;

    return (
        <>
            <Head title={`Customer - ${customer.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/customers"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Customers
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Details</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{customer.name}</p>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaUser className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{customer.name}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaPhone className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">{customer.phone || 'N/A'}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaEnvelope className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">{customer.email || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Account Info */}
                    {customer.customer_account ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaDollarSign className="text-gray-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                                </div>
                                <div className={`text-lg font-bold ${parseFloat(customer.customer_account.balance) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    ${customer.customer_account.balance}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaDollarSign className="text-gray-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Credit Limit</span>
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">${customer.customer_account.credit_limit}</div>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaDollarSign className="text-gray-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Due</span>
                                </div>
                                <div className="text-lg font-bold text-red-600 dark:text-red-400">${customer.customer_account.total_due}</div>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaHistory className="text-gray-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                                </div>
                                <div className={`text-lg font-bold ${customer.customer_account.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {customer.customer_account.is_active ? 'Active' : 'Blocked'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-lg mb-6">
                            This customer does not have a credit account. <Link href={`/customers/${customer.id}/edit`} className="underline font-medium">Create one</Link>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4 mb-6">
                        <div className="flex gap-3">
                            <Link
                                href={`/customers/${customer.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <FaEdit className="mr-2" /> Edit Customer
                            </Link>
                            {customer.customer_account && (
                                <Link
                                    href={`/customer-accounts/${customer.customer_account.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <FaDollarSign className="mr-2" /> View Account
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Recent POS Orders */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaShoppingCart />
                            Recent POS Orders
                        </h2>

                        {posOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order #</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                                        {posOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                                                    ${order.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 dark:text-green-400">
                                                    ${order.paid_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400">
                                                    ${order.due_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No POS orders found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerShow;
