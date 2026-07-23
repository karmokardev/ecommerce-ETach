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
    product_attributes: any;
}

interface Order {
    id: number;
    order_no: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    order_date: string;
    status: string;
    items?: OrderItem[];
}

interface PackingSlipProps {
    order: Order;
}

export default function PackingSlip({ order }: PackingSlipProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real application, this would generate a PDF
        alert('PDF download would be implemented here');
    };

    return (
        <>
            <Head title={`Packing Slip: ${order.order_no}`} />
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

                    {/* Packing Slip */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8" id="packing-slip-content">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 dark:border-neutral-700 pb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PACKING SLIP</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">{order.order_no}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Your Company Name</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">123 Business Street</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">City, Country</p>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Ship To</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{order.customer_name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_email}</p>
                                {order.customer_phone && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_phone}</p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-2">
                                    {order.shipping_address}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Order Details</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-white">Order No:</span> {order.order_no}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-white">Date:</span> {new Date(order.order_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-white">Status:</span> {order.status}
                                </p>
                            </div>
                        </div>

                        {/* Packing List */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items to Pack</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 dark:border-neutral-700">
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 w-12">#</th>
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Product</th>
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">SKU</th>
                                        <th className="text-center py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Qty</th>
                                        <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Attributes</th>
                                        <th className="text-center py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 w-20">Packed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-700">
                                            <td className="py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                                            <td className="py-3 text-sm text-gray-900 dark:text-white">{item.product_name}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{item.product_sku || '-'}</td>
                                            <td className="py-3 text-sm text-gray-900 dark:text-white text-center font-medium">{item.quantity}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {item.product_attributes && typeof item.product_attributes === 'object' ? (
                                                    <div className="text-xs">
                                                        {Object.entries(item.product_attributes as Record<string, string>).map(([key, value]) => (
                                                            <span key={key} className="inline-block bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded mr-1 mb-1">
                                                                {key}: {String(value)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items:</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {order.items?.reduce((total, item) => total + item.quantity, 0) || 0}
                                </span>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Packing Instructions</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Verify all items against this packing slip before shipping</li>
                                <li>• Ensure proper packaging to prevent damage during transit</li>
                                <li>• Include any promotional materials or documentation as required</li>
                                <li>• Seal packages securely and attach shipping label</li>
                                <li>• Mark items as packed using the checkboxes above</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-neutral-700 mt-6 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>For questions about this order, contact: support@company.com</p>
                            <p className="mt-2">Generated on {new Date().toLocaleString()}</p>
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
                    #packing-slip-content {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}
