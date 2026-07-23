import { Head } from '@inertiajs/react';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    ShoppingCart, 
    DollarSign, 
    Users, 
    Package, 
    ArrowUpRight, 
    ArrowDownRight,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    CreditCard,
    RefreshCw
} from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';

interface DashboardProps {
    user: User;
    role: string;
    stats?: {
        admin: number;
        user: number;
        pos?: {
            today_orders: number;
            today_sales: number;
            today_paid: number;
            today_due: number;
        };
        online?: {
            today_orders: number;
            today_sales: number;
        };
        returns?: {
            pending_returns: number;
            today_returns: number;
            total_refund_amount: number;
        };
        due?: {
            total_due_customers: number;
            total_due_amount: number;
            today_collections: number;
            today_collected_amount: number;
        };
    };
}

export default function Dashboard({ user, role, stats }: DashboardProps) {
    const isAdmin = role === 'admin';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const StatCard = ({ 
        title, 
        value, 
        icon: Icon, 
        trend, 
        trendValue, 
        color = 'blue',
        subtitle 
    }: { 
        title: string; 
        value: string | number; 
        icon: any; 
        trend?: 'up' | 'down'; 
        trendValue?: string;
        color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
        subtitle?: string;
    }) => {
        const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800',
            green: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900 dark:text-green-400 dark:border-green-800',
            purple: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900 dark:text-purple-400 dark:border-purple-800',
            orange: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900 dark:text-orange-400 dark:border-orange-800',
            red: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900 dark:text-red-400 dark:border-red-800',
        };

        return (
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border- dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
                        {subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                        )}
                        {trend && trendValue && (
                            <div className={`flex items-center mt-2 text-sm ${
                                trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                                {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                {trendValue}
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };

    const ActivityItem = ({ 
        icon: Icon, 
        title, 
        description, 
        time, 
        color = 'blue' 
    }: { 
        icon: any; 
        title: string; 
        description: string; 
        time: string;
        color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    }) => {
        const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
            red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
        };

        return (
            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${colorClasses[color]} flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
                </div>
                <div className="flex-shrink-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Welcome back, {String(user.name || 'User')}! Here's what's happening today.
                            </p>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <>
                        {/* Quick Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Sales Today"
                                value={formatCurrency((stats?.pos?.today_sales || 0) + (stats?.online?.today_sales || 0))}
                                icon={DollarSign}
                                color="green"
                                subtitle="POS + Online"
                            />
                            <StatCard
                                title="Total Orders Today"
                                value={(stats?.pos?.today_orders || 0) + (stats?.online?.today_orders || 0)}
                                icon={ShoppingCart}
                                color="blue"
                                subtitle="All channels"
                            />
                            <StatCard
                                title="Total Users"
                                value={stats?.user || 0}
                                icon={Users}
                                color="purple"
                                subtitle={`${stats?.admin || 0} admins`}
                            />
                            <StatCard
                                title="Pending Returns"
                                value={stats?.returns?.pending_returns || 0}
                                icon={RefreshCw}
                                color="orange"
                                subtitle={`${stats?.returns?.today_returns || 0} today`}
                            />
                        </div>

                        {/* Detailed Statistics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* POS Statistics */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border- dark:border-neutral-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">POS Sales</h2>
                                    <div className="flex items-center text-green-600 text-sm font-medium">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        Live
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        title="Today's Orders"
                                        value={stats?.pos?.today_orders || 0}
                                        icon={ShoppingCart}
                                        color="blue"
                                    />
                                    <StatCard
                                        title="Today's Sales"
                                        value={formatCurrency(stats?.pos?.today_sales || 0)}
                                        icon={DollarSign}
                                        color="green"
                                    />
                                    <StatCard
                                        title="Paid Amount"
                                        value={formatCurrency(stats?.pos?.today_paid || 0)}
                                        icon={CheckCircle}
                                        color="green"
                                    />
                                    <StatCard
                                        title="Due Amount"
                                        value={formatCurrency(stats?.pos?.today_due || 0)}
                                        icon={Clock}
                                        color="orange"
                                    />
                                </div>
                            </div>

                            {/* Online Orders Statistics */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Online Orders</h2>
                                    <div className="flex items-center text-green-600 text-sm font-medium">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        Live
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        title="Today's Orders"
                                        value={stats?.online?.today_orders || 0}
                                        icon={ShoppingCart}
                                        color="blue"
                                    />
                                    <StatCard
                                        title="Today's Sales"
                                        value={formatCurrency(stats?.online?.today_sales || 0)}
                                        icon={DollarSign}
                                        color="green"
                                    />
                                </div>
                            </div>

                            {/* Returns Statistics */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Returns & Refunds</h2>
                                    <div className={`flex items-center text-sm font-medium ${
                                        (stats?.returns?.pending_returns || 0) > 0 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                        {(stats?.returns?.pending_returns || 0) > 0 ? (
                                            <><AlertCircle className="w-4 h-4 mr-1" />Attention</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4 mr-1" />All Clear</>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        title="Pending Returns"
                                        value={stats?.returns?.pending_returns || 0}
                                        icon={AlertCircle}
                                        color="orange"
                                    />
                                    <StatCard
                                        title="Today's Returns"
                                        value={stats?.returns?.today_returns || 0}
                                        icon={RefreshCw}
                                        color="purple"
                                    />
                                    <StatCard
                                        title="Total Refunded"
                                        value={formatCurrency(stats?.returns?.total_refund_amount || 0)}
                                        icon={DollarSign}
                                        color="green"
                                        subtitle="Completed"
                                    />
                                </div>
                            </div>

                            {/* Due Sales Statistics */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Due Sales</h2>
                                    <div className={`flex items-center text-sm font-medium ${
                                        (stats?.due?.total_due_customers || 0) > 0 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                        {(stats?.due?.total_due_customers || 0) > 0 ? (
                                            <><AlertCircle className="w-4 h-4 mr-1" />Action Needed</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4 mr-1" />All Paid</>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        title="Due Customers"
                                        value={stats?.due?.total_due_customers || 0}
                                        icon={Users}
                                        color="orange"
                                    />
                                    <StatCard
                                        title="Total Due Amount"
                                        value={formatCurrency(stats?.due?.total_due_amount || 0)}
                                        icon={DollarSign}
                                        color="red"
                                    />
                                    <StatCard
                                        title="Today's Collections"
                                        value={stats?.due?.today_collections || 0}
                                        icon={CreditCard}
                                        color="green"
                                    />
                                    <StatCard
                                        title="Collected Amount"
                                        value={formatCurrency(stats?.due?.today_collected_amount || 0)}
                                        icon={CheckCircle}
                                        color="green"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/admin/customers"
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Customers</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage customer accounts</p>
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                                            <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Products</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage inventory</p>
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                                            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Orders</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">View and manage orders</p>
                                </Link>
                                <Link
                                    href="/admin/pos"
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                                            <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">POS</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Point of Sale</p>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                                <Link href="/admin/activity" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-2">
                                <ActivityItem
                                    icon={ShoppingCart}
                                    title="New POS Order"
                                    description="Order #12345 created - $150.00"
                                    time="2 minutes ago"
                                    color="blue"
                                />
                                <ActivityItem
                                    icon={CheckCircle}
                                    title="Payment Collected"
                                    description="Due collection from customer John Doe - $75.00"
                                    time="15 minutes ago"
                                    color="green"
                                />
                                <ActivityItem
                                    icon={RefreshCw}
                                    title="Return Requested"
                                    description="Product return requested for Order #12340"
                                    time="1 hour ago"
                                    color="orange"
                                />
                                <ActivityItem
                                    icon={Users}
                                    title="New Customer Registered"
                                    description="Jane Smith created a new account"
                                    time="2 hours ago"
                                    color="purple"
                                />
                                <ActivityItem
                                    icon={DollarSign}
                                    title="Online Order Placed"
                                    description="Order #12344 placed online - $299.99"
                                    time="3 hours ago"
                                    color="green"
                                />
                            </div>
                        </div>
                    </>
                )}

                {!isAdmin && (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {String(user.name || 'User')}!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">You are logged in as a regular user. Start shopping to see your order history and account details.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
