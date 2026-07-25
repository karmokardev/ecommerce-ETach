<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class FeaturedController extends Controller
{
    /**
     * Show the featured products page.
     */
    public function showPage()
    {
        return Inertia::render('Frontend/FeaturedProducts/Index');
    }

    /**
     * Get featured products for the homepage.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 4);
        
        $featuredProducts = Product::query()
            ->active()
            ->featured()
            ->with(['category.parent', 'brand', 'images', 'variants'])
            ->ordered()
            ->limit($limit)
            ->get();

        return response()->json([
            'products' => $featuredProducts->map(function ($product) {
                $minPrice = $product->getMinPriceAttribute();
                $maxPrice = $product->getMaxPriceAttribute();
                $originalPrice = $maxPrice ?? $minPrice;
                $discountPercent = $minPrice && $originalPrice > $minPrice 
                    ? round((($originalPrice - $minPrice) / $originalPrice) * 100) 
                    : null;

                return [
                    'id' => $product->id,
                    'title' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->breadcrumb_string,
                    'image' => $product->thumbnail ?? $product->images->first()?->url ?? '/uploads/products/placeholder.svg',
                    'price' => $minPrice ?? 0,
                    'originalPrice' => $originalPrice !== $minPrice ? $originalPrice : null,
                    'discountPercent' => $discountPercent,
                    'rating' => 4.5, // You can add a reviews relationship to get actual ratings
                    'reviewCount' => 128, // You can add a reviews relationship to get actual review counts
                ];
            }),
        ]);
    }

    /**
     * Get all featured products for the "See More" page (Load More).
     */
    public function all(Request $request): JsonResponse
    {
        $offset = $request->get('offset', 0);
        $limit = $request->get('limit', 16);

        $featuredProducts = Product::query()
            ->active()
            ->featured()
            ->with(['category.parent', 'brand', 'images', 'variants'])
            ->ordered()
            ->offset($offset)
            ->limit($limit)
            ->get();

        $total = Product::query()
            ->active()
            ->featured()
            ->count();

        return response()->json([
            'products' => $featuredProducts->map(function ($product) {
                $minPrice = $product->getMinPriceAttribute();
                $maxPrice = $product->getMaxPriceAttribute();
                $originalPrice = $maxPrice ?? $minPrice;
                $discountPercent = $minPrice && $originalPrice > $minPrice
                    ? round((($originalPrice - $minPrice) / $originalPrice) * 100)
                    : null;

                return [
                    'id' => $product->id,
                    'title' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->breadcrumb_string,
                    'image' => $product->thumbnail ?? $product->images->first()?->url ?? '/uploads/products/placeholder.svg',
                    'price' => $minPrice ?? 0,
                    'originalPrice' => $originalPrice !== $minPrice ? $originalPrice : null,
                    'discountPercent' => $discountPercent,
                    'rating' => 4.5, // You can add a reviews relationship to get actual ratings
                    'reviewCount' => 128, // You can add a reviews relationship to get actual review counts
                ];
            }),
            'has_more' => ($offset + $limit) < $total,
            'total' => $total,
        ]);
    }
}
