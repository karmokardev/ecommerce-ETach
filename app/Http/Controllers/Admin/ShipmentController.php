<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use App\Models\ShippingMethod;
use App\Models\ShippingZone;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    /**
     * Display a listing of shipments.
     */
    public function index(Request $request)
    {
        $query = Shipment::with(['order', 'shippingMethod', 'shippingZone']);

        // Search by tracking number
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by courier
        if ($request->filled('courier')) {
            $query->byCourier($request->courier);
        }

        $shipments = $query->orderBy('created_at', 'desc')->paginate(20);

        return inertia('admin/shipping/shipments/index', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'courier' => $request->courier ?? 'all',
            ],
        ]);
    }

    /**
     * Display the specified shipment.
     */
    public function show(Shipment $shipment)
    {
        $shipment->load(['order', 'shippingMethod', 'shippingZone']);

        return inertia('admin/shipping/shipments/show', [
            'shipment' => $shipment,
        ]);
    }

    /**
     * Create shipment for an order.
     */
    public function create(Request $request)
    {
        $orderId = $request->input('order_id');
        $order = Order::with(['items'])->findOrFail($orderId);

        $shippingMethods = ShippingMethod::active()->ordered()->get();
        $shippingZones = ShippingZone::active()->orderBy('name')->get();

        return inertia('admin/shipping/shipments/create', [
            'order' => $order,
            'shippingMethods' => $shippingMethods,
            'shippingZones' => $shippingZones,
        ]);
    }

    /**
     * Store a newly created shipment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'shipping_method_id' => ['nullable', 'exists:shipping_methods,id'],
            'shipping_zone_id' => ['nullable', 'exists:shipping_zones,id'],
            'courier' => ['required', 'in:pathao,redx,steadfast,sundarban,custom'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:20'],
            'shipping_address' => ['required', 'string'],
            'pickup_address' => ['nullable', 'string'],
            'weight' => ['required', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'package_type' => ['required', 'in:standard,express,fragile'],
            'notes' => ['nullable', 'string'],
            'shipping_cost' => ['required', 'numeric', 'min:0'],
        ]);

        try {
            $order = Order::find($validated['order_id']);

            $shipment = Shipment::create([
                'order_id' => $validated['order_id'],
                'shipping_method_id' => $validated['shipping_method_id'],
                'shipping_zone_id' => $validated['shipping_zone_id'],
                'courier' => $validated['courier'],
                'recipient_name' => $validated['recipient_name'],
                'recipient_phone' => $validated['recipient_phone'],
                'shipping_address' => $validated['shipping_address'],
                'pickup_address' => $validated['pickup_address'],
                'weight' => $validated['weight'],
                'length' => $validated['length'],
                'width' => $validated['width'],
                'height' => $validated['height'],
                'package_type' => $validated['package_type'],
                'notes' => $validated['notes'],
                'shipping_cost' => $validated['shipping_cost'],
                'estimated_delivery_at' => now()->addDays(3),
            ]);

            // Update order with shipping method and zone
            $order->update([
                'shipping_method_id' => $validated['shipping_method_id'],
                'shipping_zone_id' => $validated['shipping_zone_id'],
                'shipping_cost' => $validated['shipping_cost'],
            ]);

            // Integrate with courier API if not custom
            if ($validated['courier'] !== 'custom' && $shipment->shippingMethod) {
                $service = $shipment->shippingMethod->courier_service;
                if ($service && $service->validateCredentials()) {
                    $courierData = $service->createShipment([
                        'order_id' => $order->order_no,
                        'recipient_name' => $validated['recipient_name'],
                        'recipient_phone' => $validated['recipient_phone'],
                        'shipping_address' => $validated['shipping_address'],
                        'weight' => $validated['weight'],
                        'cod_amount' => $order->payment_method === 'cash' ? $order->total : 0,
                        'item_description' => 'Order ' . $order->order_no,
                    ]);

                    if ($courierData) {
                        $shipment->update([
                            'tracking_number' => $courierData['tracking_number'] ?? $shipment->tracking_number,
                            'tracking_url' => $courierData['tracking_url'] ?? null,
                            'courier_response' => $courierData,
                        ]);
                    }
                }
            }

            return redirect()
                ->route('shipments.show', $shipment)
                ->with('success', 'Shipment created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to create shipment: ' . $e->getMessage());
        }
    }

    /**
     * Update shipment status.
     */
    public function updateStatus(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,picked_up,in_transit,out_for_delivery,delivered,failed,returned'],
            'reason' => ['nullable', 'string'],
        ]);

        try {
            switch ($validated['status']) {
                case 'picked_up':
                    $shipment->markAsPickedUp();
                    break;
                case 'in_transit':
                    $shipment->markAsInTransit();
                    break;
                case 'out_for_delivery':
                    $shipment->markAsOutForDelivery();
                    break;
                case 'delivered':
                    $shipment->markAsDelivered();
                    // Update order status
                    $shipment->order->update(['status' => 'delivered']);
                    break;
                case 'failed':
                    $shipment->markAsFailed($validated['reason'] ?? 'Unknown reason');
                    break;
                case 'returned':
                    $shipment->markAsReturned($validated['reason'] ?? 'Unknown reason');
                    break;
            }

            return back()->with('success', 'Shipment status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update shipment status: ' . $e->getMessage());
        }
    }

    /**
     * Sync shipment with courier API.
     */
    public function syncWithCourier(Shipment $shipment)
    {
        try {
            $success = $shipment->syncWithCourier();

            if ($success) {
                return back()->with('success', 'Shipment synced with courier successfully.');
            }

            return back()->with('error', 'Failed to sync shipment with courier.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to sync shipment: ' . $e->getMessage());
        }
    }

    /**
     * Track shipment by tracking number.
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_number' => ['required', 'string'],
        ]);

        $shipment = Shipment::where('tracking_number', $validated['tracking_number'])->first();

        if (!$shipment) {
            return response()->json(['error' => 'Shipment not found'], 404);
        }

        // Sync with courier if applicable
        if ($shipment->courier !== 'custom') {
            $shipment->syncWithCourier();
        }

        return response()->json([
            'shipment' => $shipment->load('order'),
            'tracking_history' => $shipment->tracking_history,
        ]);
    }

    /**
     * Get shipment statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_shipments' => Shipment::count(),
            'pending_shipments' => Shipment::pending()->count(),
            'in_transit_shipments' => Shipment::inTransit()->count(),
            'delivered_shipments' => Shipment::delivered()->count(),
            'today_shipments' => Shipment::whereDate('created_at', today())->count(),
        ];

        return response()->json($stats);
    }
}
