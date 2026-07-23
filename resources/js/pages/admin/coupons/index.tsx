import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface Coupon {
    id: number;
    code: string;
    type: string;
    value: number;
    minimum_order_amount: number | null;
    maximum_discount_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    per_user_limit: number | null;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface CouponsProps {
    coupons: {
        data: Coupon[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
    };
}

export default function Coupons({ coupons, filters }: CouponsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

    const handleEdit = (couponId: number) => {
        router.get(`/coupons/${couponId}/edit`);
    };

    const handleView = (couponId: number) => {
        router.get(`/coupons/${couponId}`);
    };

    const handleDeleteClick = (couponId: number) => {
        setCouponToDelete(couponId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (couponToDelete) {
            router.delete(`/coupons/${couponToDelete}`, {
                onSuccess: () => {
                    toast.success('Coupon deleted successfully');
                    setDeleteModalOpen(false);
                    setCouponToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete coupon');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number }> = {}) => {
        router.get('/coupons', {
            search: searchTerm,
            status: statusFilter,
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

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleToggleStatus = (couponId: number) => {
        router.patch(`/coupons/${couponId}/toggle-status`, {}, {
            onSuccess: () => {
                toast.success('Coupon status updated successfully');
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    const isUpcoming = (startsAt: string | null) => {
        if (!startsAt) return false;
        return new Date(startsAt) > new Date();
    };

    return (
        <>
            <Head title="Coupons Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Coupons Management</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search coupons..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <StatusFilter
                            value={statusFilter}
                            onChange={handleStatusChange}
                            options={[
                                { value: '', label: 'All Status' },
                                { value: 'active', label: 'Active' },
                                { value: 'expired', label: 'Expired' },
                                { value: 'upcoming', label: 'Upcoming' },
                            ]}
                        />
                        <button
                            onClick={() => router.get('/coupons/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Coupon
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valid Period</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {coupons.data && coupons.data.length > 0 ? (
                                    coupons.data.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">{coupon.code}</div>
                                                {coupon.description && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{coupon.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${coupon.type === 'percentage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                                                    {coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {coupon.usage_limit ? `${coupon.used_count}/${coupon.usage_limit}` : `${coupon.used_count}/∞`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <div>{formatDate(coupon.starts_at)}</div>
                                                <div className="text-xs">to {formatDate(coupon.expires_at)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(coupon.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${coupon.is_active && !isExpired(coupon.expires_at) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {isExpired(coupon.expires_at) ? 'Expired' : isUpcoming(coupon.starts_at) ? 'Upcoming' : (coupon.is_active ? 'Active' : 'Inactive')}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(coupon.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(coupon.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(coupon.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No coupons found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {coupons.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {coupons.from} to {coupons.to} of {coupons.total} coupons
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(coupons.current_page - 1)}
                                    disabled={coupons.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {coupons.current_page} of {coupons.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(coupons.current_page + 1)}
                                    disabled={coupons.current_page === coupons.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setCouponToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Coupon"
                    message="Are you sure you want to delete this coupon? This action cannot be undone."
                />
            </div>
        </>
    );
}
