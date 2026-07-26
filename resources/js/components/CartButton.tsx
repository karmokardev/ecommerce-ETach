import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CartButtonProps {
    productId?: number;
    productVariantId?: number | null;
    size?: 'sm' | 'md' | 'lg';
    isInCart?: boolean;
    onToggle?: () => void;
    onSuccess?: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({
    productId,
    productVariantId = null,
    size = 'md',
    isInCart: propIsInCart = false,
    onToggle,
    onSuccess,
}) => {
    const [isInCart, setIsInCart] = useState(propIsInCart);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsInCart(propIsInCart);
    }, [propIsInCart]);

    useEffect(() => {
        if (productId) {
            checkCartStatus();
        }
    }, [productId, productVariantId]);

    const checkCartStatus = async () => {
        try {
            const response = await fetch('/cart/check', {
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
            setIsInCart(data.exists);
        } catch (error) {
            console.error('Error checking cart status:', error);
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
            if (isInCart) {
                const response = await fetch('/cart/remove', {
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
                    setIsInCart(false);
                    if (onSuccess) onSuccess();
                    // Reload page props to update cart count in navbar
                    router.reload();
                }
            } else {
                const response = await fetch('/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        product_variant_id: productVariantId,
                        quantity: 1,
                    }),
                });
                
                if (response.ok) {
                    setIsInCart(true);
                    if (onSuccess) onSuccess();
                    // Reload page props to update cart count in navbar
                    router.reload();
                }
            }
        } catch (error) {
            console.error('Error toggling cart:', error);
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
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
            className={`
                rounded-full flex items-center justify-center 
                ${isInCart ? 'bg-black text-white' : 'bg-white text-neutral-700 hover:text-neutral-900'} transition-colors
                ${sizeClasses[size]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {isInCart ? (
                <ShoppingBag size={iconSizes[size]} />
            ) : (
                <ShoppingBag 
                    size={iconSizes[size]} 
                    fill="none"
                />
            )}
        </button>
    );
};

export default CartButton;
