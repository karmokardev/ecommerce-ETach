import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import React from 'react';

interface Product {
    id: number;
    name: string;
}

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
    product?: {
        id: number;
        name: string;
    };
}

interface EditProductVariantProps {
    variant: ProductVariant;
    products: Product[];
}

export default function EditProductVariant({ variant, products }: EditProductVariantProps) {
    const { data, setData, put, processing, errors } = useForm({
        product_id: variant.product_id ? variant.product_id.toString() : '',
        sku: variant.sku,
        barcode: variant.barcode || '',
        price: variant.price.toString(),
        compare_price: variant.compare_price ? variant.compare_price.toString() : '',
        cost_price: variant.cost_price ? variant.cost_price.toString() : '',
        weight: variant.weight ? variant.weight.toString() : '',
        dimensions: variant.dimensions || '',
        current_stock: variant.current_stock,
        low_stock_alert: variant.low_stock_alert,
        status: variant.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/product-variants/${variant.id}`, {
            onSuccess: () => {
                toast.success('Variant updated successfully');
            },
            onError: () => {
                toast.error('Failed to update variant');
            },
        });
    };

    return (
        <>
            <Head title="Edit Product Variant" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Edit Product Variant</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product */}
                                <div className="md:col-span-2">
                                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Product *
                                    </label>
                                    <select
                                        id="product_id"
                                        value={data.product_id}
                                        onChange={(e) => setData('product_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                    {errors.product_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product_id}</p>
                                    )}
                                </div>

                                {/* SKU */}
                                <div>
                                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        SKU *
                                    </label>
                                    <input
                                        type="text"
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., PROD-001-BLK-L"
                                    />
                                    {errors.sku && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku}</p>
                                    )}
                                </div>

                                {/* Barcode */}
                                <div>
                                    <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Barcode
                                    </label>
                                    <input
                                        type="text"
                                        id="barcode"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., 1234567890123"
                                    />
                                    {errors.barcode && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.barcode}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                                    )}
                                </div>

                                {/* Compare Price */}
                                <div>
                                    <label htmlFor="compare_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Compare Price
                                    </label>
                                    <input
                                        type="number"
                                        id="compare_price"
                                        value={data.compare_price}
                                        onChange={(e) => setData('compare_price', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0.00"
                                    />
                                    {errors.compare_price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.compare_price}</p>
                                    )}
                                </div>

                                {/* Cost Price */}
                                <div>
                                    <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Cost Price
                                    </label>
                                    <input
                                        type="number"
                                        id="cost_price"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0.00"
                                    />
                                    {errors.cost_price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cost_price}</p>
                                    )}
                                </div>

                                {/* Weight */}
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        value={data.weight}
                                        onChange={(e) => setData('weight', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0.00"
                                    />
                                    {errors.weight && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.weight}</p>
                                    )}
                                </div>

                                {/* Dimensions */}
                                <div>
                                    <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Dimensions (LxWxH cm)
                                    </label>
                                    <input
                                        type="text"
                                        id="dimensions"
                                        value={data.dimensions}
                                        onChange={(e) => setData('dimensions', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., 10x5x2"
                                    />
                                    {errors.dimensions && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dimensions}</p>
                                    )}
                                </div>

                                {/* Current Stock */}
                                <div>
                                    <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Current Stock
                                    </label>
                                    <input
                                        type="number"
                                        id="current_stock"
                                        value={data.current_stock}
                                        onChange={(e) => setData('current_stock', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0"
                                    />
                                    {errors.current_stock && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.current_stock}</p>
                                    )}
                                </div>

                                {/* Low Stock Alert */}
                                <div>
                                    <label htmlFor="low_stock_alert" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Low Stock Alert Threshold
                                    </label>
                                    <input
                                        type="number"
                                        id="low_stock_alert"
                                        value={data.low_stock_alert}
                                        onChange={(e) => setData('low_stock_alert', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="5"
                                    />
                                    {errors.low_stock_alert && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.low_stock_alert}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Variant'}
                                </button>
                                <a
                                    href="/product-variants"
                                    className="px-6 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                                >
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
