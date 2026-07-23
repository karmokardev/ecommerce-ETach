<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    /**
     * Display a listing of product reviews.
     */
    public function index(Request $request)
    {
        $query = ProductReview::query()->with('user', 'product');

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%")
                ->orWhere('review', 'like', "%{$request->search}%");
        }

        if ($request->status === 'approved') {
            $query->approved();
        } elseif ($request->status === 'pending') {
            $query->pending();
        }

        if ($request->rating) {
            $query->where('rating', $request->rating);
        }

        $reviews = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'status', 'rating']),
        ]);
    }

    /**
     * Display the specified product review.
     */
    public function show(ProductReview $review)
    {
        $review->load('user', 'product', 'order');

        return Inertia::render('admin/reviews/show', [
            'review' => $review,
        ]);
    }

    /**
     * Approve the specified review.
     */
    public function approve(ProductReview $review)
    {
        $review->update(['is_approved' => true]);

        return back()->with('success', 'Review approved successfully.');
    }

    /**
     * Reject the specified review.
     */
    public function reject(ProductReview $review)
    {
        $review->update(['is_approved' => false]);

        return back()->with('success', 'Review rejected successfully.');
    }

    /**
     * Remove the specified review.
     */
    public function destroy(ProductReview $review)
    {
        $review->delete();

        return redirect()->route('reviews.index')->with('success', 'Review deleted successfully.');
    }

    /**
     * Mark review as helpful.
     */
    public function markHelpful(ProductReview $review)
    {
        $review->markHelpful();

        return back()->with('success', 'Review marked as helpful.');
    }
}
