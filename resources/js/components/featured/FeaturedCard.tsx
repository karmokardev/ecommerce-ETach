import { Star } from 'lucide-react';
import { router } from '@inertiajs/react';
import CartButton from '../CartButton';
import WishlistIconButton from '../WishlistIconButton';

interface ProductCardProps {
    id: number;
    image: string;
    title: string;
    category?: string;
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
}

export default function FeaturedCard({
    id,
    image,
    title,
    category,
    rating,
    reviewCount,
    price,
    originalPrice,
    discountPercent,
}: ProductCardProps) {
    return (
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full overflow-hidden flex">
            {/* Discount badge */}
            {discountPercent ? (
                <span className="absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    -{discountPercent}%
                </span>
            ) : null}

            {/* Product image*/}
            <div className="h-full w-28 sm:w-32 md:w-36 lg:w-40 shrink-0 overflow-hidden bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Details */}
            <div className="flex min-w-0 flex-1 flex-col gap-1 p-3">
                {category && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {category}
                    </span>
                )}
                <h3 className="truncate text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug text-gray-900">
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-xs sm:text-sm md:text-base text-gray-500">
                    <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < Math.round(rating) ? 'currentColor' : 'none'}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                    <span>({reviewCount.toLocaleString()})</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                        ${price.toFixed(2)}
                    </span>
                    {originalPrice ? (
                        <span className="text-xs sm:text-sm md:text-base text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col justify-between items-center p-3">
                {/* Wishlist button */}
                <WishlistIconButton 
                    productId={id} 
                    size="lg" 
                    onSuccess={() => router.reload()} 
                />

                {/* Add to cart button */}
                <CartButton productId={id} size="lg" />
            </div>
        </div>
    );
}

// Example usage:
// <ProductCard
//     image="/images/sneaker.png"
//     title="Men's Air Sneakers Running Shoes"
//     rating={4}
//     reviewCount={1234}
//     price={59.99}
//     originalPrice={79.99}
//     discountPercent={25}
// />