import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import FeaturedCard from "@/components/featured/FeaturedCard";

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

export default function FeaturedProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/featured-products?limit=4');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto w-full lg:max-w-[var(--breakpoint-3xl)] bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 sm:mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
                            Featured Products
                        </h2>
                        <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>

                    <Link
                        href="/featured-products"
                        className="flex items-center gap-1 text-sm sm:text-base font-medium text-primary hover:text-secondary transition-colors whitespace-nowrap"
                    >
                        See More
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Banner */}
                    <div className="lg:w-1/3 w-full">
                        <div className="relative h-full min-h-[250px] lg:min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary shadow-xl">
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 sm:p-6 lg:p-8 text-center">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                                    Featured
                                </h2>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-6">
                                    Products
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-4 sm:mb-6 lg:mb-8 px-2">
                                    Discover our handpicked selection of top-rated items
                                </p>
                                <button className="bg-white text-primary px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base">
                                    Shop Now
                                </button>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>

                    {/* Right Product Cards */}
                    <div className="lg:w-2/3 w-full">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 h-40 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {products.map((product) => (
                                    <FeaturedCard key={product.id} {...product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
