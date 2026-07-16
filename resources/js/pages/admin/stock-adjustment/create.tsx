import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import React from 'react';

interface ProductVariant {
    id: number;
    sku: string;
    product?: {
        name: string;
    };
    current_stock: number;
}

interface Warehouse {
    id: number;
    name: string;
}

interface CreateStockAdjustmentProps {
    productVariants: ProductVariant[];
    warehouses: Warehouse[];
}

export default function CreateStockAdjustment({ productVariants, warehouses }: CreateStockAdjustmentProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_variant_id: '' as string | number,
        warehouse_id: '' as string | number,
        adjustment_type: 'increase',
        quantity: 0,
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/stock-adjustments', {
            onSuccess: () => {
                toast.success('Stock adjustment created successfully');
            },
            onError: () => {
                toast.error('Failed to create stock adjustment');
            },
        });
    };

    const selectedVariant = productVariants.find(v => v.id === parseInt(data.product_variant_id.toString()));

    return (
        <>
            <Head title="Create Stock Adjustment" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Stock Adjustment</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Variant */}
                                <div className="md:col-span-2">
                                    <label htmlFor="product_variant_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Product Variant *
                                    </label>
                                    <select
                                        id="product_variant_id"
                                        value={data.product_variant_id}
                                        onChange={(e) => setData('product_variant_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Variant</option>
                                        {productVariants.map((variant) => (
                                            <option key={variant.id} value={variant.id}>
                                                {variant.sku} - {variant.product?.name} (Current Stock: {variant.current_stock})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_variant_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product_variant_id}</p>
                                    )}
                                </div>

                                {/* Warehouse */}
                                <div>
                                    <label htmlFor="warehouse_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Warehouse *
                                    </label>
                                    <select
                                        id="warehouse_id"
                                        value={data.warehouse_id}
                                        onChange={(e) => setData('warehouse_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                        ))}
                                    </select>
                                    {errors.warehouse_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.warehouse_id}</p>
                                    )}
                                </div>

                                {/* Adjustment Type */}
                                <div>
                                    <label htmlFor="adjustment_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Adjustment Type *
                                    </label>
                                    <select
                                        id="adjustment_type"
                                        value={data.adjustment_type}
                                        onChange={(e) => setData('adjustment_type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="increase">Increase Stock</option>
                                        <option value="decrease">Decrease Stock</option>
                                    </select>
                                    {errors.adjustment_type && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adjustment_type}</p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0"
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                                    )}
                                </div>

                                {/* Reason */}
                                <div className="md:col-span-2">
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Reason *
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="Reason for adjustment..."
                                    />
                                    {errors.reason && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
                                    )}
                                </div>
                            </div>

                            {/* Stock Preview */}
                            {selectedVariant && (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock Preview</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Current Stock:</span>
                                            <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedVariant.current_stock}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Adjustment:</span>
                                            <span className={`ml-2 ${data.adjustment_type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                                {data.adjustment_type === 'increase' ? '+' : '-'}{data.quantity}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 dark:text-gray-400">New Stock:</span>
                                            <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">
                                                {data.adjustment_type === 'increase' 
                                                    ? selectedVariant.current_stock + data.quantity 
                                                    : Math.max(0, selectedVariant.current_stock - data.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Adjustment'}
                                </button>
                                <a
                                    href="/stock-adjustments"
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
