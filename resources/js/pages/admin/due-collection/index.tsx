import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaPlus, FaCalendar, FaFilter } from 'react-icons/fa';
import { toast } from 'sonner';

interface DueCollection {
    id: number;
    user_id: number;
    amount: number;
    payment_method: string;
    transaction_id: string | null;
    collected_by: number;
    notes: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        phone: string | null;
    };
    collector: {
        id: number;
        name: string;
    };
}

interface CollectionsProps {
    collections: {
        data: DueCollection[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        payment_method: string;
        date_from: string;
        date_to: string;
        per_page: number;
        page: number;
    };
}

const paymentMethodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
];

export default function DueCollectionsIndex({ collections, filters }: CollectionsProps) {
    const [paymentMethodFilter, setPaymentMethodFilter] = useState(filters.payment_method || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleView = (collectionId: number) => {
        router.get(`/due-collections/${collectionId}`);
    };

    const navigate = (overrides: Partial<{ payment_method: string; date_from: string; date_to: string; page: number }> = {}) => {
        router.get('/due-collections', {
            payment_method: paymentMethodFilter,
            date_from: dateFrom,
            date_to: dateTo,
            page: 1,
            ...overrides,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethodFilter(value);
        navigate({ payment_method: value, page: 1 });
    };

    const handleDateFilter = () => {
        navigate({ page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const getPaymentMethodBadgeColor = (method: string) => {
        switch (method) {
            case 'cash': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'card': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'bkash': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
            case 'nagad': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <>
            <Head title="Due Collections" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Due Collections</h1>
                    <button
                        onClick={() => router.get('/due-collections/create')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <FaPlus />
                        New Collection
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={paymentMethodFilter}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                        >
                            {paymentMethodOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <FaCalendar className="text-gray-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />
                            <span className="text-gray-500 dark:text-gray-400">to</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />
                            <button
                                onClick={handleDateFilter}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collections Table */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collected By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {collections.data && collections.data.length > 0 ? (
                                    collections.data.map((collection) => (
                                        <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{collection.user.name}</div>
                                                {collection.user.phone && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{collection.user.phone}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                                                ${Number(collection.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPaymentMethodBadgeColor(collection.payment_method)}`}>
                                                    {collection.payment_method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {collection.collector.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(collection.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(collection.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No collections found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {collections.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {collections.from} to {collections.to} of {collections.total} collections
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(collections.current_page - 1)}
                                    disabled={collections.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {collections.current_page} of {collections.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(collections.current_page + 1)}
                                    disabled={collections.current_page === collections.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
