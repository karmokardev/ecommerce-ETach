import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { toast } from 'sonner';

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
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
    approver?: {
        id: number;
        name: string;
    };
    items: Array<{
        id: number;
        product_variant_id: number;
        quantity: number;
        refund_price: number;
        condition: string;
    }>;
}

interface ReturnsProps {
    returns: {
        data: ProductReturn[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        order_type: string;
        per_page: number;
        page: number;
    };
}

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
];

const orderTypeOptions = [
    { value: 'all', label: 'All Order Types' },
    { value: 'pos_order', label: 'POS Order' },
    { value: 'online_order', label: 'Online Order' },
];

export default function ProductReturnsIndex({ returns, filters }: ReturnsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [orderTypeFilter, setOrderTypeFilter] = useState(filters.order_type || 'all');

    const handleView = (returnId: number) => {
        router.get(`/product-returns/${returnId}`);
    };

    const handleApprove = (returnId: number) => {
        if (confirm('Are you sure you want to approve this return?')) {
            router.post(`/product-returns/${returnId}/approve`, {}, {
                onSuccess: () => {
                    toast.success('Return approved successfully');
                },
                onError: () => {
                    toast.error('Failed to approve return');
                },
            });
        }
    };

    const handleReject = (returnId: number) => {
        const reason = prompt('Enter rejection reason (optional):');
        router.post(`/product-returns/${returnId}/reject`, { reason }, {
            onSuccess: () => {
                toast.success('Return rejected successfully');
            },
            onError: () => {
                toast.error('Failed to reject return');
            },
        });
    };

    const handleComplete = (returnId: number) => {
        if (confirm('Are you sure you want to complete this return?')) {
            router.post(`/product-returns/${returnId}/complete`, {}, {
                onSuccess: () => {
                    toast.success('Return completed successfully');
                },
                onError: () => {
                    toast.error('Failed to complete return');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; order_type: string; page: number }> = {}) => {
        router.get('/product-returns', {
            search: searchTerm,
            status: statusFilter,
            order_type: orderTypeFilter,
            page: 1,
            ...overrides,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ page: 1 });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        navigate({ status: value, page: 1 });
    };

    const handleOrderTypeChange = (value: string) => {
        setOrderTypeFilter(value);
        navigate({ order_type: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
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

    return (
        <>
            <Head title="Product Returns" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Product Returns</h1>
                    <button
                        onClick={() => router.get('/product-returns/create')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <FaCheck /> New Return
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Returns</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{returns.total}</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border dark:border-yellow-800 p-4">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                            {returns.data?.filter(r => r.status === 'pending').length || 0}
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border dark:border-blue-800 p-4">
                        <div className="text-sm text-blue-600 dark:text-blue-400">Approved</div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {returns.data?.filter(r => r.status === 'approved').length || 0}
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border dark:border-green-800 p-4">
                        <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {returns.data?.filter(r => r.status === 'completed').length || 0}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search by return number, customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaFilter />
                            </button>
                        </form>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <select
                            value={orderTypeFilter}
                            onChange={(e) => handleOrderTypeChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {orderTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        {(searchTerm || statusFilter !== 'all' || orderTypeFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setOrderTypeFilter('all');
                                    navigate({ search: '', status: 'all', order_type: 'all', page: 1 });
                                }}
                                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Returns Table */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Return No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Refund Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {returns.data && returns.data.length > 0 ? (
                                    returns.data.map((returnItem) => (
                                        <tr key={returnItem.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{returnItem.return_number}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {returnItem.user ? returnItem.user.name : returnItem.customer_name || 'Unknown'}
                                                </div>
                                                {returnItem.customer_phone && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{returnItem.customer_phone}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {returnItem.order_type === 'pos_order' ? 'POS' : 'Online'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                ${Number(returnItem.refund_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(returnItem.status)}`}>
                                                    {returnItem.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(returnItem.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(returnItem.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {returnItem.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(returnItem.id)}
                                                            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mr-3 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(returnItem.id)}
                                                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FaTimes className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {returnItem.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleComplete(returnItem.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                        title="Complete"
                                                    >
                                                        <FaCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No returns found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {returns.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {returns.from} to {returns.to} of {returns.total} returns
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(returns.current_page - 1)}
                                    disabled={returns.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {returns.current_page} of {returns.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(returns.current_page + 1)}
                                    disabled={returns.current_page === returns.last_page}
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
