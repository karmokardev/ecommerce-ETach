<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderReturn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = OrderReturn::with(['order', 'orderItem', 'user'])->ordered();
        $perPage = (int) $request->input('per_page', 10);

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by refund status
        if ($request->filled('refund_status') && $request->refund_status !== 'all') {
            $query->where('refund_status', $request->refund_status);
        }

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('requested_date', [$request->date_from, $request->date_to]);
        }

        $returns = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return inertia('admin/order-return/index', [
            'returns' => $returns,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'refund_status' => $request->refund_status ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'per_page' => $perPage,
                'page' => $returns->currentPage(),
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderReturn $return)
    {
        $return->load(['order', 'orderItem', 'orderItem.product', 'orderItem.variant', 'user']);

        return inertia('admin/order-return/show', [
            'return' => $return,
        ]);
    }

    /**
     * Approve a return request.
     */
    public function approve(Request $request, OrderReturn $return)
    {
        if (!$return->canBeApproved()) {
            return back()->with('error', 'This return cannot be approved.');
        }

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string'],
            'refund_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        try {
            $return->approve();
            
            if (isset($validated['admin_notes'])) {
                $return->admin_notes = strip_tags($validated['admin_notes']);
            }
            
            if (isset($validated['refund_amount'])) {
                $return->refund_amount = $validated['refund_amount'];
                $return->refund_status = 'approved';
            }
            
            $return->save();

            return back()->with('success', 'Return request approved successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve return: ' . $e->getMessage());
        }
    }

    /**
     * Reject a return request.
     */
    public function reject(Request $request, OrderReturn $return)
    {
        if (!$return->canBeRejected()) {
            return back()->with('error', 'This return cannot be rejected.');
        }

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string'],
        ]);

        try {
            $return->reject();
            
            if (isset($validated['admin_notes'])) {
                $return->admin_notes = strip_tags($validated['admin_notes']);
            }
            
            $return->refund_status = 'rejected';
            $return->save();

            return back()->with('success', 'Return request rejected successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reject return: ' . $e->getMessage());
        }
    }

    /**
     * Complete a return (process refund).
     */
    public function complete(Request $request, OrderReturn $return)
    {
        if (!$return->canBeCompleted()) {
            return back()->with('error', 'This return cannot be completed.');
        }

        $validated = $request->validate([
            'refund_amount' => ['required', 'numeric', 'min:0'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        try {
            $return->refund_amount = $validated['refund_amount'];
            $return->complete();
            
            if (isset($validated['admin_notes'])) {
                $return->admin_notes = strip_tags($validated['admin_notes']);
            }
            
            $return->save();

            return back()->with('success', 'Return completed and refund processed successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to complete return: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderReturn $return)
    {
        try {
            $return->delete();

            return back()->with('success', 'Return deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete return: ' . $e->getMessage());
        }
    }
}
