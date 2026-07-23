import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateShippingZone() {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        districts: [''],
        areas: [''],
        base_rate: 0,
        additional_rate: 0,
        is_active: true,
    });

    const handleDistrictChange = (index: number, value: string) => {
        const newDistricts = [...formData.districts];
        newDistricts[index] = value;
        setFormData(prev => ({ ...prev, districts: newDistricts }));
    };

    const addDistrict = () => {
        setFormData(prev => ({ ...prev, districts: [...prev.districts, ''] }));
    };

    const removeDistrict = (index: number) => {
        if (formData.districts.length > 1) {
            const newDistricts = formData.districts.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, districts: newDistricts }));
        }
    };

    const handleAreaChange = (index: number, value: string) => {
        const newAreas = [...formData.areas];
        newAreas[index] = value;
        setFormData(prev => ({ ...prev, areas: newAreas }));
    };

    const addArea = () => {
        setFormData(prev => ({ ...prev, areas: [...prev.areas, ''] }));
    };

    const removeArea = (index: number) => {
        if (formData.areas.length > 1) {
            const newAreas = formData.areas.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, areas: newAreas }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...formData,
            districts: formData.districts.filter(d => d.trim() !== ''),
            areas: formData.areas.filter(a => a.trim() !== '').length > 0 ? formData.areas.filter(a => a.trim() !== '') : null,
        };

        router.post('/shipping/zones', submitData, {
            onSuccess: () => {
                toast.success('Shipping zone created successfully');
                router.get('/shipping/zones');
            },
            onError: () => {
                toast.error('Failed to create shipping zone');
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : 
                    type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <>
            <Head title="Create Shipping Zone" />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/shipping/zones')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Shipping Zones
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create Shipping Zone</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new shipping zone to your store</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Basic Information</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Zone Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Dhaka Metro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Zone Code *
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., dhaka_metro"
                            />
                        </div>

                        {/* Districts */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Districts *</h2>
                        </div>

                        <div className="md:col-span-2">
                            {formData.districts.map((district, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={district}
                                        onChange={(e) => handleDistrictChange(index, e.target.value)}
                                        required
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="District name"
                                    />
                                    {formData.districts.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDistrict(index)}
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDistrict}
                                className="mt-2 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                                <FaPlus />
                                Add District
                            </button>
                        </div>

                        {/* Areas */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Specific Areas (Optional)</h2>
                        </div>

                        <div className="md:col-span-2">
                            {formData.areas.map((area, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={area}
                                        onChange={(e) => handleAreaChange(index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Area name"
                                    />
                                    {formData.areas.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArea(index)}
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addArea}
                                className="mt-2 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                                <FaPlus />
                                Add Area
                            </button>
                        </div>

                        {/* Pricing */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Pricing</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Base Rate (৳) *
                            </label>
                            <input
                                type="number"
                                name="base_rate"
                                value={formData.base_rate}
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
                                Additional Rate (৳) *
                            </label>
                            <input
                                type="number"
                                name="additional_rate"
                                value={formData.additional_rate}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Settings */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold dark:text-white mb-4">Settings</h2>
                        </div>

                        <div className="md:col-span-2 flex items-center">
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
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.get('/shipping/zones')}
                            className="px-6 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaSave />
                            Save Shipping Zone
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
