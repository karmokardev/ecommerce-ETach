import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sort: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ShowBrandProps {
    brand: Brand;
}

export default function ShowBrand({ brand }: ShowBrandProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/brands/${brand.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/brands/${brand.id}`, {
            onSuccess: () => {
                toast.success('Brand deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete brand');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/brands/${brand.id}/toggle-status`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title={`Brand: ${brand.name}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => router.get('/brands')}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                            <FaArrowLeft />
                            Back to Brands
                        </button>
                        <h1 className="text-2xl font-bold dark:text-white">Brand Details</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 overflow-hidden">
                        {/* Brand Image */}
                        {brand.image && (
                            <div className="h-64 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                <img
                                    src={brand.image.startsWith('http') ? brand.image : `/storage/${brand.image}`}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{brand.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Slug: {brand.slug}</p>
                                </div>
                                <button
                                    onClick={handleToggleStatus}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        brand.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}
                                >
                                    {brand.status === 'active' ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            {brand.description && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{brand.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sort Order</h3>
                                    <p className="text-gray-900 dark:text-gray-100">{brand.sort}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                                    <p className="text-gray-900 dark:text-gray-100 capitalize">{brand.status}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</h3>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(brand.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Updated At</h3>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(brand.updated_at)}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit />
                                    Edit Brand
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaTrash />
                                    Delete Brand
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Brand"
                    message="Are you sure you want to delete this brand? This action cannot be undone."
                />
            </div>
        </>
    );
}
