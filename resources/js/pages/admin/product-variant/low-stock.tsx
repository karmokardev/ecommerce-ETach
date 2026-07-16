import { Head, router } from '@inertiajs/react';
import { FaEye, FaArrowLeft } from "react-icons/fa";

interface ProductVariant {
    id: number;
    sku: string;
    barcode: string | null;
    price: number;
    current_stock: number;
    low_stock_alert: number;
    status: string;
    product?: {
        id: number;
        name: string;
    };
}

interface LowStockProps {
    variants: {
        data: ProductVariant[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        per_page: number;
        page: number;
    };
}

export default function LowStockReport({ variants, filters }: LowStockProps) {
    const handleView = (variantId: number) => {
        router.get(`/product-variants/${variantId}`);
    };

    const handlePageChange = (page: number) => {
        router.get('/product-variants/low-stock', {
            per_page: filters.per_page,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStockStatus = (variant: ProductVariant): string => {
        if (variant.current_stock === 0) return 'out_of_stock';
        if (variant.current_stock <= variant.low_stock_alert) return 'low_stock';
        return 'in_stock';
    };

    const getStockStatusBadge = (variant: ProductVariant) => {
        const status = getStockStatus(variant);
        switch (status) {
            case 'out_of_stock':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Out of Stock</span>;
            case 'low_stock':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Low Stock</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Stock</span>;
        }
    };

    return (
        <>
            <Head title="Low Stock Report" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/product-variants')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">Low Stock Report</h1>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Low Stock Items</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{variants.total}</div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm border dark:border-red-800 p-4">
                            <div className="text-sm text-red-600 dark:text-red-400">Out of Stock</div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {variants.data.filter(v => v.current_stock === 0).length}
                            </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border dark:border-yellow-800 p-4">
                            <div className="text-sm text-yellow-600 dark:text-yellow-400">Low Stock</div>
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {variants.data.filter(v => v.current_stock > 0 && v.current_stock <= v.low_stock_alert).length}
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alert Threshold</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                    {variants.data && variants.data.length > 0 ? (
                                        variants.data.map((variant) => (
                                            <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {variant.sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {variant.product ? variant.product.name : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    ${Number(variant.price).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    <span className={variant.current_stock === 0 ? 'text-red-600 font-bold' : 'text-yellow-600 font-bold'}>
                                                        {variant.current_stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {variant.low_stock_alert}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStockStatusBadge(variant)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <button
                                                        onClick={() => handleView(variant.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No low stock items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {variants.last_page > 1 && (
                            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing {variants.from} to {variants.to} of {variants.total} items
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(variants.current_page - 1)}
                                        disabled={variants.current_page === 1}
                                        className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                        Page {variants.current_page} of {variants.last_page}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(variants.current_page + 1)}
                                        disabled={variants.current_page === variants.last_page}
                                        className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
