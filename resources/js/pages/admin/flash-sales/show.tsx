import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaBolt, FaCalendar, FaPercent, FaDollarSign, FaBox, FaPlus, FaMinus } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'sonner';

interface FlashSaleProduct {
    id: number;
    product: {
        id: number;
        name: string;
    };
    variant: {
        id: number;
        name: string;
    } | null;
    original_price: number;
    sale_price: number;
    stock_limit: number | null;
    sold_count: number;
}

interface FlashSale {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    discount_type: string;
    discount_value: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    priority: number;
    products: FlashSaleProduct[];
    created_at: string;
    updated_at: string;
}

interface FlashSaleShowProps {
    flashSale: FlashSale;
    availableProducts?: {
        id: number;
        name: string;
        total_stock: number;
        variants?: {
            id: number;
            name: string;
            price: number;
            current_stock: number;
        }[];
    }[];
}

export default function FlashSaleShow({ flashSale, availableProducts = [] }: FlashSaleShowProps) {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stockLimit, setStockLimit] = useState('');

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post(`/flash-sales/${flashSale.id}/add-product`, {
            product_id: parseInt(selectedProduct),
            product_variant_id: selectedVariant ? parseInt(selectedVariant) : null,
            original_price: parseFloat(originalPrice),
            sale_price: parseFloat(salePrice),
            stock_limit: stockLimit ? parseInt(stockLimit) : null,
        }, {
            onSuccess: () => {
                toast.success('Product added to flash sale successfully');
                setShowAddProduct(false);
                setSelectedProduct('');
                setSelectedVariant('');
                setOriginalPrice('');
                setSalePrice('');
                setStockLimit('');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to add product to flash sale');
            },
        });
    };

    const handleRemoveProduct = (flashSaleProductId: number) => {
        if (confirm('Are you sure you want to remove this product from the flash sale?')) {
            router.delete(`/flash-sales/${flashSale.id}/products/${flashSaleProductId}`, {
                onSuccess: () => {
                    toast.success('Product removed from flash sale successfully');
                    router.reload();
                },
                onError: () => {
                    toast.error('Failed to remove product from flash sale');
                },
            });
        }
    };

    const selectedProductData = availableProducts.find(p => p.id === parseInt(selectedProduct));
    const handleEdit = () => {
        router.get(`/flash-sales/${flashSale.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this flash sale?')) {
            router.delete(`/flash-sales/${flashSale.id}`, {
                onSuccess: () => {
                    toast.success('Flash sale deleted successfully');
                    router.get('/flash-sales');
                },
            });
        }
    };

    const handleToggleStatus = () => {
        router.patch(`/flash-sales/${flashSale.id}/toggle-status`, {}, {
            onSuccess: () => {
                toast.success('Flash sale status updated successfully');
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const getRemainingTime = (endsAt: string) => {
        const end = new Date(endsAt);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const isActive = () => {
        const now = new Date();
        const start = new Date(flashSale.starts_at);
        const end = new Date(flashSale.ends_at);
        return flashSale.is_active && now >= start && now < end;
    };

    const getStatus = () => {
        if (isActive()) return 'Active';
        const now = new Date();
        const start = new Date(flashSale.starts_at);
        const end = new Date(flashSale.ends_at);
        
        if (now < start) return 'Upcoming';
        if (now >= end) return 'Expired';
        return flashSale.is_active ? 'Scheduled' : 'Inactive';
    };

    return (
        <>
            <Head title={`Flash Sale: ${flashSale.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/flash-sales')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Flash Sales
                    </button>
                    <h1 className="text-2xl font-bold dark:text-white">Flash Sale Details</h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <FaBolt className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{flashSale.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        getStatus() === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        getStatus() === 'Expired' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                        getStatus() === 'Upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                        {getStatus()}
                                    </span>
                                </div>
                            </div>
                            {flashSale.description && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2">{flashSale.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                {flashSale.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Flash Sale Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                {flashSale.discount_type === 'percentage' ? (
                                    <FaPercent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <FaDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Discount</h3>
                                <p className="text-gray-900 dark:text-white font-medium text-lg">
                                    {flashSale.discount_type === 'percentage' ? `${flashSale.discount_value}%` : formatCurrency(flashSale.discount_value)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time Remaining</h3>
                                <p className="text-gray-900 dark:text-white font-medium text-lg">{getRemainingTime(flashSale.ends_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(flashSale.starts_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(flashSale.ends_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                                <FaBox className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Products</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{flashSale.products.length}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                                <FaBolt className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{flashSale.priority}</p>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Products in Flash Sale</h3>
                            <button
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FaPlus />
                                Add Product
                            </button>
                        </div>

                        {/* Add Product Form */}
                        {showAddProduct && (
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Select Product *
                                            </label>
                                            <select
                                                value={selectedProduct}
                                                onChange={(e) => {
                                                    setSelectedProduct(e.target.value);
                                                    setSelectedVariant('');
                                                    const product = availableProducts.find(p => p.id === parseInt(e.target.value));
                                                    if (product) {
                                                        const price = product.variants?.[0]?.price || 0;
                                                        setOriginalPrice(String(price));
                                                        setStockLimit(String(product.total_stock));
                                                        // Auto-calculate sale price based on flash sale discount
                                                        let calculatedSalePrice = 0;
                                                        if (flashSale.discount_type === 'percentage') {
                                                            calculatedSalePrice = price * (1 - (flashSale.discount_value / 100));
                                                        } else {
                                                            calculatedSalePrice = Math.max(0, price - flashSale.discount_value);
                                                        }
                                                        setSalePrice(String(calculatedSalePrice.toFixed(2)));
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                                required
                                            >
                                                <option value="">Select a product</option>
                                                {availableProducts.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedProductData && selectedProductData.variants && selectedProductData.variants.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Select Variant
                                                </label>
                                                <select
                                                    value={selectedVariant}
                                                    onChange={(e) => {
                                                        setSelectedVariant(e.target.value);
                                                        const variant = selectedProductData.variants?.find(v => v.id === parseInt(e.target.value));
                                                        if (variant) {
                                                            setOriginalPrice(String(variant.price));
                                                            setStockLimit(String(variant.current_stock));
                                                            // Auto-calculate sale price based on flash sale discount
                                                            let calculatedSalePrice = 0;
                                                            if (flashSale.discount_type === 'percentage') {
                                                                calculatedSalePrice = variant.price * (1 - (flashSale.discount_value / 100));
                                                            } else {
                                                                calculatedSalePrice = Math.max(0, variant.price - flashSale.discount_value);
                                                            }
                                                            setSalePrice(String(calculatedSalePrice.toFixed(2)));
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                                >
                                                    <option value="">Default variant</option>
                                                    {selectedProductData.variants.map((variant) => (
                                                        <option key={variant.id} value={variant.id}>
                                                            {variant.name} - ${variant.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Original Price *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={originalPrice}
                                                onChange={(e) => {
                                                    setOriginalPrice(e.target.value);
                                                    // Auto-calculate sale price based on flash sale discount
                                                    const price = parseFloat(e.target.value) || 0;
                                                    let calculatedSalePrice = 0;
                                                    if (flashSale.discount_type === 'percentage') {
                                                        calculatedSalePrice = price * (1 - (flashSale.discount_value / 100));
                                                    } else {
                                                        calculatedSalePrice = Math.max(0, price - flashSale.discount_value);
                                                    }
                                                    setSalePrice(String(calculatedSalePrice.toFixed(2)));
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Sale Price * (Auto-calculated from {flashSale.discount_type === 'percentage' ? flashSale.discount_value + '%' : '$' + flashSale.discount_value} discount)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={salePrice}
                                                onChange={(e) => setSalePrice(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Stock Limit (Auto-filled from available stock)
                                            </label>
                                            <input
                                                type="number"
                                                value={stockLimit}
                                                onChange={(e) => setStockLimit(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                                placeholder="Unlimited"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddProduct(false)}
                                            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add Product
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {flashSale.products.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Original Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sale Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Discount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sold</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                        {flashSale.products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.product.name}</div>
                                                    {product.variant && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{product.variant.name}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatCurrency(product.original_price)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatCurrency(product.sale_price)}</td>
                                                <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                                                    {((product.original_price - product.sale_price) / product.original_price * 100).toFixed(1)}%
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                    {product.stock_limit || '∞'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.sold_count}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleRemoveProduct(product.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                                        title="Remove product"
                                                    >
                                                        <FaMinus className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No products added to this flash sale yet. Click "Add Product" to get started.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created: {formatDate(flashSale.created_at)} • Last updated: {formatDate(flashSale.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
