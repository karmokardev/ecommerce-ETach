import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaTicketAlt, FaCalendar, FaPercent, FaDollarSign } from "react-icons/fa";
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

interface CouponShowProps {
    coupon: Coupon;
}

export default function CouponShow({ coupon }: CouponShowProps) {
    const handleEdit = () => {
        router.get(`/coupons/${coupon.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/coupons/${coupon.id}`, {
                onSuccess: () => {
                    toast.success('Coupon deleted successfully');
                    router.get('/coupons');
                },
            });
        }
    };

    const handleToggleStatus = () => {
        router.patch(`/coupons/${coupon.id}/toggle-status`, {}, {
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
        return new Date(date).toLocaleString();
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    const isUpcoming = (startsAt: string | null) => {
        if (!startsAt) return false;
        return new Date(startsAt) > new Date();
    };

    const getStatus = () => {
        if (isExpired(coupon.expires_at)) return 'Expired';
        if (isUpcoming(coupon.starts_at)) return 'Upcoming';
        return coupon.is_active ? 'Active' : 'Inactive';
    };

    return (
        <>
            <Head title={`Coupon: ${coupon.code}`} />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/coupons')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Coupons
                    </button>
                    <h1 className="text-2xl font-bold dark:text-white">Coupon Details</h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <FaTicketAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{coupon.code}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        getStatus() === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        getStatus() === 'Expired' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                        getStatus() === 'Upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                        {getStatus()}
                                    </span>
                                </div>
                            </div>
                            {coupon.description && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2">{coupon.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                {coupon.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Coupon Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                {coupon.type === 'percentage' ? (
                                    <FaPercent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <FaDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Discount Value</h3>
                                <p className="text-gray-900 dark:text-white font-medium text-lg">
                                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaTicketAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Usage</h3>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {coupon.usage_limit ? `${coupon.used_count}/${coupon.usage_limit}` : `${coupon.used_count}/∞`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(coupon.starts_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expiration Date</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(coupon.expires_at)}</p>
                            </div>
                        </div>

                        {coupon.minimum_order_amount && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                                    <FaDollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Minimum Order</h3>
                                    <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(coupon.minimum_order_amount)}</p>
                                </div>
                            </div>
                        )}

                        {coupon.maximum_discount_amount && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                                    <FaDollarSign className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Max Discount</h3>
                                    <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(coupon.maximum_discount_amount)}</p>
                                </div>
                            </div>
                        )}

                        {coupon.per_user_limit && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                    <FaTicketAlt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Per User Limit</h3>
                                    <p className="text-gray-900 dark:text-white font-medium">{coupon.per_user_limit} uses</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created: {formatDate(coupon.created_at)} • Last updated: {formatDate(coupon.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
