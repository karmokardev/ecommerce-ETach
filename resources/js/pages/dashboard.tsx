import { Head } from '@inertiajs/react';
import { User } from '@/types';
import { Link } from '@inertiajs/react';

interface DashboardProps {
    user: User;
    role: string;
    stats?: {
        admin: number;
        user: number;
    };
}

export default function Dashboard({ user, role, stats }: DashboardProps) {
    const isAdmin = role === 'admin';

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                {isAdmin && (
                    <>
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <Link
                                href="/users"
                                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Manage Users</h3>
                                <p className="text-sm text-gray-500">View and manage all users</p>
                            </Link>
                            <Link
                                href="/roles"
                                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Manage Roles</h3>
                                <p className="text-sm text-gray-500">Create and manage roles and permissions</p>
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold text-gray-700">Total Admins</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats?.admin || 0}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                                <p className="text-3xl font-bold text-primary">{stats?.user || 0}</p>
                            </div>
                        </div>
                    </>
                )}

                {!isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Welcome, {String(user.name || 'User')}!</h2>
                        <p className="text-gray-600">You are logged in as a regular user.</p>
                    </div>
                )}
            </div>
        </>
    );
}
