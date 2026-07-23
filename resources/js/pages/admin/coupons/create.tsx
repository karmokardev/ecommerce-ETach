import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateCoupon() {
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        minimum_order_amount: '',
        maximum_discount_amount: '',
        usage_limit: '',
        per_user_limit: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post('/coupons', {
            ...formData,
            value: parseFloat(formData.value),
            minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : null,
            maximum_discount_amount: formData.maximum_discount_amount ? parseFloat(formData.maximum_discount_amount) : null,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            per_user_limit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null,
            starts_at: formData.starts_at || null,
            expires_at: formData.expires_at || null,
        }, {
            onSuccess: () => {
                toast.success('Coupon created successfully');
            },
            onError: () => {
                toast.error('Failed to create coupon');
            },
        });
    };

    return (
        <>
            <Head title="Create Coupon" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create Coupon</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create a new discount coupon</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Coupon Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="SUMMER2024"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
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
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder={formData.type === 'percentage' ? '10' : '100'}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.type === 'percentage' ? 'Percentage discount (e.g., 10 for 10%)' : 'Fixed amount (e.g., 100 for $100)'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minimum Order Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.minimum_order_amount}
                                    onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Maximum Discount Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.maximum_discount_amount}
                                    onChange={(e) => setFormData({ ...formData, maximum_discount_amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Usage Limit
                                </label>
                                <input
                                    type="number"
                                    value={formData.usage_limit}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="Unlimited"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Per User Limit
                                </label>
                                <input
                                    type="number"
                                    value={formData.per_user_limit}
                                    onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="Unlimited"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.starts_at}
                                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Expiration Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
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
                                placeholder="Coupon description..."
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
                                onClick={() => router.get('/coupons')}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Coupon
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
