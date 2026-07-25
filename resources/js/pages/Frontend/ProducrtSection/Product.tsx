import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ProductCard from '../../../components/product/ProductCard';

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    original_price?: number;
    product_variant_id?: number | null;
}

interface Props {
    products?: Product[];
}

export default function ProductSection({ products: initialProducts = [] }: Props) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);

    useEffect(() => {
        if (!initialProducts.length) {
            fetchProducts();
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products/latest');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-[var(--breakpoint-2xl)] mx-auto">
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="w-full py-4 bg-primary text-white text-3xl font-bold text-center mb-4">
                    New Arrival
                </h2>
                
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                image={product.image}
                                price={product.price}
                                originalPrice={product.original_price}
                                productVariantId={product.product_variant_id}
                            />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products available
                    </div>
                )}
            </div>
        </section>
    );
}
