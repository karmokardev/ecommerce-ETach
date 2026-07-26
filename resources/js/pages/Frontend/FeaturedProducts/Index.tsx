import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FeaturedCard from '@/components/featured/FeaturedCard';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    title: string;
    slug: string;
    category?: string;
    image: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    rating: number;
    reviewCount: number;
}

const FeaturedProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 16;

    useEffect(() => {
        fetchFeaturedProducts(0);
    }, []);

    const fetchFeaturedProducts = async (currentOffset: number, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            const response = await fetch(`/api/featured-products/all?offset=${currentOffset}&limit=${limit}`);
            const data = await response.json();
            
            if (append) {
                setProducts(prev => [...prev, ...(data.products || [])]);
            } else {
                setProducts(data.products || []);
            }
            
            setHasMore(data.has_more || false);
            setTotal(data.total || 0);
            setOffset(currentOffset + (data.products?.length || 0));
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !loadingMore) {
            fetchFeaturedProducts(offset, true);
        }
    };

    return (
        <>
            <Head title="Featured Products" />
            <div className="py-8">
                <div className="mx-auto w-full lg:max-w-[var(--breakpoint-2xl)] px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Featured Products</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Featured Products
                        </h1>
                        <p className="text-gray-600">
                            Discover our handpicked selection of top-rated items {loading ? '' : `(${total} products)`}
                        </p>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 h-64 animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <FeaturedCard key={product.id} {...product} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loadingMore ? 'Loading...' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                No featured products found at the moment.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FeaturedProductsPage;
