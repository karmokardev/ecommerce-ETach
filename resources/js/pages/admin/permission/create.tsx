import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function CreatePermission() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permissions', {
            onSuccess: () => {
                toast.success('Permission created successfully');
            },
            onError: () => {
                toast.error('Failed to create permission');
            },
        });
    };

    return (
        <>
            <Head title="Create Permission" />
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Permission</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Permission Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., edit users, view posts"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Creating...' : 'Create Permission'}
                                    </button>
                                    <a
                                        href="/permissions"
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
