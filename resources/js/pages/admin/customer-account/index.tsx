import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaUsers, FaDollarSign, FaCreditCard, FaBan, FaCheck, FaSearch, FaEdit, FaEye } from 'react-icons/fa';


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
}

interface Props {
    accounts: {
        data: Account[];
        links: any[];
        meta: any;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
        page: number;
    };
}

const CustomerAccountIndex: React.FC<Props> = ({ accounts, filters }) => {
    const { props } = usePage();
    const flash = props.flash as any;

    return (
        <>
            <Head title="Customer Accounts" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Accounts</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer credit accounts and balances</p>
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

                    {/* Filters */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search customers..."
                                        defaultValue={filters.search}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            <select
                                defaultValue={filters.status}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="due">With Due</option>
                            </select>
                        </div>
                    </div>

                    {/* Accounts Table */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credit Limit</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Due</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                                {accounts.data?.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 dark:text-white">{account.user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {account.user.phone || account.user.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${parseFloat(account.balance) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            ${account.balance}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                                            ${account.credit_limit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600 dark:text-red-400">
                                            ${account.total_due}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {account.is_active ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <FaCheck className="mr-1" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    <FaBan className="mr-1" /> Blocked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Link
                                                href={`/customer-accounts/${account.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/customer-accounts/${account.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <FaEdit />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {accounts.meta?.from || 0} to {accounts.meta?.to || 0} of {accounts.meta?.total || 0} results
                                </div>
                                <div className="flex gap-2">
                                    {accounts.links?.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-1 rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-gray-400"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerAccountIndex;
