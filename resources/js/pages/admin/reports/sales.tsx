import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Statistics {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    status_breakdown: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    payment_status_breakdown: {
        paid: number;
        pending: number;
        failed: number;
        refunded: number;
    };
}

interface ChartData {
    label: string;
    orders: number;
    revenue: number;
}

interface TopProduct {
    name: string;
    total_orders: number;
    total_quantity: number;
    total_revenue: number;
}

interface RecentOrder {
    id: number;
    order_no: string;
    customer_name: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
}

interface SalesReportsProps {
    period: string;
    startDate: string;
    endDate: string;
    statistics: Statistics;
    chartData: ChartData[];
    topProducts: TopProduct[];
    recentOrders: RecentOrder[];
}

export default function SalesReports({ period, startDate, endDate, statistics, chartData, topProducts, recentOrders }: SalesReportsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        router.get('/reports/sales', { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPaymentStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const maxOrders = Math.max(...chartData.map(d => d.orders), 1);
    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

    return (
        <>
            <Head title="Sales Reports" />
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Sales Reports</h1>
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                            >
                                <option value="daily">Today</option>
                                <option value="weekly">This Week</option>
                                <option value="monthly">This Month</option>
                                <option value="yearly">This Year</option>
                            </select>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.total_orders}</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Revenue</h3>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">${Number(statistics.total_revenue).toFixed(2)}</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average Order Value</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${Number(statistics.average_order_value).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Status Breakdown */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Order Status Breakdown</h3>
                            <div className="space-y-3">
                                {Object.entries(statistics.status_breakdown).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(status)}`}>
                                                {status}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Status Breakdown */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Payment Status Breakdown</h3>
                            <div className="space-y-3">
                                {Object.entries(statistics.payment_status_breakdown).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeColor(status)}`}>
                                                {status}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Orders Over Time</h3>
                        <div className="h-64">
                            <div className="flex items-end justify-between h-full gap-2">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full flex flex-col gap-1">
                                            <div
                                                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all hover:bg-blue-600 dark:hover:bg-blue-500"
                                                style={{ height: `${(data.orders / maxOrders) * 100}%` }}
                                                title={`Orders: ${data.orders}`}
                                            />
                                            <div
                                                className="w-full bg-green-500 dark:bg-green-600 rounded-b transition-all hover:bg-green-600 dark:hover:bg-green-500"
                                                style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                                title={`Revenue: $${data.revenue.toFixed(2)}`}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                            {data.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Top Products */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Top Selling Products</h3>
                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {product.total_orders} orders • {product.total_quantity} units
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    ${Number(product.total_revenue).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Orders</h3>
                            {recentOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.order_no}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    ${Number(order.total).toFixed(2)}
                                                </p>
                                                <div className="flex gap-1 justify-end">
                                                    <span className={`px-1 py-0.5 text-xs rounded ${getStatusBadgeColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No orders found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
