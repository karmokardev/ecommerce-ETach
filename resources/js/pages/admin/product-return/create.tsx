import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaBox } from 'react-icons/fa';

interface OrderItem {
    id: number;
    product_variant_id: number;
    variant: {
        id: number;
        sku: string;
        price: string;
        product: {
            name: string;
        };
    };
    quantity: number;
    unit_price: string;
}

interface Order {
    id: number;
    order_number: string;
    items: OrderItem[];
    user?: {
        id: number;
        name: string;
        phone: string | null;
    };
}

interface Props {
    order: Order | null;
    order_type: string;
}

const ProductReturnCreate: React.FC<Props> = ({ order, order_type }) => {
    const { props } = usePage();
    const flash = props.flash as any;

    const [returnItems, setReturnItems] = useState<Array<{
        product_variant_id: number;
        quantity: number;
        refund_price: string;
        condition: string;
        notes: string;
    }>>([]);

    const { data, setData, post, processing, errors } = useForm({
        order_type: order_type,
        order_id: order?.id || '',
        user_id: order?.user?.id || '',
        customer_name: order?.user?.name || '',
        customer_phone: order?.user?.phone || '',
        reason: '',
        return_type: 'refund',
        refund_method: 'original',
        notes: '',
        items: returnItems,
    });

    useEffect(() => {
        setData('items', returnItems);
    }, [returnItems]);

    const addItem = (item: OrderItem) => {
        const existingIndex = returnItems.findIndex(
            ri => ri.product_variant_id === item.product_variant_id
        );

        if (existingIndex >= 0) {
            setReturnItems(prev => prev.map((ri, i) => 
                i === existingIndex 
                    ? { ...ri, quantity: Math.min(ri.quantity + 1, item.quantity) }
                    : ri
            ));
        } else {
            setReturnItems(prev => [...prev, {
                product_variant_id: item.product_variant_id,
                quantity: 1,
                refund_price: item.unit_price,
                condition: 'new',
                notes: '',
            }]);
        }
    };

    const removeItem = (index: number) => {
        setReturnItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        setReturnItems(prev => prev.map((ri, i) => 
            i === index ? { ...ri, [field]: value } : ri
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/product-returns');
    };

    const totalRefund = returnItems.reduce((sum, item) => 
        sum + (parseFloat(item.refund_price) * item.quantity), 0
    );

    return (
        <>
            <Head title="Create Return" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/product-returns"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Returns
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Return Request</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {order ? `For Order #${order.order_number}` : 'Select an order to return items'}
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    {order ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Order Items */}
                                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FaBox />
                                        Order Items
                                    </h2>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 border dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer"
                                                onClick={() => addItem(item)}
                                            >
                                                <div className="font-medium text-gray-900 dark:text-white">{item.variant.product.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    SKU: {item.variant.sku} | Price: ${item.variant.price} | Qty: {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Return Form */}
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Customer Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                />
                                                {errors.customer_name && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_name}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.customer_phone}
                                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                />
                                                {errors.customer_phone && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Return Details */}
                                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Return Details</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Reason for Return
                                                </label>
                                                <textarea
                                                    value={data.reason}
                                                    onChange={(e) => setData('reason', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 resize-none"
                                                />
                                                {errors.reason && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Return Type
                                                    </label>
                                                    <select
                                                        value={data.return_type}
                                                        onChange={(e) => setData('return_type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    >
                                                        <option value="refund">Refund</option>
                                                        <option value="exchange">Exchange</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Refund Method
                                                    </label>
                                                    <select
                                                        value={data.refund_method}
                                                        onChange={(e) => setData('refund_method', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                                    >
                                                        <option value="original">Original Payment</option>
                                                        <option value="bank">Bank Transfer</option>
                                                        <option value="bkash">bKash</option>
                                                        <option value="store_credit">Store Credit</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Items */}
                                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Items to Return</h2>
                                        {returnItems.length > 0 ? (
                                            <div className="space-y-4">
                                                {returnItems.map((item, index) => {
                                                    const orderItem = order.items.find(oi => oi.product_variant_id === item.product_variant_id);
                                                    return (
                                                        <div key={index} className="p-4 border dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                                        {orderItem?.variant.product.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        SKU: {orderItem?.variant.sku}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Quantity (Max: {orderItem?.quantity})
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max={orderItem?.quantity}
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Refund Price
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.refund_price}
                                                                        onChange={(e) => updateItem(index, 'refund_price', e.target.value)}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Condition
                                                                    </label>
                                                                    <select
                                                                        value={item.condition}
                                                                        onChange={(e) => updateItem(index, 'condition', e.target.value)}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm"
                                                                    >
                                                                        <option value="new">New</option>
                                                                        <option value="used">Used</option>
                                                                        <option value="damaged">Damaged</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Notes
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={item.notes}
                                                                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="border-t dark:border-neutral-700 pt-3">
                                                    <div className="flex justify-between text-lg font-bold">
                                                        <span className="text-gray-900 dark:text-white">Total Refund</span>
                                                        <span className="text-green-600 dark:text-green-400">${totalRefund.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                Click on items from the order to add them to the return
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 resize-none"
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Link
                                    href="/product-returns"
                                    className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || returnItems.length === 0}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <FaSave className="mr-2" /> Submit Return
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-lg">
                            No order selected. Please select an order to create a return.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductReturnCreate;
