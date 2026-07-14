import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface CreateRoleProps {
    permissions: Permission[];
}

export default function CreateRole({ permissions }: CreateRoleProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const handlePermissionToggle = (permissionId: number) => {
        if (data.permissions.includes(permissionId)) {
            setData('permissions', data.permissions.filter((id) => id !== permissionId));
        } else {
            setData('permissions', [...data.permissions, permissionId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles', {
            onSuccess: () => {
                toast.success('Role created successfully');
            },
            onError: () => {
                toast.error('Failed to create role');
            },
        });
    };

    return (
        <>
            <Head title="Create Role" />
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Role</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., editor, moderator"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Permissions
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-300 dark:border-neutral-700 rounded-lg p-3">
                                        {permissions && permissions.length > 0 ? (
                                            permissions.map((permission) => (
                                                <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.permissions.includes(permission.id)}
                                                        onChange={() => handlePermissionToggle(permission.id)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No permissions available</p>
                                        )}
                                    </div>
                                    {errors.permissions && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Creating...' : 'Create Role'}
                                    </button>
                                    <a
                                        href="/roles"
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
