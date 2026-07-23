import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

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
}

interface Props {
    account: Account;
}

const CustomerAccountEdit: React.FC<Props> = ({ account }) => {
    const { data, setData, put, processing, errors } = useForm({
        credit_limit: account.credit_limit,
        is_active: account.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/customer-accounts/${account.id}`);
    };

    return (
        <>
            <Head title={`Edit Account - ${account.user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={`/customer-accounts/${account.id}`}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Account
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer Account</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{account.user.name}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={account.user.name}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Balance
                                    </label>
                                    <input
                                        type="text"
                                        value={`$${account.balance}`}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Credit Limit
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.credit_limit}
                                        onChange={(e) => setData('credit_limit', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    {errors.credit_limit && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.credit_limit}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total Due
                                    </label>
                                    <input
                                        type="text"
                                        value={`$${account.total_due}`}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Account Active
                                        </span>
                                    </label>
                                    {errors.is_active && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.is_active}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Link
                                    href={`/customer-accounts/${account.id}`}
                                    className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <FaSave className="mr-2" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerAccountEdit;
