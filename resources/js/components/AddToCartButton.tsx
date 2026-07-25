import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    productId: number;
    productVariantId?: number | null;
    quantity?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    productId,
    productVariantId = null,
    quantity = 1,
    size = 'md',
    showLabel = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const addToCart = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_variant_id: productVariantId,
                    quantity,
                }),
            });

            if (response.ok) {
                // Show success notification or update cart count
                const data = await response.json();
                console.log('Added to cart:', data);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'p-2',
        md: 'p-2.5',
        lg: 'p-3',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button
            onClick={addToCart}
            disabled={isLoading}
            className={`
                flex items-center justify-center gap-2 rounded-xl transition-all duration-200
                bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-md
                ${sizeClasses[size]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title="Add to cart"
        >
            <ShoppingCart size={iconSizes[size]} />
            {showLabel && (
                <span className="text-sm font-medium">
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                </span>
            )}
        </button>
    );
};

export default AddToCartButton;
