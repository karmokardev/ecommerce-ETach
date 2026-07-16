import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';
import React from 'react';

interface Supplier {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
}

interface ProductVariant {
    id: number;
    sku: string;
    product?: {
        name: string;
    };
}

interface CreatePurchaseProps {
    suppliers: Supplier[];
    warehouses: Warehouse[];
    productVariants: ProductVariant[];
}

export default function CreatePurchase({ suppliers, warehouses, productVariants }: CreatePurchaseProps) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_no: '',
        supplier_id: '' as string | number,
        warehouse_id: '' as string | number,
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        notes: '',
        items: [] as Array<{
            product_variant_id: string | number;
            quantity: number;
            unit_cost: number;
        }>,
    });

    const addItem = () => {
        setData('items', [...data.items, { product_variant_id: '', quantity: 1, unit_cost: 0 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/purchases', {
            onSuccess: () => {
                toast.success('Purchase created successfully');
            },
            onError: () => {
                toast.error('Failed to create purchase');
            },
        });
    };

    return (
        <>
            <Head title="Create Purchase" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Purchase</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Invoice No */}
                                <div>
                                    <label htmlFor="invoice_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Invoice Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="invoice_no"
                                        value={data.invoice_no}
                                        onChange={(e) => setData('invoice_no', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., PO-2024-001"
                                    />
                                    {errors.invoice_no && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoice_no}</p>
                                    )}
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Supplier *
                                    </label>
                                    <select
                                        id="supplier_id"
                                        value={data.supplier_id}
                                        onChange={(e) => setData('supplier_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.supplier_id}</p>
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

                                {/* Purchase Date */}
                                <div>
                                    <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Purchase Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="purchase_date"
                                        value={data.purchase_date}
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    {errors.purchase_date && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purchase_date}</p>
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
                                        <option value="draft">Draft</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
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

                            {/* Purchase Items */}
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold dark:text-white">Purchase Items</h2>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        Add Item
                                    </button>
                                </div>

                                {data.items.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Product Variant *
                                                    </label>
                                                    <select
                                                        value={item.product_variant_id}
                                                        onChange={(e) => updateItem(index, 'product_variant_id', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    >
                                                        <option value="">Select Variant</option>
                                                        {productVariants.map((variant) => (
                                                            <option key={variant.id} value={variant.id}>
                                                                {variant.sku} - {variant.product?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Quantity *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                        min="1"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Unit Cost *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.unit_cost}
                                                        onChange={(e) => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No items added. Click "Add Item" to start.
                                    </div>
                                )}
                                {errors.items && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.items}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Purchase'}
                                </button>
                                <a
                                    href="/purchases"
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
