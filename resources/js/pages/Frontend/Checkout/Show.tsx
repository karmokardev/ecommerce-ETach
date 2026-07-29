import React from 'react';
import { usePage } from '@inertiajs/react';
import { ShoppingBag, CheckCircle, MapPin, Phone, Mail, Package, ArrowLeft, Home } from 'lucide-react';
import { router } from '@inertiajs/react';

interface OrderItem {
    id: number;
    product_name: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product?: {
        thumbnail?: string;
        images?: string[];
    };
}

interface Order {
    id: number;
    order_no: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: string;
    payment_status: string;
    status: string;
    notes?: string;
    order_date: string;
    items: OrderItem[];
}

const CheckoutShow: React.FC = () => {
    const { props } = usePage();
    const order = (props as any).order as Order;

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `৳${numPrice.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="mx-auto w-full lg:max-w-[var(--breakpoint-2xl)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => router.visit('/')}
                        className="p-2 sm:p-3 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label="Go home"
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Order Confirmed</h1>
                    </div>
                </div>

                {/* Success Message */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg mb-6 sm:mb-8 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Thank You for Your Order!</h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                        Your order has been placed successfully. We'll send you an email confirmation shortly.
                    </p>
                    <div className="inline-block bg-gray-100 rounded-xl px-4 sm:px-6 py-2 sm:py-3">
                        <p className="text-xs sm:text-sm text-gray-500">Order Number</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{order.order_no}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Order Items */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                                Order Items
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 last:border-0">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{item.product_name}</h4>
                                            {item.product_sku && (
                                                <p className="text-xs text-gray-500 mt-1">SKU: {item.product_sku}</p>
                                            )}
                                            <p className="text-sm text-gray-600 mt-1">
                                                Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-sm sm:text-base">{formatPrice(item.subtotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                Shipping Information
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.customer_name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{order.shipping_address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <p className="text-sm text-gray-600">{order.customer_email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Notes */}
                        {order.notes && (
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Notes</h3>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-8">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>

                            {/* Price Breakdown */}
                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span>Shipping</span>
                                    <span className="font-semibold">{formatPrice(order.shipping_cost)}</span>
                                </div>
                                {order.tax > 0 && (
                                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                        <span>Tax</span>
                                        <span className="font-semibold">{formatPrice(order.tax)}</span>
                                    </div>
                                )}
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                                        <span>Discount</span>
                                        <span className="font-semibold">-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-3 sm:pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Payment Method</h4>
                                <p className="text-sm text-gray-600 capitalize">
                                    {order.payment_method.replace('_', ' ')}
                                </p>
                            </div>

                            {/* Order Status */}
                            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Status</h4>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                        Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Date */}
                            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Date</h4>
                                <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
                            </div>

                            {/* Continue Shopping Button */}
                            <button
                                onClick={() => router.visit('/')}
                                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <span>Continue Shopping</span>
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutShow;
