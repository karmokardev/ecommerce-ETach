import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaPrint, FaDownload } from "react-icons/fa";
import React from 'react';

interface OrderItem {
    id: number;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Order {
    id: number;
    order_no: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    billing_address: string | null;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: string;
    payment_status: string;
    status:string;
    order_date: string;
    user?: {
        name: string;
        email: string;
    };
    items?: OrderItem[];
}

interface InvoiceProps {
    order: Order;
}

export default function Invoice({ order }: InvoiceProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real application, this would generate a PDF
        alert('PDF download would be implemented here');
    };

    return (
        <>
            <Head title={`Invoice: ${order.order_no}`} />
            <div className="p-6 bg-gray-100 dark:bg-neutral-900 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header Actions */}
                    <div className="flex justify-between items-center mb-6 no-print">
                        <button
                            onClick={() => router.get(`/orders/${order.id}`)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                            Back to Order
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaPrint />
                                Print
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FaDownload />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Invoice */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8" id="invoice-content">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-neutral-700 pb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">{order.order_no}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Your Company Name</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">123 Business Street</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">City, Country</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Phone: +880 1XXX-XXXXXX</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email: info@company.com</p>
                            </div>
                        </div>

                        {/* Bill To & Ship To */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Bill To</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{order.customer_name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_email}</p>
                                {order.customer_phone && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_phone}</p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-2">
                                    {order.billing_address || order.shipping_address}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Ship To</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {order.shipping_address}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Invoice Date</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(order.order_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Order No</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.order_no}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Payment Method</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{order.payment_method}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Payment Status</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{order.payment_status}</p>
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 dark:border-neutral-700">
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Item</th>
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">SKU</th>
                                        <th className="text-center py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Qty</th>
                                        <th className="text-right py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Price</th>
                                        <th className="text-right py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-700">
                                            <td className="py-3 text-sm text-gray-900 dark:text-white">{item.product_name}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{item.product_sku || '-'}</td>
                                            <td className="py-3 text-sm text-gray-900 dark:text-white text-center">{item.quantity}</td>
                                            <td className="py-3 text-sm text-gray-900 dark:text-white text-right">${Number(item.unit_price).toFixed(2)}</td>
                                            <td className="py-3 text-sm text-gray-900 dark:text-white text-right">${Number(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Invoice Summary */}
                        <div className="flex justify-end mb-8">
                            <div className="w-full md:w-64">
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-sm text-gray-900 dark:text-white">${Number(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="text-sm text-gray-900 dark:text-white">${Number(order.shipping_cost).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="text-sm text-gray-900 dark:text-white">${Number(order.tax).toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                                        <span className="text-sm text-red-600 dark:text-red-400">-${Number(order.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-t-2 border-gray-200 dark:border-neutral-700 mt-2">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-neutral-700 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>Thank you for your business!</p>
                            <p className="mt-2">If you have any questions, please contact us at info@company.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                    }
                    #invoice-content {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}
