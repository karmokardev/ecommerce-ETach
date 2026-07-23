import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
}

interface Review {
    id: number;
    user: User;
    product: Product;
    rating: number;
    title: string | null;
    review: string;
    is_approved: boolean;
    is_verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

interface ReviewsProps {
    reviews: {
        data: Review[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        rating: string;
    };
}

export default function Reviews({ reviews, filters }: ReviewsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

    const handleView = (reviewId: number) => {
        router.get(`/reviews/${reviewId}`);
    };

    const handleDeleteClick = (reviewId: number) => {
        setReviewToDelete(reviewId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (reviewToDelete) {
            router.delete(`/reviews/${reviewToDelete}`, {
                onSuccess: () => {
                    toast.success('Review deleted successfully');
                    setDeleteModalOpen(false);
                    setReviewToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete review');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; rating: string; page: number }> = {}) => {
        router.get('/reviews', {
            search: searchTerm,
            status: statusFilter,
            rating: ratingFilter,
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

    const handleRatingChange = (value: string) => {
        setRatingFilter(value);
        navigate({ rating: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleApprove = (reviewId: number) => {
        router.post(`/reviews/${reviewId}/approve`, {}, {
            onSuccess: () => {
                toast.success('Review approved successfully');
            },
        });
    };

    const handleReject = (reviewId: number) => {
        router.post(`/reviews/${reviewId}/reject`, {}, {
            onSuccess: () => {
                toast.success('Review rejected successfully');
            },
        });
    };

    const handleMarkHelpful = (reviewId: number) => {
        router.post(`/reviews/${reviewId}/mark-helpful`, {}, {
            onSuccess: () => {
                toast.success('Review marked as helpful');
            },
        });
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="text-yellow-400">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">☆</span>);
            }
        }
        return stars;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <>
            <Head title="Product Reviews Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Product Reviews Management</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search reviews..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <StatusFilter
                            value={statusFilter}
                            onChange={handleStatusChange}
                            options={[
                                { value: '', label: 'All Status' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'pending', label: 'Pending' },
                            ]}
                        />
                        <select
                            value={ratingFilter}
                            onChange={(e) => handleRatingChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {reviews.data && reviews.data.length > 0 ? (
                                    reviews.data.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.product.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">{review.user.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{review.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(review.rating)}
                                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({review.rating})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {review.title && (
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{review.title}</div>
                                                )}
                                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{review.review}</div>
                                                {review.is_verified_purchase && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
                                                        ✓ Verified Purchase
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${review.is_approved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                    {review.is_approved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(review.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(review.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {!review.is_approved && (
                                                    <button
                                                        onClick={() => handleApprove(review.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mr-2 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <FaCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {review.is_approved && (
                                                    <button
                                                        onClick={() => handleReject(review.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mr-2 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleMarkHelpful(review.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2 transition-colors"
                                                    title="Mark Helpful"
                                                >
                                                    👍 {review.helpful_count}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(review.id)}
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
                                            No reviews found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reviews.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {reviews.from} to {reviews.to} of {reviews.total} reviews
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(reviews.current_page - 1)}
                                    disabled={reviews.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {reviews.current_page} of {reviews.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(reviews.current_page + 1)}
                                    disabled={reviews.current_page === reviews.last_page}
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
                        setReviewToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Review"
                    message="Are you sure you want to delete this review? This action cannot be undone."
                />
            </div>
        </>
    );
}
