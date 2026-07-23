import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaCheck, FaTimes, FaUser, FaBox, FaCalendar, FaThumbsUp } from "react-icons/fa";
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

interface Order {
    id: number;
    order_number: string;
}

interface Review {
    id: number;
    user: User;
    product: Product;
    order: Order | null;
    rating: number;
    title: string | null;
    review: string;
    is_approved: boolean;
    is_verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

interface ReviewShowProps {
    review: Review;
}

export default function ReviewShow({ review }: ReviewShowProps) {
    const handleApprove = () => {
        router.post(`/reviews/${review.id}/approve`, {}, {
            onSuccess: () => {
                toast.success('Review approved successfully');
            },
        });
    };

    const handleReject = () => {
        router.post(`/reviews/${review.id}/reject`, {}, {
            onSuccess: () => {
                toast.success('Review rejected successfully');
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/reviews/${review.id}`, {
                onSuccess: () => {
                    toast.success('Review deleted successfully');
                    router.get('/reviews');
                },
            });
        }
    };

    const handleMarkHelpful = () => {
        router.post(`/reviews/${review.id}/mark-helpful`, {}, {
            onSuccess: () => {
                toast.success('Review marked as helpful');
            },
        });
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="text-yellow-400 text-2xl">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 dark:text-gray-600 text-2xl">☆</span>);
            }
        }
        return stars;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <>
            <Head title={`Review #${review.id}`} />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/reviews')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Reviews
                    </button>
                    <h1 className="text-2xl font-bold dark:text-white">Review Details</h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {renderStars(review.rating)}
                                <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">{review.rating}/5</span>
                            </div>
                            {review.title && (
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{review.title}</h2>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {review.is_approved ? (
                                <button
                                    onClick={handleReject}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Reject
                                </button>
                            ) : (
                                <button
                                    onClick={handleApprove}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaCheck />
                                    Approve
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Review</h3>
                        <p className="text-gray-900 dark:text-white text-lg leading-relaxed">{review.review}</p>
                    </div>

                    {/* Review Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{review.user.name}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaBox className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Product</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{review.product.name}</p>
                            </div>
                        </div>

                        {review.order && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <FaBox className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order</h3>
                                    <p className="text-gray-900 dark:text-white font-medium">#{review.order.order_number}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(review.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            review.is_approved 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                            {review.is_approved ? '✓ Approved' : '○ Pending'}
                        </span>
                        {review.is_verified_purchase && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                ✓ Verified Purchase
                            </span>
                        )}
                    </div>

                    {/* Helpful Section */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleMarkHelpful}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <FaThumbsUp />
                                Helpful ({review.helpful_count})
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: {formatDate(review.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
