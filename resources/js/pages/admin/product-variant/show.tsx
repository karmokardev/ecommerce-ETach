import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    barcode: string | null;
    price: number;
    compare_price: number | null;
    cost_price: number | null;
    weight: number | null;
    dimensions: string | null;
    current_stock: number;
    low_stock_alert: number;
    status: string;
    created_at: string;
    updated_at: string;
    product?: {
        id: number;
        name: string;
    };
    stock_movements?: Array<{
        id: number;
        type: string;
        quantity: number;
        before_stock: number;
        after_stock: number;
        remarks: string | null;
        created_at: string;
    }>;
}

interface ShowProductVariantProps {
    variant: ProductVariant;
}

export default function ShowProductVariant({ variant }: ShowProductVariantProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        router.get(`/product-variants/${variant.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/product-variants/${variant.id}`, {
            onSuccess: () => {
                toast.success('Variant deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete variant');
            },
        });
    };

    const handleToggleStatus = () => {
        router.patch(`/product-variants/${variant.id}/toggle-status`);
    };

    const getStockStatus = (): string => {
        if (variant.current_stock === 0) return 'out_of_stock';
        if (variant.current_stock <= variant.low_stock_alert) return 'low_stock';
        return 'in_stock';
    };

    const getStockStatusBadge = () => {
        const status = getStockStatus();
        switch (status) {
            case 'out_of_stock':
                return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Out of Stock</span>;
            case 'low_stock':
                return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Low Stock</span>;
            default:
                return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Stock</span>;
        }
    };

    return (
        <>
            <Head title={`Variant: ${variant.sku}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/product-variants')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">{variant.sku}</h1>
                            {getStockStatusBadge()}
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

                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.product?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Barcode</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.barcode || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
                                    <p className="text-gray-900 dark:text-gray-100">${Number(variant.price).toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Compare Price</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.compare_price ? `$${Number(variant.compare_price).toFixed(2)}` : '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost Price</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.cost_price ? `$${Number(variant.cost_price).toFixed(2)}` : '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`px-2 py-1 text-xs rounded-full ${variant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                    >
                                        {variant.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Stock Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</label>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{variant.current_stock}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Alert Threshold</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.low_stock_alert}</p>
                                </div>
                            </div>
                        </div>

                        {/* Physical Attributes */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Physical Attributes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.weight ? `${variant.weight} kg` : '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Dimensions</label>
                                    <p className="text-gray-900 dark:text-gray-100">{variant.dimensions || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stock Movements */}
                        {variant.stock_movements && variant.stock_movements.length > 0 && (
                            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Stock Movements</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-neutral-800">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Before</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">After</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variant.stock_movements.map((movement) => (
                                                <tr key={movement.id} className="border-b border-gray-100 dark:border-neutral-800 last:border-0">
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.type}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.quantity}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.before_stock}</td>
                                                    <td className="py-2 text-sm text-gray-900 dark:text-gray-100">{movement.after_stock}</td>
                                                    <td className="py-2 text-sm text-gray-500 dark:text-gray-400">{new Date(movement.created_at).toLocaleString()}</td>
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
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(variant.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(variant.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Product Variant"
                        message="Are you sure you want to delete this variant? This action cannot be undone."
                    />
                </div>
            </div>
        </>
    );
}
