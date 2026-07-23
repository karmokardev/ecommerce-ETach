<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    /**
     * Display the sales reports dashboard.
     */
    public function sales(Request $request)
    {
        $period = $request->input('period', 'monthly'); // daily, weekly, monthly, yearly

        // Get date range based on period
        $startDate = match($period) {
            'daily' => now()->startOfDay(),
            'weekly' => now()->startOfWeek(),
            'monthly' => now()->startOfMonth(),
            'yearly' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        $endDate = now();

        // Base query for the period
        $query = Order::whereBetween('created_at', [$startDate, $endDate]);

        // Calculate statistics
        $totalOrders = $query->count();
        $totalRevenue = $query->where('payment_status', 'paid')->sum('total');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Status breakdown
        $statusBreakdown = [
            'pending' => Order::whereBetween('created_at', [$startDate, $endDate])->where('status', 'pending')->count(),
            'processing' => Order::whereBetween('created_at', [$startDate, $endDate])->where('status', 'processing')->count(),
            'shipped' => Order::whereBetween('created_at', [$startDate, $endDate])->where('status', 'shipped')->count(),
            'delivered' => Order::whereBetween('created_at', [$startDate, $endDate])->where('status', 'delivered')->count(),
            'cancelled' => Order::whereBetween('created_at', [$startDate, $endDate])->where('status', 'cancelled')->count(),
        ];

        // Payment status breakdown
        $paymentStatusBreakdown = [
            'paid' => Order::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'paid')->count(),
            'pending' => Order::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'pending')->count(),
            'failed' => Order::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'failed')->count(),
            'refunded' => Order::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'refunded')->count(),
        ];

        // Daily/Weekly/Monthly data for charts
        $chartData = $this->getChartData($period, $startDate, $endDate);

        // Top selling products
        $topProducts = $this->getTopProducts($startDate, $endDate);

        // Recent orders
        $recentOrders = Order::with(['user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return inertia('admin/reports/sales', [
            'period' => $period,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'statistics' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'average_order_value' => $averageOrderValue,
                'status_breakdown' => $statusBreakdown,
                'payment_status_breakdown' => $paymentStatusBreakdown,
            ],
            'chartData' => $chartData,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Get chart data based on period.
     */
    private function getChartData(string $period, $startDate, $endDate): array
    {
        $data = [];

        if ($period === 'daily') {
            // Hourly data for today
            for ($i = 0; $i < 24; $i++) {
                $hourStart = $startDate->copy()->setHour($i)->startOfHour();
                $hourEnd = $hourStart->copy()->endOfHour();

                $orders = Order::whereBetween('created_at', [$hourStart, $hourEnd])->count();
                $revenue = Order::whereBetween('created_at', [$hourStart, $hourEnd])
                    ->where('payment_status', 'paid')
                    ->sum('total');

                $data[] = [
                    'label' => $i . ':00',
                    'orders' => $orders,
                    'revenue' => $revenue,
                ];
            }
        } elseif ($period === 'weekly') {
            // Daily data for this week
            for ($i = 0; $i < 7; $i++) {
                $dayStart = $startDate->copy()->addDays($i)->startOfDay();
                $dayEnd = $dayStart->copy()->endOfDay();

                $orders = Order::whereBetween('created_at', [$dayStart, $dayEnd])->count();
                $revenue = Order::whereBetween('created_at', [$dayStart, $dayEnd])
                    ->where('payment_status', 'paid')
                    ->sum('total');

                $data[] = [
                    'label' => $dayStart->format('D'),
                    'orders' => $orders,
                    'revenue' => $revenue,
                ];
            }
        } elseif ($period === 'monthly') {
            // Daily data for this month
            $daysInMonth = $startDate->daysInMonth;
            for ($i = 1; $i <= $daysInMonth; $i++) {
                $dayStart = $startDate->copy()->day($i)->startOfDay();
                $dayEnd = $dayStart->copy()->endOfDay();

                if ($dayStart->gt($endDate)) break;

                $orders = Order::whereBetween('created_at', [$dayStart, $dayEnd])->count();
                $revenue = Order::whereBetween('created_at', [$dayStart, $dayEnd])
                    ->where('payment_status', 'paid')
                    ->sum('total');

                $data[] = [
                    'label' => $i,
                    'orders' => $orders,
                    'revenue' => $revenue,
                ];
            }
        } elseif ($period === 'yearly') {
            // Monthly data for this year
            for ($i = 1; $i <= 12; $i++) {
                $monthStart = $startDate->copy()->month($i)->startOfMonth();
                $monthEnd = $monthStart->copy()->endOfMonth();

                if ($monthStart->gt($endDate)) break;

                $orders = Order::whereBetween('created_at', [$monthStart, $monthEnd])->count();
                $revenue = Order::whereBetween('created_at', [$monthStart, $monthEnd])
                    ->where('payment_status', 'paid')
                    ->sum('total');

                $data[] = [
                    'label' => $monthStart->format('M'),
                    'orders' => $orders,
                    'revenue' => $revenue,
                ];
            }
        }

        return $data;
    }

    /**
     * Get top selling products.
     */
    private function getTopProducts($startDate, $endDate): array
    {
        return \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.name',
                \DB::raw('COUNT(order_items.id) as total_orders'),
                \DB::raw('SUM(order_items.quantity) as total_quantity'),
                \DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.payment_status', 'paid')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_revenue', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'total_orders' => $item->total_orders,
                    'total_quantity' => $item->total_quantity,
                    'total_revenue' => $item->total_revenue,
                ];
            })
            ->toArray();
    }

    /**
     * Display the due sales reports dashboard.
     */
    public function due(Request $request)
    {
        $period = $request->input('period', 'monthly');

        $startDate = match($period) {
            'daily' => now()->startOfDay(),
            'weekly' => now()->startOfWeek(),
            'monthly' => now()->startOfMonth(),
            'yearly' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        $endDate = now();

        // Due statistics
        $totalDueCustomers = \App\Models\CustomerAccount::withDue()->count();
        $totalDueAmount = \App\Models\CustomerAccount::withDue()->sum('total_due');
        $totalCreditLimit = \App\Models\CustomerAccount::sum('credit_limit');

        // New due in period
        $newDueInPeriod = \App\Models\PosOrder::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', '!=', 'paid')
            ->sum('due_amount');

        // Collections in period
        $collectionsInPeriod = \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        // Top due customers
        $topDueCustomers = \App\Models\CustomerAccount::withDue()
            ->with('user')
            ->orderBy('total_due', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($account) {
                return [
                    'name' => $account->user->name,
                    'phone' => $account->user->phone,
                    'total_due' => $account->total_due,
                    'credit_limit' => $account->credit_limit,
                ];
            });

        return inertia('admin/reports/due', [
            'period' => $period,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'statistics' => [
                'total_due_customers' => $totalDueCustomers,
                'total_due_amount' => $totalDueAmount,
                'total_credit_limit' => $totalCreditLimit,
                'new_due_in_period' => $newDueInPeriod,
                'collections_in_period' => $collectionsInPeriod,
            ],
            'topDueCustomers' => $topDueCustomers,
        ]);
    }

    /**
     * Display the return reports dashboard.
     */
    public function returns(Request $request)
    {
        $period = $request->input('period', 'monthly');

        $startDate = match($period) {
            'daily' => now()->startOfDay(),
            'weekly' => now()->startOfWeek(),
            'monthly' => now()->startOfMonth(),
            'yearly' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        $endDate = now();

        // Return statistics
        $totalReturns = \App\Models\ProductReturn::whereBetween('created_at', [$startDate, $endDate])->count();
        $pendingReturns = \App\Models\ProductReturn::pending()->count();
        $approvedReturns = \App\Models\ProductReturn::where('status', 'approved')->count();
        $completedReturns = \App\Models\ProductReturn::where('status', 'completed')->count();
        $totalRefundAmount = \App\Models\ProductReturn::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('refund_amount');

        // Return type breakdown
        $returnTypeBreakdown = [
            'refund' => \App\Models\ProductReturn::whereBetween('created_at', [$startDate, $endDate])
                ->where('return_type', 'refund')->count(),
            'exchange' => \App\Models\ProductReturn::whereBetween('created_at', [$startDate, $endDate])
                ->where('return_type', 'exchange')->count(),
        ];

        // Recent returns
        $recentReturns = \App\Models\ProductReturn::with(['user', 'items'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return inertia('admin/reports/returns', [
            'period' => $period,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'statistics' => [
                'total_returns' => $totalReturns,
                'pending_returns' => $pendingReturns,
                'approved_returns' => $approvedReturns,
                'completed_returns' => $completedReturns,
                'total_refund_amount' => $totalRefundAmount,
                'return_type_breakdown' => $returnTypeBreakdown,
            ],
            'recentReturns' => $recentReturns,
        ]);
    }

    /**
     * Display the collection reports dashboard.
     */
    public function collections(Request $request)
    {
        $period = $request->input('period', 'monthly');

        $startDate = match($period) {
            'daily' => now()->startOfDay(),
            'weekly' => now()->startOfWeek(),
            'monthly' => now()->startOfMonth(),
            'yearly' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        $endDate = now();

        // Collection statistics
        $totalCollections = \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])->count();
        $totalCollectedAmount = \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        // Payment method breakdown
        $paymentMethodBreakdown = [
            'cash' => \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
                ->where('payment_method', 'cash')->count(),
            'card' => \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
                ->where('payment_method', 'card')->count(),
            'bkash' => \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
                ->where('payment_method', 'bkash')->count(),
            'nagad' => \App\Models\DueCollection::whereBetween('created_at', [$startDate, $endDate])
                ->where('payment_method', 'nagad')->count(),
        ];

        // Top collectors
        $topCollectors = \App\Models\DueCollection::with('collector')
            ->select('collected_by', \DB::raw('COUNT(*) as collection_count'), \DB::raw('SUM(amount) as total_collected'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('collected_by')
            ->orderBy('total_collected', 'desc')
            ->limit(10)
            ->get();

        // Recent collections
        $recentCollections = \App\Models\DueCollection::with(['user', 'collector'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return inertia('admin/reports/collections', [
            'period' => $period,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'statistics' => [
                'total_collections' => $totalCollections,
                'total_collected_amount' => $totalCollectedAmount,
                'payment_method_breakdown' => $paymentMethodBreakdown,
            ],
            'topCollectors' => $topCollectors,
            'recentCollections' => $recentCollections,
        ]);
    }
}
