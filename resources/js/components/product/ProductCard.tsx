import React from "react";
import { router } from "@inertiajs/react";
import ShareButton from "../ShareButton";
import CartButton from "../CartButton";
import WishlistIconButton from "../WishlistIconButton";

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    productVariantId?: number | null;
}

export default function ProductCard({ id, name, image, price, originalPrice, productVariantId }: ProductCardProps) {
  // Convert prices to numbers
  const numericPrice = typeof price === 'string' ? parseFloat(price) : (price || 0);
  const numericOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;

  // Calculate discount percentage
  const discountPercent = numericPrice && numericOriginalPrice && numericOriginalPrice > numericPrice 
    ? Math.round(((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100) 
    : null;

  const handleClick = () => {
    router.visit(`/product/${id}`);
  };

  return (
<div className="relative w-full aspect-square overflow-hidden cursor-pointer" onClick={handleClick}> 
       {/* Discount badge */}
        {discountPercent ? (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
            -{discountPercent}%
          </span>
        ) : null}

        {/* product image */}
        <div className="absolute inset-0">
          <img
            src={image || "/uploads/products/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* action icons */}
        <div className="absolute right-4 top-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <WishlistIconButton 
            productId={id} 
            productVariantId={productVariantId} 
            size="sm" 
            onSuccess={() => router.reload()} 
          />
          <CartButton productId={id} productVariantId={productVariantId} size="sm" />
          <ShareButton size="sm" />
        </div>

        {/* bottom bar */}
        <div className="absolute bottom-0 left-2 right-2 sm:left-6 sm:right-6 bg-white rounded-t-lg px-2 py-1 flex items-center justify-center gap-1 overflow-hidden">          
            <p className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-none whitespace-nowrap truncate">
              ৳{numericPrice.toFixed(2)}
            </p>
            {numericOriginalPrice && (
              <p className="text-[10px] sm:text-xs text-neutral-400 line-through leading-none whitespace-nowrap truncate">
                ৳{numericOriginalPrice.toFixed(2)}
              </p>
            )}
        </div>
      </div>
  );
}