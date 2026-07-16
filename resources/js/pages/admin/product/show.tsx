import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaStar } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
    id: number;
    category_id: number | null;
    brand_id: number | null;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    thumbnail: string | null;
    status: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
    attribute_values?: Array<{
        id: number;
        value: string;
        attribute: {
            id: number;
            name: string;
        };
    }>;
    images?: Array<{
        id: number;
        image: string;
        sort: number;
    }>;
    variants?: Array<{
        id: number;
        sku: string;
        barcode: string | null;
        price: number;
        compare_price: number | null;
        current_stock: number;
        status: string;
    }>;
}

interface ShowProductProps {
    product: Product;
}

export default function ShowProduct({ product }: ShowProductProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/products/${product.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/products/${product.id}`, {
            onSuccess: () => {
                toast.success('Product deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete product');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/products/${product.id}/toggle-status`);
    };

    const handleToggleFeatured = () => {
        router.patch(`/products/${product.id}/toggle-featured`);
    };

    return (
        <>
            <Head title={`Product: ${product.name}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/products')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{product.name}</h1>
                            <button
                                onClick={handleToggleFeatured}
                                className={`text-lg ${product.is_featured ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                title={product.is_featured ? 'Featured' : 'Not Featured'}
                            >
                                <FaStar />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Images */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Product Images</h2>
                                {product.thumbnail && (
                                    <div className="mb-4">
                                        <img
                                            src={product.thumbnail.startsWith('http') ? product.thumbnail : `/storage/${product.thumbnail}`}
                                            alt={product.name}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Thumbnail</p>
                                    </div>
                                )}
                                {product.images && product.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.images.map((image) => (
                                            <img
                                                key={image.id}
                                                src={image.image.startsWith('http') ? image.image : `/storage/${image.image}`}
                                                alt={`Image ${image.sort}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}
                                {!product.thumbnail && (!product.images || product.images.length === 0) && (
                                    <div className="h-64 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500 dark:text-gray-400">No images</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</label>
                                        <p className="text-gray-900 dark:text-gray-100">{product.slug}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                                        <p className="text-gray-900 dark:text-gray-100">{product.category?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Brand</label>
                                        <p className="text-gray-900 dark:text-gray-100">{product.brand?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                        <button
                                            onClick={handleToggleStatus}
                                            className={`px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                        >
                                            {product.status === 'active' ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>
                                {product.short_description && (
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Short Description</label>
                                        <p className="text-gray-900 dark:text-gray-100">{product.short_description}</p>
                                    </div>
                                )}
                                {product.description && (
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Description</label>
                                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{product.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Attributes */}
                            {product.attribute_values && product.attribute_values.length > 0 && (
                                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Product Attributes</h2>
                                    <div className="space-y-3">
                                        {product.attribute_values.map((av) => (
                                            <div key={av.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{av.attribute.name}</span>
                                                <span className="text-sm text-gray-900 dark:text-gray-100">{av.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Product Variants</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                    <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                                                    <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Barcode</th>
                                                    <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                                    <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Stock</th>
                                                    <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.variants.map((variant) => (
                                                    <tr key={variant.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                        <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{variant.sku}</td>
                                                        <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{variant.barcode || '-'}</td>
                                                        <td className="py-2 text-sm text-gray-900 dark:text-gray-100">${Number(variant.price).toFixed(2)}</td>
                                                        <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{variant.current_stock}</td>
                                                        <td className="py-2">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${variant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                                {variant.status === 'active' ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Timestamps</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(product.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(product.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Product"
                        message="Are you sure you want to delete this product? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
