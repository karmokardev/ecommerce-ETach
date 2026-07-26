import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Check } from 'lucide-react';
import { router } from '@inertiajs/react';
import CartButton from '@/components/CartButton';
import WishlistIconButton from '@/components/WishlistIconButton';
import ShareButton from '@/components/ShareButton';

interface Attribute {
    attribute: string;
    value: string;
}

interface Variant {
    id: number;
    price: number;
    stock: number;
    sku: string;
}

interface Review {
    id: number;
    rating: number;
    title?: string;
    review: string;
    user: string;
    is_verified_purchase: boolean;
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    images: string[];
    price: number;
    original_price?: number;
    category?: string;
    brand?: string;
    attributes?: Attribute[];
    variants: Variant[];
    rating: number;
    review_count: number;
    reviews: Review[];
}

interface Props {
    product?: Product;
}

export default function ProductDetails({ product: initialProduct }: Props) {
    const [product, setProduct] = useState<Product | null>(initialProduct || null);
    const [loading, setLoading] = useState(!initialProduct);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

    useEffect(() => {
        if (!initialProduct) {
            const pathParts = window.location.pathname.split('/');
            const productId = pathParts[pathParts.length - 1];
            fetchProduct(productId);
        } else {
            setSelectedImage(0);
            setSelectedVariant(initialProduct.variants[0] || null);
        }
    }, [initialProduct]);

    const fetchProduct = async (id: string) => {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProduct(data);
            setSelectedVariant(data.variants[0] || null);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVariantSelect = (variant: Variant) => {
        setSelectedVariant(variant);
    };

    const handleBack = () => {
        router.visit('/');
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
            } else {
                stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
            }
        }
        return stars;
    };

    // Group attributes by type
    const groupedAttributes = product?.attributes?.reduce((acc, attr) => {
        if (!acc[attr.attribute]) {
            acc[attr.attribute] = [];
        }
        acc[attr.attribute].push(attr.value);
        return acc;
    }, {} as Record<string, string[]>) || {};

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Product not found</p>
                    <button
                        onClick={handleBack}
                        className="text-primary hover:underline"
                    >
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    const discountPercent = product.original_price && product.original_price > product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;

    return (
        <>
            <Head title={product.name} />
            <div className="min-h-screen bg-white">
                {/* Header */}
                
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back</span>
                            </button>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                                <span>/</span>
                                {product.category && (
                                    <>
                                        <span className="hover:text-gray-900 cursor-pointer transition-colors">{product.category}</span>
                                        <span>/</span>
                                    </>
                                )}
                                <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                            </div>
                        </div>
                    </div>
                

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Images Section */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                                <img
                                    src={product.images[selectedImage] || product.image || '/uploads/products/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index ? 'border-primary' : 'border-transparent'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="space-y-6">
                            <div>
                                {product.category && (
                                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {product.rating.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        ({product.review_count} reviews)
                                    </span>
                                </div>
                                
                                {product.brand && (
                                    <p className="text-sm text-gray-700">Brand: {product.brand}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-primary">
                                    ৳{selectedVariant?.price.toFixed(2) || product.price.toFixed(2)}
                                </p>
                                {product.original_price && (
                                    <>
                                        <p className="text-xl text-gray-400 line-through">
                                            ৳{product.original_price.toFixed(2)}
                                        </p>
                                        {discountPercent && (
                                            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                                                -{discountPercent}%
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="prose max-w-none">
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                                </div>
                            )}

                            {/* Attributes (Color, Size, etc.) */}
                            {Object.keys(groupedAttributes).length > 0 && (
                                <div className="space-y-4">
                                    {Object.entries(groupedAttributes).map(([attributeName, values]) => (
                                        <div key={attributeName}>
                                            <h3 className="text-lg font-semibold mb-2 capitalize text-gray-900">{attributeName}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {values.map((value) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => {
                                                            if (attributeName === 'Color') setSelectedColor(value);
                                                            if (attributeName === 'Size') setSelectedSize(value);
                                                        }}
                                                        className={`px-4 py-2 border rounded-lg transition-all ${
                                                            (attributeName === 'Color' && selectedColor === value) ||
                                                            (attributeName === 'Size' && selectedSize === value)
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                                        }`}
                                                    >
                                                        {attributeName === 'Color' ? (
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-5 h-5 rounded-full border"
                                                                    style={{ backgroundColor: value.toLowerCase() }}
                                                                />
                                                                {value}
                                                            </div>
                                                        ) : (
                                                            value
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Variants */}
                                    {product.variants.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Variants</h3>
                                    <div className="space-y-2">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => handleVariantSelect(variant)}
                                                className={`w-full p-4 border rounded-lg text-left transition-all ${
                                                    selectedVariant?.id === variant.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-900">SKU: {variant.sku}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">৳{variant.price.toFixed(2)}</p>
                                                        <p className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {variant.stock > 0 ? `In Stock (${variant.stock})` : 'Out of Stock'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    onClick={async () => {
                                        const payload = selectedVariant ? {
                                            product_id: product.id,
                                            product_variant_id: selectedVariant.id,
                                            quantity: 1,
                                        } : {
                                            product_id: product.id,
                                            quantity: 1,
                                        };
                                        
                                        try {
                                            const response = await fetch('/cart', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                },
                                                body: JSON.stringify(payload),
                                            });
                                            if (response.ok) {
                                                router.reload();
                                            }
                                        } catch (error) {
                                            console.error('Error adding to cart:', error);
                                        }
                                    }}
                                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={async () => {
                                        const payload = selectedVariant ? {
                                            product_id: product.id,
                                            product_variant_id: selectedVariant.id,
                                            quantity: 1,
                                        } : {
                                            product_id: product.id,
                                            quantity: 1,
                                        };
                                        
                                        try {
                                            const response = await fetch('/cart', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                },
                                                body: JSON.stringify(payload),
                                            });
                                            if (response.ok) {
                                                router.visit('/cart');
                                            }
                                        } catch (error) {
                                            console.error('Error adding to cart:', error);
                                        }
                                    }}
                                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Buy Now
                                </button>
                                <div className="flex gap-2">
                                    {selectedVariant ? (
                                        <WishlistIconButton
                                            productId={product.id}
                                            productVariantId={selectedVariant.id}
                                            size="lg"
                                            onSuccess={() => router.reload()}
                                        />
                                    ) : (
                                        <WishlistIconButton
                                            productId={product.id}
                                            size="lg"
                                            onSuccess={() => router.reload()}
                                        />
                                    )}
                                    <ShareButton size="lg" />
                                </div>
                            </div>

                            {/* SKU */}
                            {selectedVariant && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">SKU:</span> {selectedVariant.sku}
                                </div>
                            )}

                            {/* Tags */}
                            {product.category && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {product.category}
                                    </span>
                                    {product.brand && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {product.brand}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex items-center">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="font-semibold">{review.rating.toFixed(1)}</span>
                                                </div>
                                                <p className="font-semibold text-gray-900">{review.user}</p>
                                                {review.is_verified_purchase && (
                                                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                                                        <Check className="w-4 h-4" />
                                                        <span>Verified Purchase</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">{review.created_at}</span>
                                        </div>
                                        {review.title && (
                                            <h4 className="font-semibold mb-1">{review.title}</h4>
                                        )}
                                        <p className="text-gray-700">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
