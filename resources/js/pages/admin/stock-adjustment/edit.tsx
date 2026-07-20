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

interface StockAdjustment {
    id: number;
    product_variant_id: number;
    warehouse_id: number;
    adjustment_type: string;
    quantity: number;
    reason: string | null;
    notes: string | null;
    product_variant?: ProductVariant;
    warehouse?: Warehouse;
}

interface EditStockAdjustmentProps {
    adjustment: StockAdjustment;
    warehouses: Warehouse[];
}

export default function EditStockAdjustment({ adjustment, warehouses }: EditStockAdjustmentProps) {
    const { data, setData, put, processing, errors } = useForm({
        product_variant_id: adjustment.product_variant_id,
        warehouse_id: adjustment.warehouse_id,
        adjustment_type: adjustment.adjustment_type,
        quantity: adjustment.quantity,
        reason: adjustment.reason || '',
        notes: adjustment.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/stock-adjustments/${adjustment.id}`, {
            onSuccess: () => {
                toast.success('Stock adjustment updated successfully');
            },
            onError: () => {
                toast.error('Failed to update stock adjustment');
            },
        });
    };

    const selectedVariant = adjustment.product_variant;

    return (
        <>
            <Head title="Edit Stock Adjustment" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Edit Stock Adjustment</h1>
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
                                        onChange={(e) => setData('product_variant_id', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Variant</option>
                                        {selectedVariant && (
                                            <option key={selectedVariant.id} value={selectedVariant.id}>
                                                {selectedVariant.sku} - {selectedVariant.product?.name} (Current Stock: {selectedVariant.current_stock})
                                            </option>
                                        )}
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
                                        onChange={(e) => setData('warehouse_id', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses?.map((warehouse) => (
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

                                {/* Notes */}
                                <div className="md:col-span-2">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="Additional notes..."
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                    )}
                                </div>
                            </div>

                            {/* Warning Notice */}
                            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Note:</strong> Editing this adjustment will only update the record. Stock will not be re-processed. 
                                    To correct stock, delete this adjustment and create a new one.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Adjustment'}
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
