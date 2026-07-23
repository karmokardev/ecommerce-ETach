import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'sonner';

interface ShippingMethod {
    id: number;
    name: string;
    description: string | null;
    courier: string;
    base_cost: number;
    cost_per_weight: number;
    cost_per_item: number;
    min_order_amount: number | null;
    max_order_amount: number | null;
    estimated_delivery_days: number;
    is_active: boolean;
    sort_order: number;
    settings: Record<string, string> | null;
}

interface EditShippingMethodProps {
    method: ShippingMethod;
}

export default function EditShippingMethod({ method }: EditShippingMethodProps) {
    const [formData, setFormData] = useState({
        name: method.name,
        description: method.description || '',
        courier: method.courier,
        base_cost: method.base_cost,
        cost_per_weight: method.cost_per_weight,
        cost_per_item: method.cost_per_item,
        min_order_amount: method.min_order_amount,
        max_order_amount: method.max_order_amount,
        estimated_delivery_days: method.estimated_delivery_days,
        is_active: method.is_active,
        sort_order: method.sort_order,
        settings: method.settings || {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.put(`/shipping/methods/${method.id}`, formData, {
            onSuccess: () => {
                toast.success('Shipping method updated successfully');
                router.get('/shipping/methods');
            },
            onError: () => {
                toast.error('Failed to update shipping method');
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // Handle nested settings fields
        if (name.startsWith('settings[')) {
            const settingName = name.match(/\[(.*?)\]/)?.[1];
            if (settingName) {
                setFormData(prev => ({
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [settingName]: value
                    }
                }));
                return;
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : 
                    type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <>
            <Head title="Edit Shipping Method" />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/shipping/methods')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Shipping Methods
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Edit Shipping Method</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Update shipping method configuration</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Basic Information</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Method Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Express Delivery"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Courier *
                            </label>
                            <select
                                name="courier"
                                value={formData.courier}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="custom">Custom</option>
                                <option value="pathao">Pathao</option>
                                <option value="redx">RedX</option>
                                <option value="steadfast">Steadfast</option>
                                <option value="sundarban">Sundarban</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe this shipping method..."
                            />
                        </div>

                        {/* Pricing */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Pricing</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Base Cost (৳) *
                            </label>
                            <input
                                type="number"
                                name="base_cost"
                                value={formData.base_cost}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cost Per Weight (৳/kg) *
                            </label>
                            <input
                                type="number"
                                name="cost_per_weight"
                                value={formData.cost_per_weight}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cost Per Item (৳/item) *
                            </label>
                            <input
                                type="number"
                                name="cost_per_item"
                                value={formData.cost_per_item}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Minimum Order Amount (৳)
                            </label>
                            <input
                                type="number"
                                name="min_order_amount"
                                value={formData.min_order_amount || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave empty for no minimum"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Maximum Order Amount (৳)
                            </label>
                            <input
                                type="number"
                                name="max_order_amount"
                                value={formData.max_order_amount || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave empty for no maximum"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estimated Delivery Days *
                            </label>
                            <input
                                type="number"
                                name="estimated_delivery_days"
                                value={formData.estimated_delivery_days}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="3"
                            />
                        </div>

                        {/* Settings */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Settings</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sort Order *
                            </label>
                            <input
                                type="number"
                                name="sort_order"
                                value={formData.sort_order}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Active
                            </label>
                        </div>

                        {/* Courier API Settings */}
                        {formData.courier !== 'custom' && (
                            <>
                                <div className="md:col-span-2 mt-4">
                                    <h2 className="text-lg font-semibold dark:text-white mb-4">Courier API Configuration</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Configure API credentials for {formData.courier.charAt(0).toUpperCase() + formData.courier.slice(1)} courier integration
                                    </p>
                                </div>

                                {formData.courier === 'pathao' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Store ID
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[store_id]"
                                                value={formData.settings?.store_id || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Pathao Store ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Access Token
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[access_token]"
                                                value={formData.settings?.access_token || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Pathao Access Token"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.courier === 'redx' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                API Key
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[api_key]"
                                                value={formData.settings?.api_key || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="RedX API Key"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Warehouse ID
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[warehouse_id]"
                                                value={formData.settings?.warehouse_id || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="RedX Warehouse ID"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.courier === 'steadfast' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                API Key
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[api_key]"
                                                value={formData.settings?.api_key || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Steadfast API Key"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Secret Key
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[secret_key]"
                                                value={formData.settings?.secret_key || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Steadfast Secret Key"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Hub ID
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[hub_id]"
                                                value={formData.settings?.hub_id || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Steadfast Hub ID"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.courier === 'sundarban' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                API Key
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[api_key]"
                                                value={formData.settings?.api_key || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Sundarban API Key"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Base URL (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="settings[base_url]"
                                                value={formData.settings?.base_url || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://api.sundarbancourier.com/v1"
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.get('/shipping/methods')}
                            className="px-6 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaSave />
                            Update Shipping Method
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
