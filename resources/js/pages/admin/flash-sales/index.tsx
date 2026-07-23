import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaClock } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface FlashSale {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    discount_type: string;
    discount_value: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    priority: number;
    products_count: number;
    created_at: string;
    updated_at: string;
}

interface FlashSalesProps {
    flashSales: {
        data: FlashSale[];
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

export default function FlashSales({ flashSales, filters }: FlashSalesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [flashSaleToDelete, setFlashSaleToDelete] = useState<number | null>(null);

    const handleEdit = (flashSaleId: number) => {
        router.get(`/flash-sales/${flashSaleId}/edit`);
    };

    const handleView = (flashSaleId: number) => {
        router.get(`/flash-sales/${flashSaleId}`);
    };

    const handleDeleteClick = (flashSaleId: number) => {
        setFlashSaleToDelete(flashSaleId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (flashSaleToDelete) {
            router.delete(`/flash-sales/${flashSaleToDelete}`, {
                onSuccess: () => {
                    toast.success('Flash sale deleted successfully');
                    setDeleteModalOpen(false);
                    setFlashSaleToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete flash sale');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number }> = {}) => {
        router.get('/flash-sales', {
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

    const handleToggleStatus = (flashSaleId: number) => {
        router.patch(`/flash-sales/${flashSaleId}/toggle-status`, {}, {
            onSuccess: () => {
                toast.success('Flash sale status updated successfully');
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const getRemainingTime = (endsAt: string) => {
        const end = new Date(endsAt);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const isActive = (startsAt: string, endsAt: string, isActive: boolean) => {
        const now = new Date();
        const start = new Date(startsAt);
        const end = new Date(endsAt);
        return isActive && now >= start && now < end;
    };

    const isUpcoming = (startsAt: string) => {
        const now = new Date();
        const start = new Date(startsAt);
        return now < start;
    };

    return (
        <>
            <Head title="Flash Sales Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Flash Sales Management</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search flash sales..."
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
                                { value: 'upcoming', label: 'Upcoming' },
                                { value: 'expired', label: 'Expired' },
                            ]}
                        />
                        <button
                            onClick={() => router.get('/flash-sales/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Flash Sale
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Left</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {flashSales.data && flashSales.data.length > 0 ? (
                                    flashSales.data.map((flashSale) => (
                                        <tr key={flashSale.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{flashSale.name}</div>
                                                {flashSale.description && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{flashSale.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${flashSale.discount_type === 'percentage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                                                    {flashSale.discount_type === 'percentage' ? `${flashSale.discount_value}%` : formatCurrency(flashSale.discount_value)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <div>{formatDate(flashSale.starts_at)}</div>
                                                <div className="text-xs">to {formatDate(flashSale.ends_at)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {flashSale.products_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <FaClock className="w-4 h-4" />
                                                    {getRemainingTime(flashSale.ends_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(flashSale.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${isActive(flashSale.starts_at, flashSale.ends_at, flashSale.is_active) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : isUpcoming(flashSale.starts_at) ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {isActive(flashSale.starts_at, flashSale.ends_at, flashSale.is_active) ? 'Active' : isUpcoming(flashSale.starts_at) ? 'Upcoming' : (flashSale.is_active ? 'Scheduled' : 'Inactive')}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(flashSale.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(flashSale.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(flashSale.id)}
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
                                            No flash sales found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {flashSales.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {flashSales.from} to {flashSales.to} of {flashSales.total} flash sales
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(flashSales.current_page - 1)}
                                    disabled={flashSales.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {flashSales.current_page} of {flashSales.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(flashSales.current_page + 1)}
                                    disabled={flashSales.current_page === flashSales.last_page}
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
                        setFlashSaleToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Flash Sale"
                    message="Are you sure you want to delete this flash sale? This action cannot be undone."
                />
            </div>
        </>
    );
}
