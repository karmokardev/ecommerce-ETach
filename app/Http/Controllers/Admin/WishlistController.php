<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Wishlist::with(['user', 'product', 'variant'])->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 10);

        // Search by user name or product name
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', "%{$request->search}%");
                })
                ->orWhereHas('product', function ($productQuery) use ($request) {
                    $productQuery->where('name', 'like', "%{$request->search}%");
                });
            });
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $wishlists = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/wishlist/index', [
            'wishlists' => $wishlists,
            'filters' => $request->only(['search', 'user_id', 'product_id', 'per_page']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Wishlist $wishlist)
    {
        $wishlist->load(['user', 'product', 'variant', 'product.category', 'product.brand', 'product.images']);

        return inertia('admin/wishlist/show', [
            'wishlist' => $wishlist,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wishlist $wishlist)
    {
        $wishlist->delete();

        return redirect()->back()->with('success', 'Wishlist item deleted successfully.');
    }

    /**
     * Bulk delete wishlist items.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:wishlists,id',
        ]);

        Wishlist::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Wishlist items deleted successfully.');
    }

    /**
     * Get wishlist statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Wishlist::count(),
            'unique_users' => Wishlist::distinct('user_id')->count(),
            'unique_products' => Wishlist::distinct('product_id')->count(),
            'with_variants' => Wishlist::whereNotNull('product_variant_id')->count(),
        ];

        return response()->json($stats);
    }
}
