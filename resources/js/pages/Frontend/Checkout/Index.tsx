import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Truck, CreditCard, MapPin, Mail, Phone, Check, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        thumbnail?: string;
        images?: string[];
        min_price?: number;
        max_price?: number;
        category?: {
            name: string;
        };
        brand?: {
            name: string;
        };
    };
    variant?: {
        id: number;
        price?: number;
        sku?: string;
        compare_price?: number;
    };
    quantity: number;
    subtotal: number;
    flash_sale_id?: number | null;
    flash_deal_price?: number | null;
}

interface Cart {
    id: number;
    items: CartItem[];
    subtotal?: number;
    total?: number;
    shipping_total?: number;
    tax_total?: number;
    tax?: number;
    discount?: number;
}

interface Address {
    full_name?: string;
    email?: string;
    phone?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

const CheckoutIndex: React.FC = () => {
    const { props } = usePage();
    const cart = (props as any).cart as Cart | null;
    const savedAddress = (props as any).savedAddress as Address | null;

    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
    const [loading, setLoading] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);

    const [formData, setFormData] = useState({
        email: savedAddress?.email || '',
        full_name: savedAddress?.full_name || '',
        phone: savedAddress?.phone || '',
        address_line_1: savedAddress?.address_line_1 || '',
        address_line_2: savedAddress?.address_line_2 || '',
        city: savedAddress?.city || '',
        state: savedAddress?.state || '',
        postal_code: savedAddress?.postal_code || '',
        country: savedAddress?.country || 'Bangladesh',
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateShipping = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        
        if (!formData.full_name) newErrors.full_name = 'Full name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address_line_1) newErrors.address_line_1 = 'Address line 1 is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State/Province is required';
        if (!formData.postal_code) newErrors.postal_code = 'Postal code is required';
        if (!formData.country) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinueToPayment = () => {
        if (validateShipping()) {
            setStep('payment');
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateShipping()) return;

        setLoading(true);
        try {
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    ...formData,
                    save_address: saveAddress,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.visit(`/order/${data.order.id}`);
            } else {
                setErrors(data.errors || { general: data.message || 'Failed to place order' });
            }
        } catch (error) {
            setErrors({ general: 'Failed to place order. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const getProductImage = (item: CartItem) => {
        if (item.product.thumbnail && typeof item.product.thumbnail === 'string') {
            const thumbnail = item.product.thumbnail;
            if (thumbnail.startsWith('/storage')) return thumbnail;
            if (thumbnail.startsWith('http')) return thumbnail;
            return `/storage/${thumbnail}`;
        }
        if (item.product.images && item.product.images.length > 0) {
            const image = item.product.images[0];
            if (typeof image === 'object' && image !== null && 'image' in image) {
                const imageUrl = (image as any).image;
                if (imageUrl && typeof imageUrl === 'string') {
                    if (imageUrl.startsWith('/storage')) return imageUrl;
                    if (imageUrl.startsWith('http')) return imageUrl;
                    return `/storage/${imageUrl}`;
                }
            }
            if (typeof image === 'string') {
                if (image.startsWith('/storage')) return image;
                if (image.startsWith('http')) return image;
                return `/storage/${image}`;
            }
        }
        return null;
    };

    const getItemPrice = (item: CartItem) => {
        if (item.flash_deal_price) return item.flash_deal_price;
        if (item.variant && item.variant.price) return item.variant.price;
        if (item.product.min_price) return item.product.min_price;
        return 0;
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `৳${numPrice.toFixed(2)}`;
    };

    const subtotal = cart?.subtotal || cart?.total || 0;
    const shipping = cart?.shipping_total || 0;
    const tax = cart?.tax || cart?.tax_total || 0;
    const discount = cart?.discount || 0;
    const total = cart?.total || subtotal + shipping + tax - discount;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <button
                        onClick={() => router.visit('/')}
                        className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="mx-auto w-full lg:max-w-[var(--breakpoint-2xl)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 sm:p-3 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-gray-800" />
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold ${step === 'shipping' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                                {step === 'shipping' ? '1' : <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>
                            <span className="text-sm sm:text-base font-semibold hidden sm:block">Shipping</span>
                        </div>
                        <div className="w-8 sm:w-12 h-0.5 bg-gray-300"></div>
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                                {step === 'payment' ? '2' : '2'}
                            </div>
                            <span className="text-sm sm:text-base font-semibold hidden sm:block">Payment</span>
                        </div>
                        <div className="w-8 sm:w-12 h-0.5 bg-gray-300"></div>
                        <div className={`flex items-center gap-2 ${step === 'review' ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold ${step === 'review' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span className="text-sm sm:text-base font-semibold hidden sm:block">Review</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        {/* Shipping Form */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                Shipping Information
                            </h2>

                            {/* Contact Information */}
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Contact Information</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="+880 1XXX-XXXXXX"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Shipping Address</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="John Doe"
                                        />
                                        {errors.full_name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.full_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                        <input
                                            type="text"
                                            name="address_line_1"
                                            value={formData.address_line_1}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.address_line_1 ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Street address, apartment, etc."
                                        />
                                        {errors.address_line_1 && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address_line_1}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                        <input
                                            type="text"
                                            name="address_line_2"
                                            value={formData.address_line_2}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400"
                                            placeholder="Apartment, suite, etc."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Dhaka"
                                            />
                                            {errors.city && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Dhaka"
                                            />
                                            {errors.state && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                                            <input
                                                type="text"
                                                name="postal_code"
                                                value={formData.postal_code}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.postal_code ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="1000"
                                            />
                                            {errors.postal_code && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.postal_code}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Bangladesh"
                                            />
                                            {errors.country && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.country}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 resize-none"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>

                            {/* Save Address Checkbox */}
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <input
                                    type="checkbox"
                                    id="save_address"
                                    checked={saveAddress}
                                    onChange={(e) => setSaveAddress(e.target.checked)}
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <label htmlFor="save_address" className="text-sm sm:text-base text-gray-700 cursor-pointer">
                                    Save this information for next time
                                </label>
                            </div>

                            {/* Continue Button */}
                            {step === 'shipping' && (
                                <button
                                    onClick={handleContinueToPayment}
                                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <span>Continue to Payment</span>
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                                </button>
                            )}
                        </div>

                        {/* Payment Section */}
                        {step === 'payment' && (
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Payment Method
                                </h2>

                                <div className="border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gray-50">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-900 flex items-center justify-center">
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Cash on Delivery</h3>
                                            <p className="text-xs sm:text-sm text-gray-600">Pay with cash when your order arrives</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setStep('shipping')}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Place Order</span>
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1 order-first lg:order-none">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto">
                                {cart.items.map((item) => {
                                    const productImage = getProductImage(item);
                                    const itemPrice = getItemPrice(item);
                                    
                                    return (
                                        <div key={item.id} className="flex gap-3 sm:gap-4">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                                {productImage ? (
                                                    <img
                                                        src={productImage}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Qty: {item.quantity} × {formatPrice(itemPrice)}
                                                </p>
                                                <p className="font-bold text-gray-900 text-sm sm:text-xs mt-1">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pt-4 sm:pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span className="flex items-center gap-2">
                                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Subtotal
                                    </span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span className="flex items-center gap-2">
                                        <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Shipping
                                    </span>
                                    <span className="font-semibold">{formatPrice(shipping)}</span>
                                </div>
                                {tax > 0 && (
                                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                        <span className="flex items-center gap-2">
                                            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Tax
                                        </span>
                                        <span className="font-semibold">{formatPrice(tax)}</span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                                        <span>Discount</span>
                                        <span className="font-semibold">-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-3 sm:pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                <span>Cash on Delivery available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutIndex;
