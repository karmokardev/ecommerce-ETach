import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

interface FlashDealProduct {
    id: number;
    name: string;
    image: string;
    original_price: number;
    sale_price: number;
    discount_percentage: number;
    stock_limit: number | null;
    sold_count: number;
    remaining_stock: number;
    is_available: boolean;
    product_variant_id: number | null;
}

interface FlashSale {
    id: number;
    name: string;
    description: string | null;
    discount_type: string;
    discount_value: number;
    starts_at: string;
    ends_at: string;
    remaining_time: number;
}

interface FlashDealData {
    flash_sale: FlashSale | null;
    products: FlashDealProduct[];
}

export default function FlashDealBanner() {
    const [flashDealData, setFlashDealData] = useState<FlashDealData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        fetchFlashDeals();
    }, []);

    useEffect(() => {
        if (flashDealData?.flash_sale) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const endTime = new Date(flashDealData.flash_sale!.ends_at).getTime();
                const distance = endTime - now;

                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    setTimeLeft({ days, hours, minutes, seconds });
                } else {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [flashDealData]);

    const fetchFlashDeals = async () => {
        try {
            const response = await fetch('/api/flash-deals');
            const data = await response.json();
            setFlashDealData(data);
            
            if (data.flash_sale) {
                const now = new Date().getTime();
                const endTime = new Date(data.flash_sale.ends_at).getTime();
                const distance = endTime - now;

                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    setTimeLeft({ days, hours, minutes, seconds });
                }
            }
        } catch (error) {
            console.error('Error fetching flash deals:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return null;
    }

    if (!flashDealData?.flash_sale || flashDealData.products.length === 0) {
        return null;
    }

    const featuredProduct = flashDealData.products[0];

    return (
        <div className="mx-auto w-full lg:max-w-[var(--breakpoint-2xl)] px-4 sm:px-6 lg:px-8 ">
            <div className=" bg-blue-600 rounded-lg shadow-lg overflow-hidden my-4 flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
                {/* Left side - Product info */}
                <div className="flex-1 flex items-center space-x-6 mb-6 md:mb-0">
                    {/* Product Image */}
                    <div className="w-32 h-32 md:w-50 md:h-50 flex-shrink-0">
                        <img
                            src={featuredProduct.image}
                            alt={featuredProduct.name}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Deal Info */}
                    <div className="text-white">
                        <h2 className="text-2xl md:text-3xl font-bold mb-1">{flashDealData.flash_sale.name}</h2>
                        <p className="text-blue-200 text-sm mb-3">{flashDealData.flash_sale.description || 'Limited Time Offer'}</p>
                        
                        <div className="flex items-baseline space-x-3 mb-2">
                            <span className="text-3xl md:text-4xl font-bold text-yellow-400">
                                ${featuredProduct.sale_price.toFixed(2)}
                            </span>
                            <span className="text-lg text-blue-300 line-through">
                                ${featuredProduct.original_price.toFixed(2)}
                            </span>
                            <span className="bg-yellow-500 text-blue-900 text-xs font-bold px-2 py-1 rounded">
                                -{flashDealData.flash_sale.discount_type === 'percentage' 
                                    ? flashDealData.flash_sale.discount_value + '%' 
                                    : '$' + flashDealData.flash_sale.discount_value}
                            </span>
                        </div>

                        <p className="text-sm text-blue-200 mb-4">
                            {featuredProduct.name}
                        </p>

                        <Link
                            href={`/product/${featuredProduct.id}?flash_deal=${flashDealData.flash_sale.id}`}
                            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            Shop the Deal
                        </Link>
                    </div>
                </div>

                {/* Right side - Countdown Timer */}
                <div className="flex-shrink-0">
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {[
                            { value: timeLeft.days, label: 'DAYS' },
                            { value: timeLeft.hours, label: 'HRS' },
                            { value: timeLeft.minutes, label: 'MINS' },
                            { value: timeLeft.seconds, label: 'SECS' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <div className="bg-blue-900 bg-opacity-50 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[70px]">
                                    <span className="text-2xl md:text-3xl font-bold text-white block">
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs text-blue-200 mt-1 block">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
