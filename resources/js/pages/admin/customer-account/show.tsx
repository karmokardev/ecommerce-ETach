import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaEdit, FaDollarSign, FaCreditCard, FaHistory, FaCalendar, FaUser } from 'react-icons/fa';

interface Transaction {
    id: number;
    type: string;
    amount: string;
    description: string | null;
    balance_after: string;
    created_at: string;
}

interface Account {
    id: number;
    user: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
    balance: string;
    credit_limit: string;
    total_due: string;
    is_active: boolean;
    last_payment_date: string | null;
    transactions: Transaction[];
}

interface Props {
    account: Account;
}

const CustomerAccountShow: React.FC<Props> = ({ account }) => {
    const { props } = usePage();
    const flash = props.flash as any;

    const getTransactionTypeColor = (type: string) => {
        switch (type) {
            case 'credit':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'debit':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'payment':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'refund':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-400';
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'credit':
                return <FaDollarSign className="text-green-600" />;
            case 'debit':
                return <FaDollarSign className="text-red-600" />;
            case 'payment':
                return <FaCreditCard className="text-blue-600" />;
            case 'refund':
                return <FaDollarSign className="text-purple-600" />;
            default:
                return <FaDollarSign />;
        }
    };

    return (
        <>
            <Head title={`Customer Account - ${account.user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/customer-accounts"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Accounts
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Account Details</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{account.user.name}</p>
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

                    {/* Account Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaUser className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Customer</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{account.user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{account.user.phone || account.user.email}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaDollarSign className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                            </div>
                            <div className={`text-lg font-bold ${parseFloat(account.balance) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                ${account.balance}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaCreditCard className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Credit Limit</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">${account.credit_limit}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Available: ${(parseFloat(account.credit_limit) + parseFloat(account.balance)).toFixed(2)}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaDollarSign className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Total Due</span>
                            </div>
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">${account.total_due}</div>
                            {account.last_payment_date && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Last: {new Date(account.last_payment_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4 mb-6">
                        <div className="flex gap-3">
                            <Link
                                href={`/customer-accounts/${account.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <FaEdit className="mr-2" /> Edit Account
                            </Link>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaHistory />
                            Transaction History
                        </h2>

                        {account.transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance After</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                                        {account.transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                                        {getTransactionIcon(transaction.type)}
                                                        <span className="ml-1 capitalize">{transaction.type}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.description || '-'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${['credit', 'refund'].includes(transaction.type) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {['credit', 'refund'].includes(transaction.type) ? '+' : '-'}${transaction.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                                                    ${transaction.balance_after}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(transaction.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No transactions found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerAccountShow;
