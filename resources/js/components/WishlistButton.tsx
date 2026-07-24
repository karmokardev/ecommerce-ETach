import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Heart, HeartCrack } from 'lucide-react';

interface WishlistButtonProps {
    productId: number;
    productVariantId?: number | null;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
    productId,
    productVariantId = null,
    size = 'md',
    showLabel = false,
}) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkWishlistStatus();
    }, [productId, productVariantId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch('/wishlist/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_variant_id: productVariantId,
                }),
            });
            const data = await response.json();
            setIsInWishlist(data.exists);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const toggleWishlist = async () => {
        setIsLoading(true);
        try {
            if (isInWishlist) {
                // Remove from wishlist
                await router.delete(`/wishlist/${productId}-${productVariantId || 'null'}`, {
                    onSuccess: () => {
                        setIsInWishlist(false);
                        setIsLoading(false);
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                });
            } else {
                // Add to wishlist
                await router.post('/wishlist', {
                    product_id: productId,
                    product_variant_id: productVariantId,
                }, {
                    onSuccess: () => {
                        setIsInWishlist(true);
                        setIsLoading(false);
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className={`
                flex items-center gap-2 rounded-lg transition-all duration-200
                ${isInWishlist
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }
                ${sizeClasses[size]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isInWishlist ? (
                <Heart size={iconSizes[size]} fill="currentColor" />
            ) : (
                <HeartCrack size={iconSizes[size]} />
            )}
            {showLabel && (
                <span className="text-sm font-medium">
                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </span>
            )}
        </button>
    );
};

export default WishlistButton;
