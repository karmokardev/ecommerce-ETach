import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

interface Product {
    id: number;
    name: string;
    slug: string;
    variants: ProductVariant[];
}

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    current_stock: number;
    attributes?: string;
}

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    email: string;
    customer_account?: {
        id: number;
        balance: number;
        credit_limit: number;
        total_due: number;
    };
}

interface CartItem {
    variant_id: number;
    product_name: string;
    variant_sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    discount: number;
    stock: number;
}

interface TodaySales {
    total_orders: number;
    total_sales: number;
    total_paid: number;
    total_due: number;
    cash_sales: number;
    card_sales: number;
    bkash_sales: number;
    nagad_sales: number;
}

interface DueCustomers {
    total_due_customers: number;
    total_due_amount: number;
    customers: Array<{
        id: number;
        name: string;
        phone: string | null;
        balance: number;
        total_due: number;
        credit_limit: number;
        available_credit: number;
    }>;
}

interface PosProps {
    products: Product[];
    customers: Customer[];
    todaySales: TodaySales;
    dueCustomers: DueCustomers;
}

export default function PosIndex({ products, customers, todaySales, dueCustomers }: PosProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [notes, setNotes] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some(v => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const addToCart = (variant: ProductVariant, product: Product) => {
        const existingItem = cart.find(item => item.variant_id === variant.id);
        
        if (existingItem) {
            if (existingItem.quantity >= variant.current_stock) {
                toast.error('Not enough stock available');
                return;
            }
            setCart(cart.map(item =>
                item.variant_id === variant.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
                    : item
            ));
        } else {
            setCart([...cart, {
                variant_id: variant.id,
                product_name: product.name,
                variant_sku: variant.sku || '',
                quantity: 1,
                unit_price: variant.price,
                subtotal: variant.price,
                discount: 0,
                stock: variant.current_stock,
            }]);
        }
    };

    const updateQuantity = (variantId: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.variant_id === variantId) {
                const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + delta));
                return { ...item, quantity: newQuantity, subtotal: newQuantity * item.unit_price };
            }
            return item;
        }));
    };

    const removeFromCart = (variantId: number) => {
        setCart(cart.filter(item => item.variant_id !== variantId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal + tax - discount;
    const dueAmount = total - paidAmount;

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        const customer = customers.find(c => c.id === selectedCustomer);
        
        router.post('/pos', {
            user_id: selectedCustomer,
            customer_name: customer ? customer.name : customerName || 'Walk-in Customer',
            customer_phone: customer ? customer.phone : customerPhone,
            subtotal,
            tax,
            discount,
            total,
            paid_amount: paidAmount,
            due_amount: dueAmount,
            notes,
            items: cart.map(item => ({
                product_variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount: item.discount,
            })),
            payments: paidAmount > 0 ? [{
                amount: paidAmount,
                payment_method: paymentMethod,
                notes: `Payment via ${paymentMethod}`,
            }] : [],
        }, {
            onSuccess: () => {
                toast.success('Order created successfully');
                setCart([]);
                setSelectedCustomer(null);
                setCustomerName('');
                setCustomerPhone('');
                setDiscount(0);
                setTax(0);
                setPaidAmount(0);
                setNotes('');
                setShowPaymentModal(false);
            },
            onError: (errors) => {
                toast.error('Failed to create order');
                console.error(errors);
            },
        });
    };

    return (
        <>
            <Head title="Point of Sale" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Point of Sale</h1>
                    <button
                        onClick={() => router.get('/pos/orders')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View Orders
                    </button>
                </div>

                {/* Today's Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border dark:border-neutral-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
                        <div className="text-2xl font-bold dark:text-white">{todaySales.total_orders}</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border dark:border-neutral-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Sales</div>
                        <div className="text-2xl font-bold text-green-600">${todaySales.total_sales}</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border dark:border-neutral-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Paid</div>
                        <div className="text-2xl font-bold text-blue-600">${todaySales.total_paid}</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border dark:border-neutral-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Due</div>
                        <div className="text-2xl font-bold text-red-600">${todaySales.total_due}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FaSearch className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="border dark:border-neutral-700 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="font-medium text-sm dark:text-white mb-2">{product.name}</div>
                                        <div className="space-y-2">
                                            {product.variants.map(variant => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => addToCart(variant, product)}
                                                    disabled={variant.current_stock <= 0}
                                                    className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-neutral-800 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{variant.sku}</div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium dark:text-white">${variant.price}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Stock: {variant.current_stock}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <h2 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                            <FaShoppingCart />
                            Cart ({cart.length})
                        </h2>

                        {/* Customer Selection */}
                        <div className="mb-4 space-y-2">
                            <select
                                value={selectedCustomer || ''}
                                onChange={(e) => setSelectedCustomer(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} {customer.customer_account && `(Due: $${customer.customer_account.total_due})`}
                                    </option>
                                ))}
                            </select>
                            
                            {!selectedCustomer && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Customer Name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Customer Phone"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                </>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
                            {cart.map(item => (
                                <div key={item.variant_id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-800 rounded">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium dark:text-white">{item.product_name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.variant_sku}</div>
                                        <div className="text-sm font-medium text-green-600">${item.unit_price}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.variant_id, -1)}
                                            className="w-6 h-6 bg-gray-200 dark:bg-neutral-700 rounded flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-600"
                                        >
                                            <FaMinus className="text-xs" />
                                        </button>
                                        <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.variant_id, 1)}
                                            className="w-6 h-6 bg-gray-200 dark:bg-neutral-700 rounded flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-600"
                                        >
                                            <FaPlus className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.variant_id)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t dark:border-neutral-700 pt-4 space-y-2">
                            <div className="flex justify-between text-sm dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm dark:text-gray-300">
                                <span>Tax</span>
                                <input
                                    type="number"
                                    value={tax}
                                    onChange={(e) => setTax(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded text-right bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div className="flex justify-between text-sm dark:text-gray-300">
                                <span>Discount</span>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-neutral-700 rounded text-right bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div className="flex justify-between text-lg font-bold dark:text-white">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-4 space-y-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300'}`}
                                >
                                    <FaMoneyBillWave /> Cash
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300'}`}
                                >
                                    <FaCreditCard /> Card
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('bkash')}
                                    className={`flex-1 px-3 py-2 rounded-lg ${paymentMethod === 'bkash' ? 'bg-pink-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300'}`}
                                >
                                    bKash
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('nagad')}
                                    className={`flex-1 px-3 py-2 rounded-lg ${paymentMethod === 'nagad' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300'}`}
                                >
                                    Nagad
                                </button>
                            </div>
                            
                            <input
                                type="number"
                                placeholder="Paid Amount"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />

                            {dueAmount > 0 && (
                                <div className="text-sm text-red-600 dark:text-red-400">
                                    Due Amount: ${dueAmount}
                                </div>
                            )}

                            <textarea
                                placeholder="Notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 resize-none"
                                rows={2}
                            />

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>

                {/* Due Customers */}
                {dueCustomers.customers.length > 0 && (
                    <div className="mt-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <h2 className="text-lg font-bold dark:text-white mb-4">Due Customers ({dueCustomers.total_due_customers})</h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Total Due Amount: ${dueCustomers.total_due_amount}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dueCustomers.customers.map(customer => (
                                <div key={customer.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="font-medium dark:text-white">{customer.name}</div>
                                    {customer.phone && <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>}
                                    <div className="mt-2 text-sm">
                                        <div className="text-red-600 dark:text-red-400">Due: ${customer.total_due}</div>
                                        <div className="text-gray-500 dark:text-gray-400">Credit Limit: ${customer.credit_limit}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
