import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import React from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    variants?: ProductVariant[];
}

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    current_stock: number;
    attributes?: any;
}

interface CreateOrderProps {
    products: Product[];
}

export default function CreateOrder({ products }: CreateOrderProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '' as string | number,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        billing_address: '',
        payment_method: 'cash',
        payment_status: 'pending',
        notes: '',
        items: [] as Array<{
            product_id: string | number;
            product_variant_id: string | number | null;
            quantity: number;
            unit_price: number;
        }>,
    });

    const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: ProductVariant[] }>({});

    useEffect(() => {
        const productMap: { [key: number]: ProductVariant[] } = {};
        products.forEach(product => {
            if (product.variants) {
                productMap[product.id] = product.variants;
            }
        });
        setSelectedProducts(productMap);
    }, [products]);

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', product_variant_id: null, quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-fill unit price when product is selected
        if (field === 'product_id' && value) {
            const product = products.find(p => p.id === value);
            if (product && product.variants && product.variants.length > 0) {
                newItems[index].product_variant_id = product.variants[0].id;
                newItems[index].unit_price = product.variants[0].price;
            } else if (product) {
                newItems[index].unit_price = 0; // Will need manual entry if no variants
            }
        }

        // Update unit price when variant changes
        if (field === 'product_variant_id' && value && newItems[index].product_id) {
            const variants = selectedProducts[newItems[index].product_id as number];
            if (variants) {
                const variant = variants.find(v => v.id === value);
                if (variant) {
                    newItems[index].unit_price = variant.price;
                }
            }
        }

        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/orders', {
            onSuccess: () => {
                toast.success('Order created successfully');
            },
            onError: () => {
                toast.error('Failed to create order');
            },
        });
    };

    const calculateTotal = () => {
        return data.items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
    };

    return (
        <>
            <Head title="Create Order" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Order</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Customer Information */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Customer Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Customer Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_name"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="Full name"
                                        />
                                        {errors.customer_name && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="customer_email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="email@example.com"
                                        />
                                        {errors.customer_email && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_phone"
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="+880 1XXX-XXXXXX"
                                        />
                                        {errors.customer_phone && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Payment Method *
                                        </label>
                                        <select
                                            id="payment_method"
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="card">Card</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="online">Online Payment</option>
                                        </select>
                                        {errors.payment_method && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_method}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping & Billing */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Shipping & Billing</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Shipping Address *
                                        </label>
                                        <textarea
                                            id="shipping_address"
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="Full shipping address"
                                        />
                                        {errors.shipping_address && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shipping_address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Billing Address
                                        </label>
                                        <textarea
                                            id="billing_address"
                                            value={data.billing_address}
                                            onChange={(e) => setData('billing_address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="Leave empty if same as shipping address"
                                        />
                                        {errors.billing_address && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.billing_address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">Payment Status</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Payment Status *
                                        </label>
                                        <select
                                            id="payment_status"
                                            value={data.payment_status}
                                            onChange={(e) => setData('payment_status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                        {errors.payment_status && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={1}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            placeholder="Order notes..."
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold dark:text-white">Order Items</h2>
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
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Product *
                                                    </label>
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    >
                                                        <option value="">Select Product</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>{product.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Variant
                                                    </label>
                                                    <select
                                                        value={item.product_variant_id || ''}
                                                        onChange={(e) => updateItem(index, 'product_variant_id', e.target.value || null)}
                                                        disabled={!item.product_id}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                                    >
                                                        <option value="">No Variant</option>
                                                        {item.product_id && selectedProducts[item.product_id as number]?.map((variant) => (
                                                            <option key={variant.id} value={variant.id}>
                                                                {variant.sku} - ${variant.price}
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
                                                        Unit Price *
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                            step="0.01"
                                                            min="0"
                                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
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

                            {/* Order Total */}
                            {data.items.length > 0 && (
                                <div className="mb-8 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium dark:text-white">Order Total:</span>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing || data.items.length === 0}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Order'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get('/orders')}
                                    className="px-6 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
