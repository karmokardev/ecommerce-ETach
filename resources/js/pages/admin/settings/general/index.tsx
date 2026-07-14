import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Setting {
    key: string;
    value: string;
    type: string;
    status: string;
}

interface SettingsProps {
    settings: Record<string, Setting>;
}

export default function SiteSettingsIndex({ settings }: SettingsProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        key: '',
        value: '',
        type: 'text',
        status: 'active',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/general', {
            onSuccess: () => {
                toast.success('Setting created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create setting');
            },
        });
    };

    const handleDelete = (key: string) => {
        if (confirm(`Are you sure you want to delete "${key}"?`)) {
            router.delete(`/admin/settings/general/${key}`, {
                onSuccess: () => {
                    toast.success('Setting deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete setting');
                },
            });
        }
    };

    const handleUpdate = (key: string, value: string) => {
        router.put(`/admin/settings/general/${key}`, { value }, {
            onSuccess: () => {
                toast.success('Setting updated successfully');
            },
            onError: () => {
                toast.error('Failed to update setting');
            },
        });
    };

    const settingsArray = Object.entries(settings).map(([key, setting]) => ({ 
        key, 
        value: setting.value, 
        type: setting.type,
        status: setting.status 
    }));

    // Filter settings based on search query
    const filteredSettings = settingsArray.filter(setting => 
        setting.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        setting.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSettings = filteredSettings.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="General Settings" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">General Settings</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Create New Setting Form */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Setting</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="key" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Key
                                        </label>
                                        <input
                                            type="text"
                                            id="key"
                                            value={data.key}
                                            onChange={(e) => setData('key', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., site_name"
                                            required
                                        />
                                        {errors.key && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.key}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Type
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="json">JSON</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="image">Image</option>
                                            <option value="file">File</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="value" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Value
                                        </label>
                                        <textarea
                                            id="value"
                                            value={data.value}
                                            onChange={(e) => setData('value', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all resize-none"
                                            placeholder="Enter value"
                                            required
                                        />
                                        {errors.value && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.value}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {processing ? 'Creating...' : 'Create Setting'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Settings List */}
                        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                        <Edit2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Settings</h2>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredSettings.length} {filteredSettings.length === 1 ? 'setting' : 'settings'}
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search settings..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredSettings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                            <Edit2 className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400">No settings found</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first setting</p>
                                    </div>
                                ) : (
                                    paginatedSettings.map(({ key, value, type, status }) => (
                                        <div
                                            key={key}
                                            className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all hover:border-gray-200 dark:hover:border-neutral-700"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{key}</p>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        status === 'active' 
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{value}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        const newValue = prompt('Enter new value:', value);
                                                        if (newValue !== null) {
                                                            handleUpdate(key, newValue);
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(key)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredSettings.length)} of {filteredSettings.length} settings
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                                                        currentPage === page
                                                            ? 'bg-green-500 text-white'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
