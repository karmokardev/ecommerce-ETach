import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateFlashSale() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
        priority: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post('/flash-sales', {
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            priority: parseInt(String(formData.priority)),
        }, {
            onSuccess: () => {
                toast.success('Flash sale created successfully');
            },
            onError: () => {
                toast.error('Failed to create flash sale');
            },
        });
    };

    return (
        <>
            <Head title="Create Flash Sale" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create Flash Sale</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create a new time-limited flash sale</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Flash Sale Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="Summer Flash Sale"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Type *
                                </label>
                                <select
                                    value={formData.discount_type}
                                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    required
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Value *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.discount_value}
                                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder={formData.discount_type === 'percentage' ? '20' : '100'}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.discount_type === 'percentage' ? 'Percentage discount (e.g., 20 for 20%)' : 'Fixed amount (e.g., 100 for $100)'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Priority
                                </label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="0"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Higher priority flash sales appear first
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Start Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.starts_at}
                                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    End Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.ends_at}
                                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                placeholder="Flash sale description..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Active
                            </label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.get('/flash-sales')}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Flash Sale
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
