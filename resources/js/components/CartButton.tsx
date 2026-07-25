import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CartButtonProps {
    productId?: number;
    productVariantId?: number | null;
    size?: 'sm' | 'md' | 'lg';
    onAddToCart?: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({
    productId,
    productVariantId = null,
    size = 'md',
    onAddToCart,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (onAddToCart) {
            onAddToCart();
            return;
        }

        if (!productId) return;

        setIsLoading(true);
        try {
            await router.post('/cart', {
                product_id: productId,
                product_variant_id: productVariantId,
                quantity: 1,
            }, {
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
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
            onClick={handleAddToCart}
            disabled={isLoading}
            aria-label="Add to cart"
            className={`
                rounded-full bg-white flex items-center justify-center 
                text-neutral-700 hover:text-neutral-900 transition-colors
                ${sizeClasses[size]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <ShoppingBag size={iconSizes[size]} />
        </button>
    );
};

export default CartButton;
