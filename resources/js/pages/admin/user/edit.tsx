import { Head, useForm, router } from '@inertiajs/react';
import { User } from '@/types';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { toast } from 'sonner';

interface EditUserProps {
    user: User;
    roles: any[];
}

export default function EditUser({ user, roles }: EditUserProps) {
    const { data, setData, put, processing, errors } = useForm({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || 'active',
        roles: user.roles?.map((role: any) => role.id) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`, {
            onSuccess: () => {
                toast.success('User updated successfully');
            },
            onError: () => {
                toast.error('Failed to update user');
            },
        });
    };

    return (
        <>
            <Head title="Edit User" />
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Edit User</h1>
                        {/* <AppearanceToggleTab /> */}
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Roles
                                    </label>
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.roles.includes(role.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData('roles', [...data.roles, role.id]);
                                                        } else {
                                                            setData('roles', data.roles.filter((id: number) => id !== role.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-neutral-700 rounded focus:ring-blue-500 bg-white dark:bg-neutral-800"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.roles && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </button>
                                    <a
                                        href="/users"
                                        className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                                    >
                                        Cancel
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
