import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaMoneyBillWave, FaUser, FaCalendar, FaCreditCard, FaReceipt } from 'react-icons/fa';

interface Collection {
    id: number;
    user: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
    collector: {
        id: number;
        name: string;
    };
    amount: string;
    payment_method: string;
    transaction_id: string | null;
    notes: string | null;
    created_at: string;
}

interface Props {
    collection: Collection;
}

const DueCollectionShow: React.FC<Props> = ({ collection }) => {
    const { props } = usePage();
    const flash = props.flash as any;

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return <FaMoneyBillWave className="text-green-600" />;
            case 'card':
                return <FaCreditCard className="text-blue-600" />;
            case 'bkash':
                return <FaReceipt className="text-pink-600" />;
            case 'nagad':
                return <FaReceipt className="text-orange-600" />;
            default:
                return <FaMoneyBillWave />;
        }
    };

    return (
        <>
            <Head title={`Due Collection #${collection.id}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/due-collections"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Collections
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Due Collection Details</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Collection ID: #{collection.id}</p>
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

                    {/* Collection Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaUser className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Customer</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{collection.user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{collection.user.phone || collection.user.email}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaMoneyBillWave className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">${collection.amount}</div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaCreditCard className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(collection.payment_method)}
                                <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                    {collection.payment_method}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaCalendar className="text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(collection.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(collection.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    {/* Collection Details */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Collection Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Collected By
                                </label>
                                <div className="text-gray-900 dark:text-white font-medium">{collection.collector.name}</div>
                            </div>
                            {collection.transaction_id && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Transaction ID
                                    </label>
                                    <div className="text-gray-900 dark:text-white font-medium">{collection.transaction_id}</div>
                                </div>
                            )}
                            {collection.notes && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Notes
                                    </label>
                                    <div className="text-gray-900 dark:text-white">{collection.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="flex gap-3">
                            <Link
                                href={`/customers/${collection.user.id}`}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <FaUser className="mr-2" /> View Customer
                            </Link>
                            <Link
                                href="/due-collections"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >
                                Back to Collections
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DueCollectionShow;
