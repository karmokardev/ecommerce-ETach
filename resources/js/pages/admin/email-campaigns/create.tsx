import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateEmailCampaign() {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
        type: 'promotional' as 'order_confirmation' | 'promotional' | 'newsletter' | 'abandoned_cart',
        status: 'draft' as 'draft' | 'scheduled',
        scheduled_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post('/email-campaigns', {
            ...formData,
            scheduled_at: formData.scheduled_at || null,
        }, {
            onSuccess: () => {
                toast.success('Email campaign created successfully');
            },
            onError: () => {
                toast.error('Failed to create email campaign');
            },
        });
    };

    return (
        <>
            <Head title="Create Email Campaign" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create Email Campaign</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create a new email marketing campaign</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Campaign Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="Summer Sale Campaign"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Campaign Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'order_confirmation' | 'promotional' | 'newsletter' | 'abandoned_cart' })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    required
                                >
                                    <option value="order_confirmation">Order Confirmation</option>
                                    <option value="promotional">Promotional</option>
                                    <option value="newsletter">Newsletter</option>
                                    <option value="abandoned_cart">Abandoned Cart</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Subject *
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    placeholder="Don't miss our summer sale!"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'scheduled' })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Schedule For
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.scheduled_at}
                                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                    disabled={formData.status === 'draft'}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Required when status is "Scheduled"
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Content *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
                                placeholder="Write your email content here..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.get('/email-campaigns')}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Campaign
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
