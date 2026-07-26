import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { router } from '@inertiajs/react';

interface WishlistIconButtonProps {
    productId?: number;
    productVariantId?: number | null;
    size?: 'sm' | 'md' | 'lg';
    isWishlisted?: boolean;
    onToggle?: () => void;
    onSuccess?: () => void;
}

const WishlistIconButton: React.FC<WishlistIconButtonProps> = ({
    productId,
    productVariantId = null,
    size = 'md',
    isWishlisted: propIsWishlisted = false,
    onToggle,
    onSuccess,
}) => {
    const [isWishlisted, setIsInWishlist] = useState(propIsWishlisted);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsInWishlist(propIsWishlisted);
    }, [propIsWishlisted]);

    useEffect(() => {
        if (productId) {
            checkWishlistStatus();
        }
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

    const handleToggle = async () => {
        if (onToggle) {
            onToggle();
            return;
        }

        if (!productId) return;

        setIsLoading(true);
        try {
            if (isWishlisted) {
                // Find the wishlist item ID first
                const checkResponse = await fetch('/wishlist/check', {
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
                const checkData = await checkResponse.json();

                if (checkData.exists) {
                    // Need to get the wishlist ID - we'll need to modify the backend or use a different approach
                    // For now, let's use a simpler approach - just toggle via API
                    const response = await fetch(`/wishlist/remove`, {
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
                    if (response.ok) {
                        setIsInWishlist(false);
                        if (onSuccess) onSuccess();
                    }
                }
            } else {
                const response = await fetch('/wishlist', {
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
                if (response.ok) {
                    setIsInWishlist(true);
                    if (onSuccess) onSuccess();
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const iconSizes = {
        sm: 14,
        md: 15,
        lg: 18,
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            aria-label="Add to wishlist"
            className={`
                rounded-full bg-white flex items-center justify-center 
                text-neutral-700 hover:text-rose-500 transition-colors
                ${sizeClasses[size]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <Heart 
                size={iconSizes[size]} 
                className={isWishlisted ? 'text-rose-500' : ''}
                fill={isWishlisted ? 'currentColor' : 'none'}
            />
        </button>
    );
};

export default WishlistIconButton;
