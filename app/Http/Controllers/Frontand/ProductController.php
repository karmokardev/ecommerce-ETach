<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get all products for frontend
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'variants', 'images'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by featured
        if ($request->filled('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->get();

        $formattedProducts = $products->map(function ($product) {
            $primaryImage = $product->images->first()?->image ?? '/uploads/products/placeholder.svg';
            $firstVariant = $product->variants->first();
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $primaryImage,
                'price' => $firstVariant ? (float) $firstVariant->price : 0,
                'original_price' => $firstVariant && $firstVariant->compare_price ? (float) $firstVariant->compare_price : null,
                'product_variant_id' => $firstVariant?->id ?? null,
            ];
        });

        return response()->json($formattedProducts);
    }

    /**
     * Get latest products for home page
     */
    public function latest(): JsonResponse
    {
        $products = Product::with(['category', 'brand', 'variants', 'images'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(24)
            ->get();

        $formattedProducts = $products->map(function ($product) {
            $primaryImage = $product->images->first()?->image ?? '/uploads/products/placeholder.svg';
            $firstVariant = $product->variants->first();
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $primaryImage,
                'price' => $firstVariant ? (float) $firstVariant->price : 0,
                'original_price' => $firstVariant && $firstVariant->compare_price ? (float) $firstVariant->compare_price : null,
                'product_variant_id' => $firstVariant?->id ?? null,
            ];
        });

        return response()->json($formattedProducts);
    }

    /**
     * Get single product details
     */
    public function show($id): JsonResponse
    {
        $product = Product::with(['category', 'brand', 'variants', 'images', 'variants.attributeValues'])
            ->where('status', 'active')
            ->findOrFail($id);

        $primaryImage = $product->images->first()?->image ?? '/uploads/products/placeholder.svg';
        $firstVariant = $product->variants->first();

        $formattedProduct = [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'image' => $primaryImage,
            'images' => $product->images->map(fn($img) => $img->image),
            'price' => $firstVariant ? (float) $firstVariant->price : 0,
            'original_price' => $firstVariant && $firstVariant->compare_price ? (float) $firstVariant->compare_price : null,
            'category' => $product->category?->name,
            'brand' => $product->brand?->name,
            'variants' => $product->variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'price' => (float) $variant->price,
                    'stock' => $variant->current_stock,
                    'attributes' => $variant->attributeValues->map(fn($av) => [
                        'attribute' => $av->attribute->name,
                        'value' => $av->value,
                    ]),
                ];
            }),
        ];

        return response()->json($formattedProduct);
    }
}
