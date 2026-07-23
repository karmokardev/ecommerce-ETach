<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use App\Models\DueCollection;
use App\Models\Order;
use App\Models\ProductReturn;
use App\Models\PosOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $today = now()->startOfDay();
            
            // POS Statistics
            $todayPosSales = PosOrder::whereDate('created_at', '>=', $today)->get();
            $posStats = [
                'today_orders' => $todayPosSales->count(),
                'today_sales' => $todayPosSales->sum('total'),
                'today_paid' => $todayPosSales->sum('paid_amount'),
                'today_due' => $todayPosSales->sum('due_amount'),
            ];

            // Online Order Statistics
            $todayOnlineOrders = Order::whereDate('created_at', '>=', $today)->get();
            $onlineStats = [
                'today_orders' => $todayOnlineOrders->count(),
                'today_sales' => $todayOnlineOrders->where('payment_status', 'paid')->sum('total'),
            ];

            // Return Statistics
            $returnStats = [
                'pending_returns' => ProductReturn::pending()->count(),
                'today_returns' => ProductReturn::whereDate('created_at', '>=', $today)->count(),
                'total_refund_amount' => ProductReturn::where('status', 'completed')->sum('refund_amount'),
            ];

            // Due Sales Statistics
            $dueStats = [
                'total_due_customers' => CustomerAccount::withDue()->count(),
                'total_due_amount' => CustomerAccount::withDue()->sum('total_due'),
                'today_collections' => DueCollection::whereDate('created_at', '>=', $today)->count(),
                'today_collected_amount' => DueCollection::whereDate('created_at', '>=', $today)->sum('amount'),
            ];

            return inertia('dashboard', [
                'user' => $user,
                'role' => 'admin',
                'users' => User::with('roles')->get(),
                'stats' => [
                    'admin' => User::role('admin')->count(),
                    'user' => User::role('user')->count(),
                    'pos' => $posStats,
                    'online' => $onlineStats,
                    'returns' => $returnStats,
                    'due' => $dueStats,
                ]
            ]);
        }

        // Default for regular users
        return inertia('dashboard', [
            'user' => $user,
            'role' => 'user',
        ]);
    }

    public function users()
    {
        $users = User::with('roles')->get();

        return inertia('users', [
            'users' => $users,
        ]);
    }
}
